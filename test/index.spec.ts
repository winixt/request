import { createRequest } from '../src/index'

describe('baseURL test', () => {
  global.fetch = (input: RequestInfo | URL, init?: RequestInit | undefined) => {
    const response = new Response(JSON.stringify({ url: input }), {
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    })
    return Promise.resolve(response)
  }
  const request = createRequest({
    baseURL: '/api',
  })
  test('absolute url', async () => {
    const content = await request('https://fesjs.mumblefe.cn/test')
    expect(content.data.url).toBe('https://fesjs.mumblefe.cn/test')
  })
})
