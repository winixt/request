import { createRequest } from '../src/index'

describe('errorHandle test', () => {
  test('response data error', async () => {
    global.fetch = (input: RequestInfo | URL, init?: RequestInit | undefined) => {
      const response = new Response(JSON.stringify({ code: 1000, msg: '业务异常' }), {
        status: 200,
        headers: {
          'content-type': 'application/json',
        },
      })
      return Promise.resolve(response)
    }
    const request = createRequest({
      baseURL: '/api',
      transformData(data) {
        if (data.code !== 0)
          return Promise.reject(data)

        return data
      },
      errorHandler: (err) => {
        // eslint-disable-next-line no-console
        console.log(err.msg)
      },
    })
    try {
      await request('/test')
    }
    catch (err) {
      expect(err.msg).toBe('业务异常')
    }
  })

  test('response data error', async () => {
    global.fetch = (input: RequestInfo | URL, init?: RequestInit | undefined) => {
      const response = new Response(JSON.stringify({ code: 1000, msg: '业务异常' }), {
        status: 500,
        headers: {
          'content-type': 'application/json',
        },
      })
      return Promise.resolve(response)
    }
    const request = createRequest({})
    try {
      await request('/test', null, {
        errorHandler: (err) => {
          // eslint-disable-next-line no-console
          console.log(err.response.status)
        },
      })
    }
    catch (err) {
      expect(err.response.status).toBe(500)
    }
  })

  test('other error', async () => {
    global.fetch = (input: RequestInfo | URL, init?: RequestInit | undefined) => {
      const response = new Response(JSON.stringify({ code: 1000, msg: '业务异常' }), {
        status: 200,
        headers: {
          'content-type': 'application/json',
        },
      })
      return new Promise((resolve) => {
        setTimeout(() => resolve(response), 20)
      })
    }
    const request = createRequest({
      baseURL: '/api',
      timeout: 1,
      errorHandler: (err) => {
        // eslint-disable-next-line no-console
        console.log(err.msg)
      },
    })
    try {
      await request('/test')
    }
    catch (err) {
      expect(err.type).toBe('TIMEOUT')
    }
  })
})
