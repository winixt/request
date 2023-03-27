import type { Context, NextFn } from '../interface'

export default async (ctx: Context, next: NextFn) => {
  ctx.reqHeaders = new Headers(ctx.config.headers)
  if (ctx.config.params instanceof FormData) {
    if (!ctx.reqHeaders.has('Content-Type'))
      ctx.reqHeaders.set('Content-Type', 'application/x-www-form-urlencoded')
  }

  await next()
}
