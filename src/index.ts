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

  return async (res: RequestResponse, preInterceptor?: ResponseInterceptor) => {
    let result = res
    for (const fn of fns)
      result = await fn(result, preInterceptor)

    return result
  }
}

export function createRequest(config?: Partial<Config>) {
  const defaultConfig: Partial<Config> = {
    timeout: 10000,
    credentials: 'include',
    ...config,
  }
  const scheduler = new Scheduler()
  const request = scheduler.use(methodMiddleware).use(formatURL).use(headersMiddleware).use(paramsMiddleware).use(genRequestKey).use(cacheControl()).use(preventRepeatReq()).use(fetchMiddleware).compose()

  const defaultRequestInterceptor = formatRequestInterceptor(defaultConfig.requestInterceptor)
  const defaultResponseInterceptor = formatResponseInterceptor(defaultConfig.responseInterceptor)
  return async <T = RequestResponse>(url: string, data?: ParamsType | null, options?: Partial<Config>): Promise<T> => {
    const ctx: Context = {
      config: {
        url,
        params: data,
        ...defaultConfig,
        ...options,
      },
    }

    if (options?.requestInterceptor)
      ctx.config = await formatRequestInterceptor(options.requestInterceptor)(ctx.config, defaultRequestInterceptor)
    else if (defaultConfig.requestInterceptor)
      ctx.config = await defaultRequestInterceptor(ctx.config)

    if (options?.responseInterceptor) {
      ctx.config.responseInterceptor = (response: RequestResponse) => {
        const interceptor = formatResponseInterceptor(options.responseInterceptor)
        return interceptor(response, defaultResponseInterceptor)
      }
    }

    return request(ctx).then(async () => {
      if (ctx.response)
        return ctx.response as T
      if (!ctx.error.config)
        ctx.error.config = ctx.config

      ctx.config.errorHandler?.(ctx.error)
      return Promise.reject(ctx.error)
    })
  }
}
