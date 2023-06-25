import { isPlainObject } from 'lodash-es'
import type { Context, NextFn } from '../interface'

export default async (ctx: Context, next: NextFn) => {
  ctx.reqHeaders = new Headers(ctx.config.headers)
  if (!ctx.reqHeaders.has('Content-Type')) {
    if (ctx.config.params instanceof FormData)
      ctx.reqHeaders.set('Content-Type', 'application/x-www-form-urlencoded')

    else if (isPlainObject(ctx.config.params))
      ctx.reqHeaders.set('Content-Type', 'application/json')
  }

  await next()
}
