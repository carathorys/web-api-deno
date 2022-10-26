// deno-lint-ignore-file no-explicit-any
import { Reflect } from 'https://deno.land/x/deno_reflect@v0.2.1/mod.ts';
import { INJECTABLE_METADATA } from '../dependency-injection/index.ts';
import { Injector } from '../dependency-injection/injector.ts';
import { ClassDecoratorFactory, Constructable } from '../utils/index.ts';
import { IPlugin } from './plugin.interface.ts';
import { PluginParameters } from './plugin.parameters.ts';

export const Plugin: ClassDecoratorFactory<PluginParameters> = (
  parameters?: PluginParameters,
) => {
  return <T, TConstructor extends Constructable<T>>(ctor: TConstructor) => {
    return class extends ctor implements IPlugin {
      public readonly ___injector;
      constructor(...args: any[]) {
        super(...args);
        this.___injector = new Injector();
        if (parameters?.services?.length) {
          parameters.services.forEach((service) => {
            this.___injector.meta.set(service, Reflect.getMetadata(INJECTABLE_METADATA, service));
          });
        }
      }
    };
  };
};
