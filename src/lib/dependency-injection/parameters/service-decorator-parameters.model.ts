import { Constructable } from '../../utils/helpers/types.ts';

import { IServiceProvider } from '../interfaces/service-provider.interface.ts';
import { ServiceLifetime } from './service-lifetime.enum.ts';

export type ImplementationFactory<T> = (provider: IServiceProvider) => T;

export interface ServiceDecoratorParameters<T, TLifeTime extends ServiceLifetime = ServiceLifetime> {
  lifetime: TLifeTime;

  provideIn?: Constructable<unknown> | 'root' | 'any';
  implementationType?: Constructable<T>;
  implementationInstance?: T;
  implementationFactory?: ImplementationFactory<T>;

  // deno-lint-ignore ban-types
  serviceType?: Symbol;
}
