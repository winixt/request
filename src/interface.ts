export interface Config {
  method?: string
  credentials?: 'include' | 'same-origin' | 'omit'
  headers?: {
    [key: string]: string
  }
}

// 默认内置的能力

// timeout?: number
// baseURL?: string
// transform?: () => void

export interface Context {
  config: Config
}
