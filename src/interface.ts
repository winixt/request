export interface CacheConfig {
  cacheType?: 'ram' | 'session' | 'local'
  cacheTime?: number
}

export type ParamsType = string | Record<string, any> | Blob | File | FormData | ArrayBuffer | URLSearchParams | DataView

export type RequestInterceptor = (config: Config, defaultInterceptor?: RequestInterceptor) => Promise<Config> | Config
export type ResponseInterceptor = (response: RequestResponse, defaultInterceptor?: ResponseInterceptor) => Promise<RequestResponse> | RequestResponse
export interface Config extends RequestInit {
  url: string
  params?: ParamsType
  baseURL?: string
  timeout?: number
  mergeRequest?: boolean
  responseType?: 'json' | 'text' | 'blob' | 'arrayBuffer' | 'formData'
  cacheData?: boolean | CacheConfig
  requestInterceptor?: RequestInterceptor | RequestInterceptor[]
  responseInterceptor?: ResponseInterceptor | ResponseInterceptor[]
  requestInterceptors?: RequestInterceptor | RequestInterceptor[]
  responseInterceptors?: ResponseInterceptor | ResponseInterceptor[]
  transformData?: (data: any, response: RequestResponse) => any
  errorHandler?: (error: any) => void
}

export interface RequestResponse<T = any> {
  status: number
  data: T
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
