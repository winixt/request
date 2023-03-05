import { Scheduler } from './scheduler'

import methodMiddleware from './middlewares/method'
import paramsMiddleware from './middlewares/params'
import genRequestKey from './middlewares/genRequestKey'
import preventRepeatReq from './preventRepeatReq'
import cacheControl from './cacheControl'
import fetchMiddleware from './middlewares/fetch'

import type { Config, ParamsType } from './interface'

export function createRequest(config?: Config) {
  const defaultConfig: Config = {
    timeout: 10000,
    credentials: 'include',
    ...config,
  }
  const scheduler = new Scheduler()
  const request = scheduler.use(methodMiddleware).use(paramsMiddleware).use(genRequestKey).use(cacheControl).use(preventRepeatReq).use(fetchMiddleware).compose()

  return (url: string, data?: ParamsType, options?: Config) => {
    return request({
      url,
      params: data,
      config: {
        ...defaultConfig,
        ...options,
      },
    })
  }
}
