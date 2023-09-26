import { isPlainObject } from 'lodash-es'
import type { Context, NextFn } from '../interface'

function hasBlob(formData: FormData) {
  for (const [_, value] of formData.entries()) {
    if (value instanceof Blob)
      return true
  }
  return false
}

export default async (ctx: Context, next: NextFn) => {
  ctx.reqHeaders = new Headers(ctx.config.headers)
  if (!ctx.reqHeaders.has('Content-Type')) {
    if (ctx.config.params instanceof FormData) {
      if (hasBlob(ctx.config.params))
        ctx.reqHeaders.set('Content-Type', 'multipart/form-data')

      else
        ctx.reqHeaders.set('Content-Type', 'application/x-www-form-urlencoded')
    }

    else if (isPlainObject(ctx.config.params)) {
      ctx.reqHeaders.set('Content-Type', 'application/json')
    }
  }

  await next()
}
