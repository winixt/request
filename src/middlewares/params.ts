import { checkHttpRequestHasBody, trimObj } from '../helpers'
import type { Context, Next } from '../interface'

export default async (ctx: Context, next: Next) => {
  if (checkHttpRequestHasBody(ctx.config.method))
    trimObj(ctx.params)

  await next()
}
