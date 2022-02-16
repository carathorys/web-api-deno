import { Reflect } from "https://deno.land/x/reflect_metadata@v0.1.12-2/mod.ts";

import { InjectParameters } from "../parameters/index.ts";
import { InjectMetadata } from "../metadata/index.ts";

import { Injector } from "../injector.ts";
import { Constructable } from "../../utils/helpers/types.ts";

const FromServicesMetadataKey = Symbol("FromServicesMetadataKey");

export const Inject = (parameters?: InjectParameters) =>
  <T extends Constructable<unknown>>(
    target: T,
    propertyKey: string | symbol,
    parameterIndex: number,
  ) => {
    const existingRequiredParameters: InjectMetadata[] =
      Reflect.getOwnMetadata(FromServicesMetadataKey, target, propertyKey) ||
      [];

    existingRequiredParameters.push({
      parameterIndex,
      symbol: parameters?.symbol,
    });
    const defined = Injector.meta.has(target);
    console.log({ parameters, target, propertyKey, parameterIndex }, defined);

    Reflect.defineMetadata(
      FromServicesMetadataKey,
      existingRequiredParameters,
      target,
      propertyKey,
    );
  };
