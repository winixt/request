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

function formatRequestInterceptor<T = any>(requestInterceptor?: RequestInterceptor<T> | RequestInterceptor<T>[]) {
  const fns = interceptorToArray<RequestInterceptor<T>>(requestInterceptor)

  return async (config: Config<T>, preRequestInterceptor?: RequestInterceptor<T>) => {
    let result = config
    for (const fn of fns)
      result = await fn(result, preRequestInterceptor)

    return result
  }
}

function formatResponseInterceptor<T = any>(interceptor?: ResponseInterceptor<T> | ResponseInterceptor<T>[]) {
  const fns = interceptorToArray<ResponseInterceptor<T>>(interceptor)

  if (fns.length === 0)
    return null

  return async (res: RequestResponse<T>, preInterceptor?: ResponseInterceptor<T>) => {
    let result = res
    for (const fn of fns)
      result = await fn(result, preInterceptor)

    return result
  }
}

function getRequestInterceptor<T = any>(config: Partial<Config<T>> = {}) {
  return config.requestInterceptor || config.requestInterceptors
}

function getResponseInterceptor<T = any>(config: Partial<Config<T>> = {}) {
  return config.responseInterceptor || config.responseInterceptors
}

export function createRequest(config?: Partial<Config>) {
  const scheduler = new Scheduler()
  const _request = scheduler.use(methodMiddleware).use(formatURL).use(headersMiddleware).use(paramsMiddleware).use(genRequestKey).use(cacheControl()).use(preventRepeatReq()).use(fetchMiddleware).compose()

  const defaultConfig: Partial<Config> = {
    credentials: 'include',
    ...config,
  }

  let defaultRequestInterceptor = formatRequestInterceptor(getRequestInterceptor(defaultConfig))
  let defaultResponseInterceptor = formatResponseInterceptor(getResponseInterceptor(defaultConfig))

  const request = async <T = any>(url: string, data?: ParamsType | null, options?: Partial<Config<T>>): Promise<RequestResponse<T>> => {
    if (typeof options === 'string') {
      options = {
        method: options,
      }
    }
    const ctx: Context = {
      config: {
        url,
        params: data,
        ...defaultConfig,
        ...options,
      },
    }

    try {
      if (getRequestInterceptor<T>(options))
        ctx.config = await formatRequestInterceptor<T>(getRequestInterceptor<T>(options))(ctx.config, defaultRequestInterceptor as RequestInterceptor<T>)
      else if (getRequestInterceptor(defaultConfig))
        ctx.config = await defaultRequestInterceptor(ctx.config)

      if (getResponseInterceptor<T>(options)) {
        ctx.config.responseInterceptor = (response: RequestResponse<T>) => {
          const interceptor = formatResponseInterceptor<T>(getResponseInterceptor<T>(options))
          return interceptor(response, defaultResponseInterceptor as ResponseInterceptor<T>)
        }
      }
      else if (defaultResponseInterceptor) {
        ctx.config.responseInterceptor = defaultResponseInterceptor
      }
      else {
        ctx.config.responseInterceptor = null
      }

      return _request(ctx).then(async () => {
        if (ctx.response)
          return ctx.response as RequestResponse<T>
        if (!ctx.error.config)
          ctx.error.config = ctx.config

        ctx.config.errorHandler?.(ctx.error)
        return Promise.reject(ctx.error)
      })
    }
    catch (err) {
      ctx.config.errorHandler?.(err)
      throw err
    }
  }

  function setConfig(config: Partial<Config>) {
    Object.assign(defaultConfig, {
      ...config,
    })
    defaultRequestInterceptor = formatRequestInterceptor(getRequestInterceptor(defaultConfig))
    defaultResponseInterceptor = formatResponseInterceptor(getResponseInterceptor(defaultConfig))
  }

  request.setConfig = setConfig

  return request
}
