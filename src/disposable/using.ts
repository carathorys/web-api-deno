// deno-lint-ignore-file no-explicit-any
import { DisposeError } from './errors/dispose.error.ts';
import { IDisposable } from './interfaces/disposable.ts';

/**
 * Method that accepts an IDisposable resource that will be disposed after the callback
 *
 * @param resource The resource that is used in the callback and will be disposed afterwards
 * @param callback The callback that will be executed synchrounously before the resource will be disposed
 * @returns the value that will be returned by the callback method
 */
export const using = async <T extends any, TReturns>(
  resource: T,
  callback: (r: T) => TReturns | Promise<TReturns>,
) => {
  if ((resource as unknown as IDisposable).dispose === undefined) {
    throw new DisposeError(
      'The object is not an IDisposable instance, neither directly or through `Disposable` decorator',
    );
  }
  try {
    return await callback(resource);
  } finally {
    await (resource as unknown as IDisposable).dispose();
  }
};
