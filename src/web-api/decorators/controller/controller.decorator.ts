// deno-lint-ignore-file no-explicit-any ban-types
import { ActionMetadata, ActionParameter } from "../action/action.decorator.ts";

import DecoratorStore from "../decorator-store.ts";

export type ControllerParameter = {
  basePath?: string;
};

export const ControllerMetadata = Symbol("ControllerMetadata");

export const Controller = (parameters?: ControllerParameter) =>
  <T extends { new (...args: any[]): object }>(Base: T) => {
    // @Injectable({ lifetime: 'scoped' })
    // TODO: Dependency injection should be solved!
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
    // TODO: `console.log` should not used anywhere
    // console.log('Finished processing Controller data');
    return ControllerClass;
  };
