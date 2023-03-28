export interface CacheConfig {
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
  cacheData?: boolean | CacheConfig
  requestInterceptor?: (config: Config, defaultInterceptor?: (config: Config) => Config) => Config
  responseInterceptor?: (response: RequestResponse, defaultInterceptor?: (response: RequestResponse) => RequestResponse) => RequestResponse
  transformData?: (data: any, response: RequestResponse) => any
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
  reqHeaders?: Headers
  error?: RequestError
}

export type NextFn = () => Promise<void>
export type Middleware = (ctx: Context, next: NextFn) => Promise<void>
