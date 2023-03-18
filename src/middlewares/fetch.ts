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
    if (isURLSearchParams(ctx.config.params))
      return `${ctx.config.url}?${ctx.config.params.toString()}`

    if (isPlainObject(ctx.config.params))
      return `${ctx.config.url}?${new URLSearchParams(ctx.config.params as any).toString()}`
  }
  return ctx.config.url
}

const getFetchBody = (ctx: Context) => {
  if (checkHttpRequestHasBody(ctx.config.method)) {
    const headers = new Headers(ctx.config.headers)
    const params = ctx.config.params

    if (isPlainObject(params)) {
      if (headers.get('Content-Type') === 'application/x-www-form-urlencoded') {
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
  return fetch(getFetchURL(ctx), {
    ...omit(ctx.config, ['baseURL', 'timeout', 'requestInterceptor', 'responseInterceptor', 'transformData', 'errorHandler', 'responseType']),
    body: getFetchBody(ctx),
  }).then(async (res) => {
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
      if (ctx.config.responseInterceptor)
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
