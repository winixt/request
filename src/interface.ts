export interface CacheData {
  cacheType?: 'ram' | 'session' | 'local'
  cacheTime?: number
}
export interface Config extends RequestInit {
  baseURL?: string
  timeout?: number
  method?: string
  mergeRequest?: boolean
  credentials?: 'include' | 'same-origin' | 'omit'
  headers?: {
    [key: string]: string
  }
  cacheData?: boolean | CacheData
  transformParams: <T>(params: T) => T
  transformData: <T>(data: T) => T
}

export interface Response {
  status: number
  data: any
  headers: Record<string, string>
}

export interface RequestError {
  config: Config
  msg?: string
  type?: string
  response?: Response
}

export type ParamsType = string | Record<string, any> | Blob | File | FormData | ArrayBuffer | URLSearchParams | DataView

export interface Context {
  url: string
  config: Config
  key?: string
  params?: ParamsType
  response?: Response
  error?: RequestError
}

export type NextFn = () => Promise<void>
export type Middleware = (ctx: Context, next: NextFn) => Promise<void>
