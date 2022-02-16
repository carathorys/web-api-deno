// deno-lint-ignore-file no-explicit-any
import { Reflect } from "https://deno.land/x/reflect_metadata@v0.1.12-2/mod.ts";
import { ParameterArguments } from "./parameter.arguments.ts";

export const ParameterMetadataKey = Symbol("ParameterMetadata");

export type ParameterMetadata = ParameterArguments & {
  parameterIndex: number;
};

export function Parameter(args: ParameterArguments) {
  return (target: any, propertyKey: string, parameterIndex: number) => {
    const params: ParameterMetadata[] =
      Reflect.getOwnMetadata(ParameterMetadataKey, target, propertyKey) || [];

    params.push({ ...args, parameterIndex: parameterIndex });

    Reflect.defineMetadata(ParameterMetadataKey, params, target, propertyKey);
  };
}
