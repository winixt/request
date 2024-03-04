import { isFunction, isPlainObject, omit } from 'lodash-es'
import { checkHttpRequestHasBody, isURLSearchParams } from '../helpers'
import type { Context } from '../interface'

const timeoutPromise = (timeout: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject({
        type: 'TIMEOUT',
        msg: '请求超时',
      })
    }, timeout)
  })
}

const getFetchURL = (ctx: Context) => {
  if (!checkHttpRequestHasBody(ctx.config.method)) {
    let paramsStr: string
    if (isURLSearchParams(ctx.config.params))
      paramsStr = ctx.config.params.toString()

    if (isPlainObject(ctx.config.params))
      paramsStr = new URLSearchParams(ctx.config.params as any).toString()

    return paramsStr ? `${ctx.config.url}?${paramsStr}` : ctx.config.url
  }
  return ctx.config.url
}

const getFetchBody = (ctx: Context) => {
  if (checkHttpRequestHasBody(ctx.config.method)) {
    const params = ctx.config.params

    if (isPlainObject(params)) {
      if (['application/x-www-form-urlencoded', 'multipart/form-data'].includes(ctx.reqHeaders.get('Content-Type'))) {
        const formData = new FormData()
        Object.keys(params).forEach((key) => {
          formData.append(key, params[key])
        })
        return formData
      }
      return JSON.stringify(params)
    }

    return params as BodyInit
  }
}

const headersToObject = (headers: Headers) => {
  const obj = {}
  headers.forEach((value, key) => {
    obj[key] = value
  })

  return obj
}

const requestPromise = (ctx: Context) => {
  const omitKeys = ['baseURL', 'timeout', 'requestInterceptor', 'responseInterceptor', 'transformData', 'errorHandler', 'responseType']
  if (typeof ctx.config.cache !== 'string')
    omitKeys.push('cache')

  return fetch(getFetchURL(ctx), {
    ...omit(ctx.config, ['baseURL', 'timeout', 'requestInterceptor', 'responseInterceptor', 'transformData', 'errorHandler', 'responseType']),
    headers: headersToObject(ctx.reqHeaders),
    body: getFetchBody(ctx),
  }).then(async (res) => {
    if (res.type === 'opaqueredirect')
      location.href = res.url

    if (res.ok) {
      const contentType = res.headers.get('content-type')
      let data
      if (/application\/json/i.test(contentType) || ctx.config.responseType === 'json')
        data = await res.json()
      else if (/text|xml/.test(contentType) || ctx.config.responseType === 'text')
        data = await res.text()
      else if (ctx.config.responseType === 'arrayBuffer')
        data = await res.arrayBuffer()
      else if (ctx.config.responseType === 'formData')
        data = await res.formData()
      else if (ctx.config.responseType === 'blob')
        data = await res.blob()
      else
        data = await res.blob()

      let response = {
        status: res.status,
        data,
        headers: headersToObject(res.headers),
      }
      if (typeof ctx.config.responseInterceptor === 'function')
        response = await ctx.config.responseInterceptor(response)

      if (isFunction(ctx.config.transformData))
        response.data = await ctx.config.transformData(data, response)

      return response
    }

    return Promise.reject({
      response: {
        status: res.status,
        headers: headersToObject(res.headers),
      },
    })
  })
}

export default async function fetchMiddleware(ctx: Context, next: () => Promise<void>) {
  await Promise.race([timeoutPromise(ctx.config.timeout), requestPromise(ctx)])
    .then((res: any) => {
      ctx.response = res
    })
    .catch((error) => {
      ctx.error = error
    })
  await next()
}
