import { Injector } from '../dependency-injection/injector.ts';
import { ClassDecorator, ClassDecoratorFactory, Constructable } from '../utils/index.ts';
import { PluginParameters } from './plugin.parameters.ts';

const PluginDecorator: ClassDecorator = <T, TCtor extends Constructable<T>>(ctor: TCtor) => {
  return class extends ctor {
    private readonly __injector: Injector = new Injector();
  };
};
export const Plugin: ClassDecoratorFactory<PluginParameters, typeof PluginDecorator> = (
  parameters?: PluginParameters,
) => PluginDecorator;
