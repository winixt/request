// TODO Config 支持所有 fetch 参数
export interface Config {
  baseURL?: string
  timeout?: number
  method?: string
  credentials?: 'include' | 'same-origin' | 'omit'
  headers?: {
    [key: string]: string
  }
  transformParams: <T>(params: T) => T
  transformData: <T>(data: T) => T
}

export interface Response {
  status: number
  data: any
  headers: Record<string, string>
}

export interface RequestError {
  msg: string
  type: string
  config: Config
  response?: Response
}

export type ParamsType = string | Record<string, string> | Blob | File | FormData | ArrayBuffer | URLSearchParams | DataView

export interface Context {
  url: string
  config: Config
  key?: string
  params?: ParamsType
  response?: Response
  error?: RequestError
}

export type Next = () => Promise<void>
export type Middleware = (ctx: Context, next: Next) => Promise<void>
