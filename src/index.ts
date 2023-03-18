import { Scheduler } from './scheduler'

import methodMiddleware from './middlewares/method'
import paramsMiddleware from './middlewares/params'
import formatURL from './middlewares/formatURL'
import genRequestKey from './middlewares/genRequestKey'
import preventRepeatReq from './middlewares/preventRepeatReq'
import cacheControl from './middlewares/cacheControl'
import fetchMiddleware from './middlewares/fetch'

import type { Config, Context, ParamsType, RequestResponse } from './interface'

export * from './interface'

export function createRequest(config?: Partial<Config>) {
  const defaultConfig: Partial<Config> = {
    timeout: 10000,
    credentials: 'include',
    ...config,
  }
  const scheduler = new Scheduler()
  const request = scheduler.use(methodMiddleware).use(formatURL).use(paramsMiddleware).use(genRequestKey).use(cacheControl()).use(preventRepeatReq()).use(fetchMiddleware).compose()

  return async (url: string, data?: ParamsType | null, options?: Partial<Config>) => {
    const ctx: Context = {
      config: {
        url,
        params: data,
        ...defaultConfig,
        ...options,
      },
    }

    if (options?.requestInterceptor)
      ctx.config = await options.requestInterceptor(ctx.config, defaultConfig.requestInterceptor)
    else if (defaultConfig.requestInterceptor)
      ctx.config = await defaultConfig.requestInterceptor(ctx.config)

    if (options?.responseInterceptor) {
      ctx.config.responseInterceptor = (response: RequestResponse) => {
        return options.responseInterceptor(response, defaultConfig.responseInterceptor)
      }
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
