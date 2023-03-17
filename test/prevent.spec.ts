import { createRequest } from '../src/index'

describe('prevent repeat request test', () => {
  global.fetch = (input: RequestInfo | URL, init?: RequestInit | undefined) => {
    const response = new Response(JSON.stringify({ count: 1 }), {
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    })
    return Promise.resolve(response)
  }

  test('mergeRequest', async () => {
    let requestCount = 0
    const request = createRequest({
      baseURL: '/api',
      mergeRequest: true,
      transformData(data) {
        requestCount++
        data.count = 2
        return data
      },
    })
    await Promise.all([request('/test'), request('/test')])
    expect(requestCount).toBe(1)
  })
})
