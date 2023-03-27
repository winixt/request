import { createRequest } from '../src/index'

describe('baseURL test', () => {
  global.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    const response = new Response(JSON.stringify({ url: input, headers: init?.headers }), {
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
  test('relatively url: test', async () => {
    const content = await request('test', {
      a: 11,
    })
    expect(content.data.url).toBe('/api/test')
  })
  test('relatively url: /test', async () => {
    const content = await request('/test')
    expect(content.data.url).toBe('/api/test')
  })
})

describe('common param test', () => {
  global.fetch = (input: RequestInfo | URL, init?: RequestInit | undefined) => {
    const response = new Response(JSON.stringify(init), {
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    })
    return new Promise((resolve) => {
      setTimeout(() => resolve(response), 2000)
    })
  }
  const request = createRequest({
  })

  test('credentials default', async () => {
    const content = await request('/test')
    expect(content.data.credentials).toBe('include')
  })
  test('credentials same-origin', async () => {
    const content = await request('/test', null, {
      credentials: 'same-origin',
    })
    expect(content.data.credentials).toBe('same-origin')
  })

  test('method default', async () => {
    const content = await request('/test')
    expect(content.data.method).toBe('POST')
  })
  test('method get', async () => {
    const content = await request('/test', null, {
      method: 'get',
    })
    expect(content.data.method).toBe('GET')
  })

  test('headers', async () => {
    const content = await request('/test', null, {
      headers: { 'Content-Type': 'application/json' },
    })
    expect(content.data.headers).toEqual({
      'content-type': 'application/json',
    })
  })

  test('form headers', async () => {
    const formData = new FormData()
    formData.append('filename', 'test.pnd')
    const content = await request('/test', formData)
    expect(content.data.headers).toEqual({
      'content-type': 'application/x-www-form-urlencoded',
    })
  })

  test('timeout 200', async () => {
    try {
      await request('/test', {}, {
        timeout: 200,
      })
    }
    catch (err) {
      expect(err.type).toBe('TIMEOUT')
    }
  })
})
