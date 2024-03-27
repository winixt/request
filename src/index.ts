import { Scheduler } from './scheduler'

import methodMiddleware from './middlewares/method'
import paramsMiddleware from './middlewares/params'
import headersMiddleware from './middlewares/headers'
import formatURL from './middlewares/formatURL'
import genRequestKey from './middlewares/genRequestKey'
import preventRepeatReq from './middlewares/preventRepeatReq'
import cacheControl from './middlewares/cacheControl'
import fetchMiddleware from './middlewares/fetch'

import type { Config, Context, ParamsType, RequestInterceptor, RequestResponse, ResponseInterceptor } from './interface'

export * from './interface'

function interceptorToArray<T>(interceptor: T | T[]) {
  let fns: T[] = []

  if (typeof interceptor === 'function')
    fns = [interceptor]

  else if (Array.isArray(interceptor))
    fns = interceptor
  return fns
}

function formatRequestInterceptor(requestInterceptor?: RequestInterceptor | RequestInterceptor[]) {
  const fns = interceptorToArray<RequestInterceptor>(requestInterceptor)

  return async (config: Config, preRequestInterceptor?: RequestInterceptor) => {
    let result = config
    for (const fn of fns)
      result = await fn(result, preRequestInterceptor)

    return result
  }
}

function formatResponseInterceptor(interceptor?: ResponseInterceptor | ResponseInterceptor[]) {
  const fns = interceptorToArray<ResponseInterceptor>(interceptor)

  if (fns.length === 0)
    return null

  return async (res: RequestResponse, preInterceptor?: ResponseInterceptor) => {
    let result = res
    for (const fn of fns)
      result = await fn(result, preInterceptor)

    return result
  }
}

function getRequestInterceptor(config: Partial<Config> = {}) {
  return config.requestInterceptor || config.requestInterceptors
}

function getResponseInterceptor(config: Partial<Config> = {}) {
  return config.responseInterceptor || config.responseInterceptors
}

export function createRequest(config?: Partial<Config>) {
  const defaultConfig: Partial<Config> = {
    timeout: 10000,
    credentials: 'include',
    ...config,
  }
  const scheduler = new Scheduler()
  const request = scheduler.use(methodMiddleware).use(formatURL).use(headersMiddleware).use(paramsMiddleware).use(genRequestKey).use(cacheControl()).use(preventRepeatReq()).use(fetchMiddleware).compose()

  const defaultRequestInterceptor = formatRequestInterceptor(getRequestInterceptor(defaultConfig))
  const defaultResponseInterceptor = formatResponseInterceptor(getResponseInterceptor(defaultConfig))
  return async <T = any>(url: string, data?: ParamsType | null, options?: Partial<Config>): Promise<RequestResponse<T>> => {
    const ctx: Context = {
      config: {
        url,
        params: data,
        ...defaultConfig,
        ...options,
      },
    }

    if (getRequestInterceptor(options))
      ctx.config = await formatRequestInterceptor(getRequestInterceptor(options))(ctx.config, defaultRequestInterceptor)
    else if (getRequestInterceptor(defaultConfig))
      ctx.config = await defaultRequestInterceptor(ctx.config)

    if (getResponseInterceptor(options)) {
      ctx.config.responseInterceptor = (response: RequestResponse) => {
        const interceptor = formatResponseInterceptor(getResponseInterceptor(options))
        return interceptor(response, defaultResponseInterceptor)
      }
    }
    else if (defaultResponseInterceptor) {
      ctx.config.responseInterceptor = defaultResponseInterceptor
    }
    else {
      ctx.config.responseInterceptor = null
    }

    return request(ctx).then(async () => {
      if (ctx.response)
        return ctx.response
      if (!ctx.error.config)
        ctx.error.config = ctx.config

      ctx.config.errorHandler?.(ctx.error)
      return Promise.reject(ctx.error)
    })
  }
}
