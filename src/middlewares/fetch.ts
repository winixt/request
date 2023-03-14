import { isPlainObject, omit } from 'lodash-es'
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

    if (isPlainObject(ctx.params)) {
      if (headers.get('Content-Type') === 'application/x-www-form-urlencoded') {
        const formData = new FormData()
        Object.keys(ctx.params).forEach((key) => {
          formData.append(key, ctx.params[key])
        })
        return formData
      }
      return JSON.stringify(ctx.params)
    }

    return ctx.params as BodyInit
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
    ...omit(ctx.config, ['baseURL', 'timeout', 'transformParams', 'transformData']),
    body: getFetchBody(ctx),
  }).then((res) => {
    if (res.ok) {
      const contentType = res.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        return {
          status: res.status,
          data: res.json(),
          headers: headersToObject(res.headers),
        }
      }
      return res
    }

    return Promise.reject({
      status: res.status,
      headers: headersToObject(res.headers),
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
