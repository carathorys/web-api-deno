// deno-lint-ignore-file ban-types no-explicit-any
import { Reflect } from 'https://deno.land/x/deno_reflect@v0.2.1/mod.ts';

import { ParameterMetadata, ParameterMetadataKey, ParameterType } from '../parameter/index.ts';

export const ActionMetadata = Symbol('ActionMetadata');

export type ActionParameter = {
  path: string;
  method: 'get' | 'post' | 'patch' | 'delete';
};

const Deserialize = (type: ParameterType, value: any) => {
  switch (type) {
    case 'string':
      return value.toString();
    case 'number':
      return Number.parseFloat(value);
    case 'boolean':
      return value == 'true';
    case 'bigint':
      return BigInt(value);
    case 'object':
      return JSON.parse(value);
  }
};

export const Action: (params?: ActionParameter) => MethodDecorator = (
  params?: ActionParameter,
) => {
  return (
    target: any,
    propertyKey: string | Symbol,
    descriptor: PropertyDescriptor,
  ) => {
    target[ActionMetadata] = target[ActionMetadata] || new Map();
    target[ActionMetadata].set(propertyKey, params);

    const originalMethod = descriptor.value!;
    let parameters: ParameterMetadata[] = Reflect.getOwnMetadata(
      ParameterMetadataKey,
      target,
      propertyKey?.toString() ?? '',
    );
    if (!parameters || parameters.length <= 0) return;
    parameters = parameters.sort((a, b) =>
      a.parameterIndex > b.parameterIndex ? 1 : a.parameterIndex == b.parameterIndex ? 0 : -1
    );

    const fn: (req: any, res: any, next: any) => void | Promise<any> = function (this: any, req) {
      const actionArguments = [];
      for (const { from, alias, type } of parameters) {
        switch (from) {
          case 'query':
            actionArguments.push(Deserialize(type, req.query[alias]));
            break;
          case 'header':
            actionArguments.push(Deserialize(type, req.header(alias)));
            break;
          case 'path':
            actionArguments.push(Deserialize(type, req.params[alias]));
            break;
          case 'payload':
            actionArguments.push(new Error('Not implemented yet!'));
            break;
        }
      }
      console.log('invoke action with params: ', actionArguments);
      return originalMethod.apply(this, actionArguments);
    };
    descriptor.value = fn;
  };
};
