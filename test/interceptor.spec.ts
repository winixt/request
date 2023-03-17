import { createRequest } from '../src/index'

describe('interceptor test', () => {
  global.fetch = (input: RequestInfo | URL, init?: RequestInit | undefined) => {
    const response = new Response(JSON.stringify({ url: input }), {
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    })
    return Promise.resolve(response)
  }

  test('request interceptor ', async () => {
    const request = createRequest({
      baseURL: '/api',
      requestInterceptor(config) {
        config.baseURL = '/api2'
        return config
      },
    })
    const content1 = await request('/test')
    expect(content1.data.url).toBe('/api2/test')

    const content2 = await request('/test', null, {
      requestInterceptor(config) {
        config.baseURL = '/api3'
        return config
      },
    })
    expect(content2.data.url).toBe('/api3/test')
  })

  test('response interceptor ', async () => {
    const request = createRequest({
      baseURL: '/api',
      responseInterceptor(response) {
        response.data.url = '/api2/test'
        return response
      },
    })
    const content1 = await request('/test')
    expect(content1.data.url).toBe('/api2/test')

    const content2 = await request('/test', null, {
      responseInterceptor(response) {
        response.data.url = '/api3/test'
        return response
      },
    })
    expect(content2.data.url).toBe('/api3/test')
  })
})
