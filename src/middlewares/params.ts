import { checkHttpRequestHasBody, trimObj } from '../helpers'
import type { Context, NextFn } from '../interface'

export default async (ctx: Context, next: NextFn) => {
  if (checkHttpRequestHasBody(ctx.config.method))
    trimObj(ctx.params)

  await next()
}
