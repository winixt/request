import type { Context, NextFn } from '../interface'

export default () => {
  const requestMap = new Map()

  const mergeRequestMap = new Map()
  const requestQueue = new Map()

  function handleCachingStart(ctx: Context) {
    const isRequesting = mergeRequestMap.get(ctx.key)
    if (isRequesting) {
      return new Promise((resolve) => {
        const queue = requestQueue.get(ctx.key) || []
        requestQueue.set(ctx.key, queue.concat(resolve))
      })
    }
    mergeRequestMap.set(ctx.key, true)
  }

  function handleRepeatRequest(ctx: Context) {
    const queue = requestQueue.get(ctx.key)
    if (queue && queue.length > 0) {
      queue.forEach((resolve) => {
        if (ctx.error) {
          resolve({
            error: ctx.error,
          })
        }
        else {
          resolve({
            response: ctx.response,
          })
        }
      })
    }
    requestQueue.delete(ctx.key)
    mergeRequestMap.delete(ctx.key)
  }

  return async (ctx: Context, next: NextFn) => {
    if (ctx.key) {
      if (ctx.config.mergeRequest) {
        const result = await handleCachingStart(ctx)
        if (result) {
          Object.keys(result).forEach((key) => {
            ctx[key] = result[key]
          })
          return
        }
      }
      else {
        if (requestMap.get(ctx.key) && !ctx.config.mergeRequest)
          console.warn('[request]: 重复请求, 可通过 mergeRequest 参数优化', ctx.config)

        requestMap.set(ctx.key, true)
      }
    }

    await next()

    if (ctx.key) {
      if (ctx.config.mergeRequest)
        handleRepeatRequest(ctx)
      else
        requestMap.delete(ctx.key)
    }
  }
}
