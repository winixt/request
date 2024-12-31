import { cloneDeep, isPlainObject, isString } from 'lodash-es'
import type { CacheConfig, Context, NextFn } from '../interface'
import { isURLSearchParams } from '../helpers'

/**
 * 缓存实现的功能
 * 1. 唯一定位一个请求（url, data | params, method）
 *      其中请求参数根据请求方法使用其中一个就够了
 *      一个请求同时包含 data | params 参数的设计本身不合理
 *      不对这种情况进行兼容
 * 2. 控制缓存内容的大小，localStorage 只有5M
 * 3. 控制缓存时间
 *      session(存在内存中)
 *      expireTime 存在localStorage 中
 * 4. 成功的、且响应内容为json的请求进行缓存
 */

/**
 * 配置数据
 * type: 'ram' | 'sessionStorage' | 'localStorage'
 * cacheTime: ''
 */

/**
 * 缓存数据结构
 * cache: {
 *      url: 'url', // 缓存 url
 *      data: data, // 数据
 *      expire: '' // 缓存时间
 * }
 */

/**
 * 请求参数可以为如下类型
 * - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
 * - Browser only: FormData, File, Blob
 * 只缓存参数类型为: string、plain object、URLSearchParams 或者无参数的 请求
 */

const CACHE_KEY_PREFIX = '__REQUEST_CACHE:'
const CACHE_TYPE = {
  ram: 'ram',
  session: 'sessionStorage',
  local: 'localStorage',
}
const DEFAULT_CACHE_TIME = 1000 * 60 * 3

function genInnerKey(key: string, cacheType = 'ram') {
  if (cacheType !== CACHE_TYPE.ram)
    return `${CACHE_KEY_PREFIX}${key}`

  return key
}

function getFormattedCache(ctx: Context): CacheConfig {
  if (typeof ctx.config.cacheData === 'object')
    return ctx.config.cacheData

  if (typeof ctx.config.cache === 'object')
    return ctx.config.cache

  return {
    cacheType: 'ram',
    cacheTime: DEFAULT_CACHE_TIME,
  }
}

function canCache(data: any) {
  return isPlainObject(data) || isString(data) || Array.isArray(data) || isURLSearchParams(data)
}

function isExpire({ expire, cacheTime }) {
  if (!cacheTime || expire >= Date.now())
    return false

  return true
}

interface CacheData {
  cacheType: string
  data: any
  cacheTime: number
  expire: number
}

class RamCache {
  data: Map<string, CacheData>
  constructor() {
    this.data = new Map()
  }

  get(key: string) {
    const result = this.data.get(key)
    if (result && isExpire(result)) {
      this.data.delete(key)
      return null
    }
    return result ? cloneDeep(result.data) : null
  }

  set(key: string, value: CacheData) {
    // 超时清理数据
    this.data.forEach((value, key, map) => {
      if (isExpire(value))
        map.delete(key)
    })
    if (this.data.size > 1000) {
      console.warn('Request: raw cache is exceed 1000 item, please check cache size')
      return
    }

    this.data.set(key, value)
  }

  delete(key: string) {
    this.data.delete(key)
  }
}

