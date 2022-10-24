import { Reflect } from 'https://deno.land/x/deno_reflect@v0.2.1/mod.ts';
import { Constructable } from '../../utils/helpers/types.ts';

import { Injector } from '../injector.ts';
import { InjectableParameters, ServiceLifetime } from '../parameters/index.ts';
import { InjectableMetadata } from '../metadata/injectable-metadata.model.ts';
import { ClassDecoratorFactory } from '../../utils/index.ts';

export const defaultInjectableParameters: InjectableParameters = {
  lifetime: ServiceLifetime.Transient,
};

/**
 * Decorator method for tagging a class as injectable
 *
 * @param options The options object
 * @returns void
 */
export const Injectable: ClassDecoratorFactory<Partial<InjectableParameters>> = (
  options?: Partial<InjectableParameters>,
) => {
  return <T, TCtor extends Constructable<T>>(ctor: TCtor) => {
    const meta = Reflect.getMetadata('design:paramtypes', ctor);
    const metaValue: InjectableMetadata = {
      dependencies: (meta &&
        (meta as unknown[]).map((param) => {
          return param;
        })) ||
        [],
      options: { ...defaultInjectableParameters, ...options },
    };
    Injector.meta.set(ctor, metaValue);
  };
};
