import type { Context } from '../interface'

export default async function fetchMiddleware(ctx: Context, next: () => Promise<void>) {
  try {
    ctx.response = fetch(ctx.config.url)
  }
  catch (err) {
    ctx.error = err
  }
  await next()
}
