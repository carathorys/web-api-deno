export interface ILogger {
  error(message: string, error: Error | unknown, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  info(message: string, ...args: unknown[]): void;
  verbose(message: string, ...args: unknown[]): void;
  debug(message: string, ...args: unknown[]): void;
}
