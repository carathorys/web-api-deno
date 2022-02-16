// deno-lint-ignore-file no-explicit-any
import { assert, assertEquals, assertRejects } from 'https://deno.land/std@0.125.0/testing/asserts.ts';
import sinon from 'https://cdn.skypack.dev/sinon@11.1.2?dts';

import { DisposeError, ObjectDisposedError } from '../errors/index.ts';
import { IDisposable } from '../interfaces/disposable.ts';
import { Disposable } from './disposable-decorator.ts';
import {
  MockAsyncDisposable,
  MockDecoratedDisposable,
  MockNotDisposable,
  validateResource,
} from './disposable-decorator.spec-models.spec.ts';

Deno.test('Disposable decorator will decorate IDisposable implementation', async () => {
  const instance = new MockAsyncDisposable();
  const spy = sinon.spy(instance, 'dispose');
  const spyInternal = sinon.spy(instance.disposableProp, 'dispose');
  assertEquals(instance.resourceDisposed, false);
  assertEquals(typeof instance.dispose, 'function');
  await instance.dispose();
  assertEquals(instance.resourceDisposed, true);
  assertEquals(spy.called, true);
  // By default the dispose is not recursive, so the internal properties shoudn't be disposed yet!
  assertEquals(spyInternal.called, false);
  assertEquals(instance.disposableProp.resourceDisposed, false);
});

Deno.test('Disposable decorator will decorate class', () => {
  const instance = new MockDecoratedDisposable();
  assertEquals(typeof (instance as unknown as IDisposable).dispose, 'function');
  validateResource(instance, undefined, false, false);
  assertEquals(instance.disposableProp.resourceDisposed, false);

  assert(async () => await (instance as any as IDisposable).dispose());
});

Deno.test('Disposable decorator will apply not apply to decorated', () => {
  const instance = new MockNotDisposable();
  assertEquals(typeof (instance as any as IDisposable).dispose, 'undefined');
  assertEquals(instance.disposableProp.resourceDisposed, false);
});

Deno.test('Disposable decorator will call `dispose()` in `IDisposable`', async () => {
  const instance = new MockAsyncDisposable(10);
  validateResource(instance, false, false, false);
  const spy = sinon.spy(instance, 'dispose');
  assert(spy.notCalled === !spy.called);

  const promise = instance.dispose().then(() => {
    validateResource(instance, true, true, false);
    assert(!spy.notCalled === spy.called);
  });
  validateResource(instance, false, false, true);
  assert(!spy.notCalled === spy.called);
  await promise;
});

Deno.test(
  'Disposable decorator `dispose()` throws `DisposeError` when calling while the dispose in progress',
  async () => {
    const instance = new MockAsyncDisposable(1000);
    validateResource(instance, false, false, false);

    const spy = sinon.spy(instance, 'dispose');
    assert(spy.notCalled === !spy.called);

    const promise = instance.dispose().then(() => {
      validateResource(instance, true, true, false);
      assert(!spy.notCalled === spy.called);
    });

    await assertRejects(() => instance.dispose(), DisposeError);
    await promise;

    validateResource(instance, true, true, false);
    assert(!spy.notCalled === spy.called);
  },
);

Deno.test(
  'Disposable decorator `dispose()` throws `ObjectDisposed` when calling after the dispose is done',
  async () => {
    const instance = new MockAsyncDisposable(10);
    validateResource(instance, false, false, false);

    const spy = sinon.spy(instance, 'dispose');
    assert(spy.notCalled);

    await instance.dispose();
    validateResource(instance, true, true, false);
    assert(spy.called);
    await assertRejects(() => instance.dispose(), ObjectDisposedError);
    validateResource(instance, true, true, false);
  },
);
