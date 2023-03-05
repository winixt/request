import { isPlainObject } from 'lodash-es'
import { isURLSearchParams } from '../helpers'
import type { Context, NextFn, ParamsType } from '../interface'

/**
 * 唯一定位一个请求（url, data | params, method）
 * 如果 params 有值，并且无法序列化，则不生成 key
 */
const stringifyParams = (params: ParamsType) => {
  if (isURLSearchParams(params))
    return params.toString()

  if (typeof params === 'string')
    return params

  if (isPlainObject(params))
    return JSON.stringify(params)

  return ''
}

export default async function genRequestKey(ctx: Context, next: NextFn) {
  if (!ctx.params) {
    ctx.key = `${ctx.url}${ctx.config.method}`
  }
  else {
    const result = stringifyParams(ctx.params)
    if (result)
      ctx.key = `${ctx.url}${result}${ctx.config.method}`
  }

  await next()
}
