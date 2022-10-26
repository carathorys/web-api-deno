import { ILogger, Logger } from './logger.interface.ts';
import { Injectable } from '../dependency-injection/decorators/injectable.decorator.ts';
import { ServiceLifetime } from '../dependency-injection/parameters/service-lifetime.enum.ts';

@Injectable({ lifetime: ServiceLifetime.Scoped })
export class ConsoleLogger implements ILogger, Logger {
  error(message: string, error: unknown, ...args: unknown[]): void {
    console.error(message, error, args);
  }
  warn(message: string, ...args: unknown[]): void {
    console.warn(message, args);
  }
  info(message: string, ...args: unknown[]): void {
    console.info(message, args);
  }
  verbose(message: string, ...args: unknown[]): void {
    console.debug(message, args);
  }
  debug(message: string, ...args: unknown[]): void {
    console.debug(message, args);
  }
}
