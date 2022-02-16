// deno-lint-ignore-file no-explicit-any no-unused-vars
import { Reflect } from "https://deno.land/x/reflect_metadata@v0.1.12-2/mod.ts";

import { Constructable } from "../../utils/helpers/types.ts";

import { ServiceDecoratorParameters } from "../parameters/service-decorator-parameters.model.ts";

import { ServiceDescriptor } from "../metadata/service-descriptor.model.ts";

/**
 * Decorator method for tagging a class as injectable
 *
 * @param parameters The options object
 * @returns void
 */
// TODO: implement service decorator!
export const Service = <T>(parameters: ServiceDecoratorParameters<T>) => {
  return <T extends Constructable<any>>(ctor: T) => {
    const meta = Reflect.getMetadata("design:paramtypes", ctor);
    const metaValue = new ServiceDescriptor(parameters);
    // console.log(meta, metaValue);
  };
};
