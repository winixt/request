import { isPlainObject } from 'lodash-es'

export function isURLSearchParams(obj) {
  return Object.prototype.toString.call(obj) === '[object URLSearchParams]'
}

export function checkHttpRequestHasBody(method) {
  method = method.toUpperCase()
  const HTTP_METHOD = {
    GET: {
      request_body: false,
    },
    POST: {
      request_body: true,
    },
    PUT: {
      request_body: true,
    },
    DELETE: {
      request_body: true,
    },
    HEAD: {
      request_body: false,
    },
    OPTIONS: {
      request_body: false,
    },
    PATCH: {
      request_body: true,
    },
  }
  return HTTP_METHOD[method].request_body
}

export function trimObj(obj) {
  if (isPlainObject(obj)) {
    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value === 'string')
        obj[key] = value.trim()

      else if (isPlainObject(value))
        trimObj(value)
    })
  }
}
