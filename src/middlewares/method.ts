import type { Context, Next } from '../interface'

export default async (ctx: Context, next: Next) => {
  if (!ctx.config.method)
    ctx.config.method = 'POST'

  else
    ctx.config.method = ctx.config.method.toUpperCase()

  await next()
}
