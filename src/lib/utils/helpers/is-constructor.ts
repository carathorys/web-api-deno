// deno-lint-ignore-file no-explicit-any

import { Constructable } from './types.ts';

const handler = {
  construct() {
    return handler;
  },
};

export const isConstructor = (x: any): x is Constructable<unknown> => {
  try {
    return !!(new (new Proxy(x, handler))());
  } catch (e) {
    return false;
  }
};
