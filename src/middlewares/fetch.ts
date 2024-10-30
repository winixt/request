import { isFunction, isPlainObject, omit } from 'lodash-es'
import { checkHttpRequestHasBody, isURLSearchParams } from '../helpers'
import type { Context, RequestResponse } from '../interface'

const timeoutPromise = (timeout: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject({
        type: 'TIMEOUT',
        msg: '请求超时',
      })
    }, timeout || 10000)
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
      if (ctx.reqHeaders.get('Content-Type') === 'application/x-www-form-urlencoded') {
        const searchParams = new URLSearchParams()
        Object.keys(params).forEach((key) => {
          searchParams.set(key, params[key])
        })
        return searchParams.toString()
      }
      else if (ctx.reqHeaders.get('Content-Type') === 'multipart/form-data') {
        const formData = new FormData()
        Object.keys(params).forEach((key) => {
          formData.append(key, params[key])
        })
        return formData
      }
      return JSON.stringify(params)
    }
    else if (Array.isArray(params)) {
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

function getResponseType(ctx: Context, contentType: string) {
  if (ctx.config.responseType)
    return ctx.config.responseType

  if (/application\/json/i.test(contentType))
    return 'json'
  else if (/text|xml/.test(contentType))
    return 'text'
  else if (/application\/octet-stream/i.test(contentType))
    return 'blob'

  return 'blob'
}

async function getResponseData(ctx: Context, res: Response) {
  const contentType = res.headers.get('content-type')
  try {
    const dataType = getResponseType(ctx, contentType)
    let data

    if (dataType === 'json')
      data = await res.json()
    else if (dataType === 'text')
      data = await res.text()
    else if (dataType === 'blob')
      data = await res.blob()
    else if (dataType === 'arrayBuffer')
      data = await res.arrayBuffer()
    else if (dataType === 'formData')
      data = await res.formData()
    else
      data = await res.blob()

    return data
  }
  catch (err) {
    throw new Error(`response body parsing failed: ${err.message}`)
  }
}

const requestPromise = (ctx: Context) => {
  const omitKeys = ['baseURL', 'timeout', 'requestInterceptor', 'requestInterceptors', 'responseInterceptor', 'responseInterceptors', 'transformData', 'errorHandler', 'responseType']
  if (typeof ctx.config.cache !== 'string')
    omitKeys.push('cache')

  return fetch(getFetchURL(ctx), {
    ...omit(ctx.config, omitKeys),
    headers: headersToObject(ctx.reqHeaders),
    body: getFetchBody(ctx),
  }).then(async (res) => {
    if (res.type === 'opaqueredirect')
      location.href = res.url

    if (res.ok) {
      return {
        status: res.status,
        data: await getResponseData(ctx, res),
        headers: headersToObject(res.headers),
        config: ctx.config,
      }
    }

    return Promise.reject({
      response: {
        status: res.status,
        data: await getResponseData(ctx, res),
        headers: headersToObject(res.headers),
        config: ctx.config,
      },
    })
  })
}

function raceToSuccess(promises) {
  return new Promise((resolve, reject) => {
    const results = []

    // 用于跟踪同时完成的 promise
    const settledPromises = promises.map(p =>
      p.then(
        (value: any) => {
          const result = { status: 'fulfilled', value }
          results.push(result)
          return result
        },
        (reason: any) => {
          const result = { status: 'rejected', reason }
          results.push(result)
          return result
        },
      ),
    )

    // 监听第一个完成的 promise, 不能直接用 Promise.race, 因为 js 事件循环种，如果多个 promise 在一个事件周期中一起完成，会优先调用 reject
    Promise.race(settledPromises).then(async (firstResult) => {
      if (firstResult.status === 'fulfilled') {
        resolve(firstResult.value)
      }
      else {
        if (firstResult.reason?.type === 'TIMEOUT') {
          setTimeout(() => {
            const successRst = results.find(item => item.status === 'fulfilled')
            if (successRst)
              resolve(firstResult.value)
            else
              reject(firstResult.reason)
          })
        }
        else {
          reject(firstResult.reason)
        }
      }
    })
  })
}

export default async function fetchMiddleware(ctx: Context, next: () => Promise<void>) {
  await raceToSuccess([requestPromise(ctx), timeoutPromise(ctx.config.timeout)])
    .then(async (res: RequestResponse) => {
      if (typeof ctx.config.responseInterceptor === 'function')
        res = await ctx.config.responseInterceptor(res)

      if (isFunction(ctx.config.transformData))
        res.data = await ctx.config.transformData(res.data, res)

      ctx.response = res
    })
    .catch((error) => {
      ctx.error = error
    })
  await next()
}
