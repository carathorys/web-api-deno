// deno-lint-ignore-file no-explicit-any
import { assertEquals } from 'https://deno.land/std@0.125.0/testing/asserts.ts';
import { IDisposable } from '../interfaces/disposable.ts';
import { Disposable } from './disposable-decorator.ts';

export class MockDisposable implements IDisposable {
  private disposed = false;
  public get resourceDisposed() {
    return this.disposed;
  }
  constructor(private disposeTimeout = 1000) {}

  async dispose() {
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        this.disposed = true;
        resolve();
      }, this.disposeTimeout);
    });
  }
}

@Disposable()
export class MockAsyncDisposable implements IDisposable {
  private disposed = false;
  public get resourceDisposed() {
    return this.disposed;
  }

  private internalDisposable = new MockDisposable();
  public get disposableProp(): MockDisposable {
    return this.internalDisposable;
  }
  constructor(private disposeTimeout = 1000) {}

  dispose(): Promise<void> {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        this.disposed = true;
        resolve();
      }, this.disposeTimeout);
    });
  }
}

@Disposable({ recursive: true })
export class MockDecoratedDisposable {
  private internalDisposable = new MockAsyncDisposable(10);
  public get disposableProp(): MockAsyncDisposable {
    return this.internalDisposable;
  }
}

export class MockNotDisposable {
  private internalDisposable = new MockAsyncDisposable();
  public get disposableProp(): MockAsyncDisposable {
    return this.internalDisposable;
  }
}

export const validateResource = (
  instance: any,
  resourceDisposedValue: boolean | undefined,
  isDisposedValue: boolean,
  isDisposingValue: boolean,
) => {
  assertEquals(instance.resourceDisposed, resourceDisposedValue);
  assertEquals(instance.__isDisposed, isDisposedValue);
  assertEquals(instance.__isDisposing, isDisposingValue);
};
