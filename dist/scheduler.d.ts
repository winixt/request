import type { Context, Middleware } from './interface';
export declare class Scheduler {
    middlewares: Middleware[];
    constructor();
    use(fn: Middleware): this;
    compose(): (ctx: Context, next?: () => Promise<void>) => Promise<void>;
}
