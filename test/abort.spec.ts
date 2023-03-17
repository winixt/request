import { createRequest } from '../src/index'

describe('prevent repeat request test', () => {
  test('mergeRequest', async () => {
    const controller = new AbortController()
    const request = createRequest({})
    try {
      const result = request('https://fesjs.mumblefe.cn/test', null, {
        signal: controller.signal,
      })
      controller.abort()
      await result
    }
    catch (err) {
      expect(err.message).toBe('This operation was aborted')
    }
  })
})
