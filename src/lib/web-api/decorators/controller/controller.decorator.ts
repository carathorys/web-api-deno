// deno-lint-ignore-file no-explicit-any ban-types
import { Injectable } from '../../../dependency-injection/decorators/injectable.decorator.ts';
import { ServiceLifetime } from '../../../dependency-injection/parameters/service-lifetime.enum.ts';
import { ActionMetadata, ActionParameter } from '../action/action.decorator.ts';

import DecoratorStore from '../decorator-store.ts';

export type ControllerParameter = {
  basePath?: string;
};

export const ControllerMetadata = Symbol('ControllerMetadata');

export const Controller =
  (parameters?: ControllerParameter) => <T extends { new (...args: any[]): object }>(Base: T) => {
    @Injectable({ lifetime: ServiceLifetime.Scoped })
    class ControllerClass extends Base {
      constructor(...args: any[]) {
        super(...args);
      }
    }

    DecoratorStore.addControllerMetadata(
      Base.name,
      { ...parameters },
      ControllerClass,
      Base,
    );
    const actions = Base.prototype[ActionMetadata] as Map<
      string,
      ActionParameter
    >;
    actions?.forEach((value, key) => {
      DecoratorStore.appendActionMetadata(Base.name, key, value);
    });
    return ControllerClass;
  };
