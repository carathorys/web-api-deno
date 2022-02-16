// deno-lint-ignore-file ban-types
import { ServiceLifetime } from "./service-lifetime.enum.ts";

/**
 * Options for the injectable instance
 */
export interface InjectableParameters {
  lifetime: ServiceLifetime;
  symbol?: Symbol;
}
