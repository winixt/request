import type { Context, NextFn } from '../interface'

export default async (ctx: Context, next: NextFn) => {
  if (ctx.config.baseURL)
    ctx.url = `${ctx.config.baseURL}/${ctx.url}`.replace(/\/{2,}/, '/')

  await next()
}
