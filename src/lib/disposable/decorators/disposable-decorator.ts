// deno-lint-ignore-file no-explicit-any
import { DisposeError, ObjectDisposedError } from '../errors/index.ts';
import { IDisposable } from '../interfaces/disposable.ts';
import { DisposableDecoratorParameters } from './disposable-decorator.parameters.ts';
import { ClassDecoratorFactory, Constructable } from '../../utils/index.ts';

export const Disposable: ClassDecoratorFactory<DisposableDecoratorParameters> =
  (parameters?: DisposableDecoratorParameters) => <T, TCTor extends Constructable<T>>(ctor: TCTor): any => {
    return class extends ctor implements IDisposable {
      __isDisposing = false;
      __isDisposed = false;
      static readonly __baseClass = ctor;

      async dispose() {
        if (this.__isDisposing === true) throw new DisposeError('The object is already disposing!');
        this.__isDisposing = true;
        try {
          if (this.__isDisposed === true) throw new ObjectDisposedError('The object has already disposed!');

          if (typeof super['dispose'] === 'function') {
            await super.dispose();
          }
          if (parameters?.recursive === true) {
            const keys = Object.keys(this);
            for (const key of keys) {
              if (typeof this[key] === 'object' && typeof this[key]['dispose'] === 'function') {
                await this[key].dispose();
              }
            }
          }
        } finally {
          this.__isDisposed = true;
          this.__isDisposing = false;
        }
      }
    };
  };
