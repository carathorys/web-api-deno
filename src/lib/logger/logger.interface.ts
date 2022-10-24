export interface ILogger {
  error(message: string, error?: Error | unknown, ...args: unknown[]): void | PromiseLike<void>;
  warn(message: string, ...args: unknown[]): void | PromiseLike<void>;
  info(message: string, ...args: unknown[]): void | PromiseLike<void>;
  verbose(message: string, ...args: unknown[]): void | PromiseLike<void>;
  debug(message: string, ...args: unknown[]): void | PromiseLike<void>;
}

export abstract class Logger implements ILogger {
  abstract debug(message: string, ...args: unknown[]): void | PromiseLike<void>;
  abstract error(message: string, error?: unknown, ...args: unknown[]): void | PromiseLike<void>;
  abstract warn(message: string, ...args: unknown[]): void | PromiseLike<void>;
  abstract info(message: string, ...args: unknown[]): void | PromiseLike<void>;
  abstract verbose(message: string, ...args: unknown[]): void | PromiseLike<void>;
}
