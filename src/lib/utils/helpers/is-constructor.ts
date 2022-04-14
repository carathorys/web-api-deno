const handler = {
  construct() {
    return handler;
  },
};

// deno-lint-ignore ban-types no-explicit-any
export const isConstructor = (x: any): x is (new (...args: any[]) => object) => {
  try {
    return !!(new (new Proxy(x, handler))());
  } catch (e) {
    return false;
  }
};
