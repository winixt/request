import type { Context, NextFn } from '../interface'

function isAbsoluteURL(url: string) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url)
}

function combineURLs(baseURL: string, relativeURL: string) {
  return relativeURL ? `${baseURL.replace(/\/+$/, '')}/${relativeURL.replace(/^\/+/, '')}` : baseURL
}

export default async (ctx: Context, next: NextFn) => {
  if (ctx.config.baseURL && !isAbsoluteURL(ctx.config.url))
    ctx.config.url = combineURLs(ctx.config.baseURL, ctx.config.url)

  await next()
}
