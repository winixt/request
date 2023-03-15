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
  if (!checkHttpRequestHasBody(ctx.config.method) && isPlainObject(ctx.params)) {
    if (isURLSearchParams(ctx.params))
      return `${ctx.url}?${ctx.params.toString()}`

    if (isPlainObject(ctx.params))
      return `${ctx.url}?${new URLSearchParams(ctx.params as any).toString()}`
  }
  return ctx.url
}

const getFetchBody = (ctx: Context) => {
  if (checkHttpRequestHasBody(ctx.config.method)) {
    const headers = new Headers(ctx.config.headers)
    let params = ctx.params
    if (isFunction(ctx.config.transformParams))
      params = ctx.config.transformParams(ctx.params)

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
    ...omit(ctx.config, ['baseURL', 'timeout', 'transformParams', 'transformData', 'responseType']),
    body: getFetchBody(ctx),
  }).then((res) => {
    if (res.ok) {
      const contentType = res.headers.get('content-type')
      let data
      if (/application\/json/i.test(contentType) || ctx.config.responseType === 'json')
        data = res.json()
      else if (/text|xml/.test(contentType) || ctx.config.responseType === 'text')
        data = res.text()
      else if (ctx.config.responseType === 'arrayBuffer')
        data = res.arrayBuffer()
      else if (ctx.config.responseType === 'formData')
        data = res.formData()
      else if (ctx.config.responseType === 'blob')
        data = res.blob()
      else
        data = res.blob()

      if (isFunction(ctx.config.transformData))
        data = ctx.config.transformData(data)

      return {
        status: res.status,
        data,
        headers: headersToObject(res.headers),
      }
    }

    return Promise.reject({
      config: ctx.config,
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
