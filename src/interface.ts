export interface CacheData {
  cacheType?: 'ram' | 'session' | 'local'
  cacheTime?: number
}

export type ParamsType = string | Record<string, any> | Blob | File | FormData | ArrayBuffer | URLSearchParams | DataView
export interface Config extends RequestInit {
  url: string
  params?: ParamsType
  baseURL?: string
  timeout?: number
  method?: string
  mergeRequest?: boolean
  responseType?: 'json' | 'text' | 'blob' | 'arrayBuffer' | 'formData'
  credentials?: 'include' | 'same-origin' | 'omit'
  headers?: {
    [key: string]: string
  }
  cacheData?: boolean | CacheData
  transformData?: <T>(data: T) => T
  errorHandler?: (error: any) => void
}

export interface RequestResponse {
  status: number
  data: any
  headers: Record<string, string>
}

export interface RequestError {
  config?: Config
  msg?: string
  type?: string
  response?: RequestResponse
}

export interface Context {
  config: Config
  key?: string
  response?: RequestResponse
  error?: RequestError
}

export type NextFn = () => Promise<void>
export type Middleware = (ctx: Context, next: NextFn) => Promise<void>
