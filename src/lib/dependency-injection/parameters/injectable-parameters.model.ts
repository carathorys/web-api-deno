// deno-lint-ignore-file ban-types
import { Injector } from '../injector.ts';
import { ServiceLifetime } from './service-lifetime.enum.ts';

/**
 * Options for the injectable instance
 */
export interface InjectableParameters {
  lifetime: ServiceLifetime;
  provideIn?: Injector;
  symbol?: Symbol;
}
