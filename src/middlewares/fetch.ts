import { isPlainObject, omit } from 'lodash-es'
import { checkHttpRequestHasBody, isURLSearchParams } from '../helpers'
import type { Context } from '../interface'

const timeoutPromise = (timeout: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
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
    if (isPlainObject(ctx.params))
      return JSON.stringify(ctx.params)

    return ctx.params as BodyInit
  }
}

const requestPromise = (ctx: Context) => {
  return fetch(getFetchURL(ctx), {
    ...omit(ctx.config, ['baseURL', 'timeout', 'transformParams', 'transformData']),
    body: getFetchBody(ctx),
  })
}

export default async function fetchMiddleware(ctx: Context, next: () => Promise<void>) {
  Promise.race([timeoutPromise(ctx.config.timeout), requestPromise(ctx)])
    .then((res: any) => {
      if (res.type === 'TIMEOUT')
        ctx.error = res
    })
    .catch((error) => {
      ctx.error = error
    })
  await next()
}
