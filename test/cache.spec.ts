import { createRequest } from '../src/index'

describe('cache test', () => {
  global.fetch = (input: RequestInfo | URL, init?: RequestInit | undefined) => {
    const response = new Response(JSON.stringify({ count: 1 }), {
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    })
    return Promise.resolve(response)
  }

  test('cache default', async () => {
    let requestCount = 0
    const request = createRequest({
      baseURL: '/api',
      cacheData: true,
      transformData(data) {
        requestCount++
        data.count = 2
        return data
      },
    })
    const content1 = await request('/test')
    const content2 = await request('/test')
    expect(requestCount).toBe(1)
    expect(content1.data).toEqual({ count: 2 })
    expect(content2.data).toEqual({ count: 2 })
  })

  test('cache time', async () => {
    let requestCount = 0
    const request = createRequest({
      baseURL: '/api',
      cacheData: {
        cacheTime: 200,
      },
      transformData(data) {
        requestCount++
        return data
      },
    })
    await request('/test')
    await new Promise(resolve => setTimeout(resolve, 500))
    await request('/test')
    expect(requestCount).toBe(2)
  })
})
