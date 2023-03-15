import type { Context, NextFn } from '../interface'

function isAbsoluteURL(url: string) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url)
}

export default async (ctx: Context, next: NextFn) => {
  if (ctx.config.baseURL && !isAbsoluteURL(ctx.url))
    ctx.url = `${ctx.config.baseURL}/${ctx.url}`.replace(/\/{2,}/, '/')

  await next()
}
