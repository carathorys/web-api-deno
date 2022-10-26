import { Injector } from '../dependency-injection/index.ts';

export interface IPlugin {
  readonly ___injector: Injector;
}