export default () => {
  const rawCacheImpl = new RamCache()

  function setCacheData({ key, cacheType = 'ram', data, cacheTime = DEFAULT_CACHE_TIME }) {
    const _key = genInnerKey(key, cacheType)

    const currentCacheData = {
      cacheType,
      data,
      cacheTime,
      expire: Date.now() + cacheTime,
    }
    if (cacheType !== CACHE_TYPE.ram) {
      const cacheInstance: any = window[CACHE_TYPE[cacheType]]
      try {
        cacheInstance.setItem(_key, JSON.stringify(currentCacheData))
      }
      catch (e) {
      // setItem 出现异常，清理缓存
        for (const item in cacheInstance) {
          if (item.startsWith(CACHE_KEY_PREFIX) && Object.prototype.hasOwnProperty.call(cacheInstance, item))
            cacheInstance.removeItem(item)
        }
      }
    }
    else {
      rawCacheImpl.set(_key, currentCacheData)
    }
  }

  function getCacheData({ key, cacheType = 'ram' }) {
    const _key = genInnerKey(key, cacheType)
    if (cacheType !== CACHE_TYPE.ram) {
      const cacheInstance: any = window[CACHE_TYPE[cacheType]]
      const text = cacheInstance.getItem(_key) || null
      try {
        const currentCacheData = JSON.parse(text)
        if (currentCacheData && !isExpire(currentCacheData))
          return currentCacheData.data

        cacheInstance.removeItem(_key)
        return null
      }
      catch (e) {
        cacheInstance.removeItem(_key)
        return null
      }
    }
    else {
      return rawCacheImpl.get(_key)
    }
  }
  function clearCacheData({ key, cacheType = 'ram' }) {
    const _key = genInnerKey(key, cacheType)
    if (cacheType !== CACHE_TYPE.ram) {
      const cacheInstance: any = window[CACHE_TYPE[cacheType]]
      cacheInstance.removeItem(_key)
    }
    else {
      return rawCacheImpl.delete(_key)
    }
  }

  // 存储缓存队列
  const cacheStartFlag = new Map()
  const cachingQueue = new Map()

  /**
 * 等上一次请求结果
 * 1. 如果上一次请求成功，直接使用上一次的请求结果
 * 2. 如果上一次请求失败，重启本次请求
 */
  function handleCachingStart(ctx: Context, cacheConfig: CacheConfig) {
    const _key = genInnerKey(ctx.key, cacheConfig.cacheType)
    const caching = cacheStartFlag.get(_key)
    if (caching) {
      return new Promise((resolve) => {
        const queue = cachingQueue.get(_key) || []
        cachingQueue.set(_key, queue.concat(resolve))
      })
    }
    cacheStartFlag.set(_key, true)
  }

  // 有请求成功的
  function handleCachingQueueSuccess(ctx: Context, cacheConfig: CacheConfig) {
  // 移除首次缓存 flag
    const _key = genInnerKey(ctx.key, cacheConfig.cacheType)
    const queue = cachingQueue.get(_key)
    if (queue && queue.length > 0) {
      queue.forEach((resolve) => {
        resolve({
          response: ctx.response,
        })
      })
    }
    cachingQueue.delete(_key)
    cacheStartFlag.delete(_key)
  }

  // 处理请求失败
  function handleCachingQueueError(ctx: Context, cacheConfig: CacheConfig) {
    const _key = genInnerKey(ctx.key, cacheConfig.cacheType)
    const queue = cachingQueue.get(_key)
    if (queue && queue.length > 0) {
      const firstResolve = queue.shift()
      firstResolve()
      cachingQueue.set(_key, queue)
    }
    else {
      cachingQueue.delete(_key)
      cacheStartFlag.delete(_key)
    }
  }

  function applyRequestCache(ctx: Context) {
    if (ctx.config.cacheData || (ctx.config.cache && typeof ctx.config.cache !== 'string')) {
      if (ctx.key)
        return true

      console.warn(`request: ${ctx.config.url} 请求参数无法序列化，无法缓存，请移除相关配置`)
      return false
    }
    return false
  }

  return async (ctx: Context, next: NextFn) => {
    if (applyRequestCache(ctx)) {
      const cacheConfig = getFormattedCache(ctx)
      // 强刷缓存
      if (cacheConfig.force) {
        clearCacheData({ key: ctx.key, cacheType: cacheConfig.cacheType })
      }
      else {
        const cacheData = getCacheData({ key: ctx.key, cacheType: cacheConfig.cacheType })
        if (cacheData) {
          ctx.response = cacheData
          return
        }
      }

      const result = await handleCachingStart(ctx, cacheConfig)
      if (result) {
        Object.keys(result).forEach((key) => {
          ctx[key] = result[key]
        })
        return
      }

      await next()

      if (ctx.response && !canCache(ctx.response))
        console.warn(`request: ${ctx.config.url} 响应数据无法序列化，无法缓存，请移除相关配置`)

      if (!ctx.error && ctx.response && canCache(ctx.response)) {
        handleCachingQueueSuccess(ctx, cacheConfig)

        setCacheData({
          key: ctx.key,
          data: ctx.response,
          ...cacheConfig,
        })
      }
      else {
        handleCachingQueueError(ctx, cacheConfig)
      }
    }
    else {
      await next()
    }
  }
}
