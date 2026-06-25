export interface CacheConfig {
  cacheType?: 'ram' | 'session' | 'local'
  cacheTime?: number
  force?: boolean
}

export type ParamsType = string | Record<string, any> | Blob | File | FormData | ArrayBuffer | URLSearchParams | DataView

export type RequestInterceptor<T = any> = (config: Config<T>, defaultInterceptor?: RequestInterceptor<T>) => Promise<Config<T>> | Config<T>
export type ResponseInterceptor<T = any> = (response: RequestResponse<T>, defaultInterceptor?: ResponseInterceptor<T>) => Promise<RequestResponse<T>> | RequestResponse<T>
export interface Config<T = any> extends RequestInit {
  url: string
  params?: ParamsType
  baseURL?: string
  timeout?: number
  mergeRequest?: boolean
  responseType?: 'json' | 'text' | 'blob' | 'arrayBuffer' | 'formData'
  defaultResponseType?: 'json' | 'text' | 'blob' | 'arrayBuffer' | 'formData'
  cacheData?: boolean | CacheConfig
  requestInterceptor?: RequestInterceptor<T> | RequestInterceptor<T>[]
  responseInterceptor?: ResponseInterceptor<T> | ResponseInterceptor<T>[]
  requestInterceptors?: RequestInterceptor<T> | RequestInterceptor<T>[]
  responseInterceptors?: ResponseInterceptor<T> | ResponseInterceptor<T>[]
  transformData?: (data: any, response: RequestResponse<T>) => T
  errorHandler?: (error: any) => void
}

export interface RequestResponse<T = any> {
  status: number
  data: T
  headers: Record<string, string>
  config: Config
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
