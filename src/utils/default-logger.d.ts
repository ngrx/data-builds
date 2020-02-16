import { Logger } from './interfaces';
export declare class DefaultLogger implements Logger {
    error(message?: any, extra?: any): void;
    log(message?: any, extra?: any): void;
    warn(message?: any, extra?: any): void;
}
