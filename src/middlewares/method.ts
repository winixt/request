import type { Context, NextFn } from '../interface'

export default async (ctx: Context, next: NextFn) => {
  if (!ctx.config.method)
    ctx.config.method = 'POST'

  else
    ctx.config.method = ctx.config.method.toUpperCase()

  await next()
}
