import { createRequest } from '../src/index'
import type { RequestResponse } from '../src/interface'

interface User {
  id: number
  name: string
}

describe('generics test', () => {
  beforeEach(() => {
    global.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
      const body = init?.body
      const response = new Response(JSON.stringify({ id: 1, name: 'tom', body }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })
      return Promise.resolve(response)
    }) as typeof fetch
  })

  const request = createRequest({})

  test('response.data is typed as T', async () => {
    const res = await request<User>('/user')
    expect(res.data.id).toBe(1)
    expect(res.data.name).toBe('tom')

    // type-level: res is RequestResponse<User>
    const assertion: RequestResponse<User> = res
    expect(assertion).toBe(res)
  })

  test('transformData must return T', async () => {
    const res = await request<User>('/user', null, {
      transformData: data => ({ id: data.id, name: data.name }),
    })
    expect(res.data.id).toBe(1)
  })
})
