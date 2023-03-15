import { checkHttpRequestHasBody } from '../src/helpers'

describe('baseURL test', () => {
  test('adds 1 + 2 to equal 3', async () => {
    expect(checkHttpRequestHasBody('post')).toBe(true)
  })
})
