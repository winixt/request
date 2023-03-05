import type { Context, Middleware } from './interface'

export class Scheduler {
  middlewares: Middleware[]

  constructor() {
    this.middlewares = []
  }

  use(fn: Middleware) {
    this.middlewares.push(fn)
    return this
  }

  compose() {
    return (ctx: Context, next?: () => Promise<void>) => {
      let index = -1
      const dispatch = (i: number) => {
        if (i <= index)
          return Promise.reject(new Error('next() called multiple times'))
        index = i
        let fn = this.middlewares[i]
        if (index === this.middlewares.length)
          fn = next
        if (!fn)
          return Promise.resolve()
        try {
          return Promise.resolve(fn(ctx, dispatch.bind(null, i + 1)))
        }
        catch (e) {
          return Promise.reject(e)
        }
      }
      return dispatch(0)
    }
  }
}
