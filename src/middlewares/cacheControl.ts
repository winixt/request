import { isPlainObject, isString } from 'lodash-es'
import type { CacheData, Context, NextFn } from '../interface'
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

const CACHE_DATA_MAP = new Map()
const DEFAULT_CACHE_TIME = 1000 * 60 * 3

function genInnerKey(key: string, cacheType = 'ram') {
  if (cacheType !== CACHE_TYPE.ram)
    return `${CACHE_KEY_PREFIX}${key}`

  return key
}

function canCache(data: any) {
  return isPlainObject(data) || isString(data) || Array.isArray(data) || isURLSearchParams(data)
}

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
    CACHE_DATA_MAP.set(_key, currentCacheData)
  }
}

function isExpire({ expire, cacheTime }) {
  if (!cacheTime || expire >= Date.now())
    return false

  return true
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
    const currentCacheData = CACHE_DATA_MAP.get(_key)
    if (currentCacheData && !isExpire(currentCacheData))
      return currentCacheData.data

    CACHE_DATA_MAP.delete(_key)
    return null
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
function handleCachingStart(ctx: Context, cacheConfig: CacheData) {
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
function handleCachingQueueSuccess(ctx: Context, cacheConfig: CacheData) {
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
function handleCachingQueueError(ctx: Context, cacheConfig: CacheData) {
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
  if (ctx.config.cacheData) {
    if (ctx.key)
      return true

    console.warn(`request: ${ctx.config.url} 请求参数无法序列化，无法缓存，请移除相关配置`)
    return false
  }
  return false
}

function getFormattedCache(ctx: Context): CacheData {
  if (typeof ctx.config.cacheData === 'object')
    return ctx.config.cacheData

  return {
    cacheType: 'ram',
    cacheTime: DEFAULT_CACHE_TIME,
  }
}

export default async (ctx: Context, next: NextFn) => {
  const { config } = ctx
  if (applyRequestCache(ctx)) {
    const cacheConfig = getFormattedCache(ctx)
    const cacheData = getCacheData({ key: ctx.key, cacheType: cacheConfig.cacheType })
    if (cacheData) {
      ctx.response = cacheData
      return
    }
    const result = await handleCachingStart(ctx, cacheConfig)
    if (result) {
      Object.keys(result).forEach((key) => {
        ctx[key] = result[key]
      })
      return
    }

    await next()

    if (!canCache(ctx.response))
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
