import { assert, assertRejects } from 'https://deno.land/std@0.125.0/testing/asserts.ts';
import sinon from 'https://cdn.skypack.dev/sinon@11.1.2?dts';

import { using } from './using.ts';
import {
  MockAsyncDisposable,
  MockDecoratedDisposable,
  MockNotDisposable,
  validateResource,
} from './decorators/disposable-decorator.spec-models.spec.ts';
import { DisposeError } from './errors/dispose.error.ts';

Deno.test('using', async () => {
  await using(new MockAsyncDisposable(10), (asyncDisposable) => {
    validateResource(asyncDisposable, false, false, false);
  });
});

Deno.test('using', async () => {
  await using(new MockDecoratedDisposable(), (asyncDisposable) => {
    validateResource(asyncDisposable, undefined, false, false);
  });
});

Deno.test('using', async () => {
  const obj = {
    us: async () => {
      await using(new MockNotDisposable(), (asyncDisposable) => {
        validateResource(asyncDisposable, undefined, false, false);
      });
    },
  };
  const spy = sinon.spy(obj, 'us');
  assert(spy.notCalled);
  await assertRejects(async () => await obj.us(), DisposeError);
  assert(spy.called);
});
