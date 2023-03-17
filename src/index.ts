import { Scheduler } from './scheduler'

import methodMiddleware from './middlewares/method'
import paramsMiddleware from './middlewares/params'
import genRequestKey from './middlewares/genRequestKey'
import preventRepeatReq from './middlewares/preventRepeatReq'
import cacheControl from './middlewares/cacheControl'
import fetchMiddleware from './middlewares/fetch'

import type { Config, Context, ParamsType } from './interface'

export function createRequest(config?: Partial<Config>) {
  const defaultConfig: Partial<Config> = {
    timeout: 10000,
    credentials: 'include',
    ...config,
  }
  const scheduler = new Scheduler()
  const request = scheduler.use(methodMiddleware).use(paramsMiddleware).use(genRequestKey).use(cacheControl).use(preventRepeatReq).use(fetchMiddleware).compose()

  return (url: string, data?: ParamsType, options?: Partial<Config>) => {
    const ctx: Context = {
      config: {
        url,
        params: data,
        ...defaultConfig,
        ...options,
      },
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
