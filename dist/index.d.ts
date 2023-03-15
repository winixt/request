import type { Config, ParamsType } from './interface';
export declare function createRequest(config?: Config): (url: string, data?: ParamsType, options?: Config) => Promise<void>;
