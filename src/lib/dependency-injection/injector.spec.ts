import { assert, assertEquals, assertRejects, assertThrows } from 'https://deno.land/std@0.160.0/testing/asserts.ts';
import sinon from 'https://cdn.skypack.dev/sinon@11.1.2?dts';

import { Disposable, DisposeError, IDisposable, using } from '../disposable/index.ts';
import { Injectable } from './decorators/injectable.decorator.ts';
import { Injector } from './injector.ts';
import { ServiceLifetime } from './parameters/service-lifetime.enum.ts';
import { DIError } from './errors/di.error.ts';

Deno.test('dispose', async () => {
  const obj: Injector = new Injector();
  const spy = sinon.spy(obj, 'dispose');
  await using(obj, (_injector: Injector) => {
    assert(spy.notCalled);
  });
  assert(spy.called);
});

Deno.test('Shold be constructed', () => {
  const i = new Injector();
  assert(i);
  assert(i instanceof Injector);
});

Deno.test('Parent should be the default instance, if not specified', () => {
  const i = new Injector();
  assert(typeof i.parameters?.parent === 'undefined');
});
Deno.test('Parent should be the default instance, if not specified', () => {
  const parent = new Injector();
  const i = new Injector({ parent });
  assert(typeof i.parameters!.parent !== 'undefined');
  assert(i.parameters!.parent instanceof Injector);
});

Deno.test('Should throw an error on circular dependencies', () => {
  const i = new Injector();

  @Injectable()
  class InstanceClass {
    constructor(public readonly ohgodno: InstanceClass) {
      /** */
    }
  }
  assertThrows(() => i.getInstance(InstanceClass));
});

Deno.test('Should set and return instance from cache', () => {
  const i = new Injector();
  @Injectable({ lifetime: ServiceLifetime.Scoped })
  class InstanceClass {}
  const instance = new InstanceClass();
  i.setExplicitInstance(instance);
  assertEquals(i.getInstance(InstanceClass), instance);
});

Deno.test('Should throw an error when setting an Injector instance', async () => {
  await using(new Injector(), (i) => {
    assertThrows(
      () => i.setExplicitInstance(new Injector()),
      DIError,
      'Cannot set an injector instance as injectable',
    );
  });
});

Deno.test('Should return from a parent injector if available', () => {
  const parent = new Injector();
  const i = parent.createChild();
  @Injectable({ lifetime: ServiceLifetime.Singleton })
  class InstanceClass {}
  const instance = new InstanceClass();
  parent.setExplicitInstance(instance);
  assertEquals(i.getInstance(InstanceClass), instance);
  assertEquals(parent.cachedSingletons.get(InstanceClass), instance);
});

Deno.test('Should create instance on a parent injector if not available', () => {
  const parent = new Injector();
  const i = parent.createChild();
  @Injectable({ lifetime: ServiceLifetime.Singleton })
  class InstanceClass {}
  assert(i.getInstance(InstanceClass) instanceof InstanceClass);
  assert(parent.cachedSingletons.get(InstanceClass) instanceof InstanceClass);
});

Deno.test('Should resolve parameters', () => {
  const i = new Injector();

  @Injectable()
  class Injected1 {}
  @Injectable()
  class Injected2 {}

  @Injectable()
  class InstanceClass {
    constructor(public injected1: Injected1, public injected2: Injected2) {
      /** */
    }
  }
  assert(i.getInstance(InstanceClass) instanceof InstanceClass);
  assert(i.getInstance(InstanceClass).injected1 instanceof Injected1);
  assert(i.getInstance(InstanceClass).injected2 instanceof Injected2);
});

Deno.test('Should resolve parameters recursively', () => {
  const i = new Injector();

  @Injectable()
  class Injected1 {}
  @Injectable()
  class Injected2 {
    constructor(public injected1: Injected1) {}
  }

  @Injectable()
  class InstanceClass {
    constructor(public injected2: Injected2) {}
  }
  assert(i.getInstance(InstanceClass) instanceof InstanceClass);
  assert(i.getInstance(InstanceClass).injected2.injected1 instanceof Injected1);
  assert(i.getInstance(InstanceClass));
});

Deno.test('Should be disposed', async () => {
  const injector = new Injector();
  const spy = sinon.spy(injector, 'dispose');
  await using(injector, async () => {
    // ignore
  });
  assert(spy.called);
});

Deno.test('Should dispose cached entries on dispose and tolerate non-disposable ones', async () => {
  class TestDisposable implements IDisposable {
    public dispose() {
    }
  }
  class TestInstance {}
  const testDisposable = new TestDisposable();
  const testInstance = new TestInstance();
  const injector = new Injector();

  const disposableSpy = sinon.spy(testDisposable, 'dispose');
  const injectorSpy = sinon.spy(injector, 'dispose');
  assert(disposableSpy.notCalled);
  assert(injectorSpy.notCalled);

  await using(injector, (i) => {
    i.setExplicitInstance(testDisposable);
    i.setExplicitInstance(testInstance);
  });
  assert(injectorSpy.called);
  assert(disposableSpy.called);
});

Deno.test('On dispose error it should write warn logs about the error itself. (1)', async () => {
  const injectorError = new DisposeError('There was an error during disposing \'1\' global disposable object(s)');
  const instanceDisposeError = new Error('Something very bad happened during my disposal...');
  class TestDisposable implements IDisposable {
    public dispose() {
      throw instanceDisposeError;
    }
  }
  class TestInstance {}

  const testDisposable = new TestDisposable();
  const disposeSpy = sinon.spy(testDisposable, 'dispose');
  const injector = new Injector();
  const injectorSpy = sinon.spy(injector, 'dispose');
  await assertRejects(
    async () => {
      await using(injector, (i) => {
        i.setExplicitInstance(testDisposable);
        i.setExplicitInstance(new TestInstance());
      });
    },
    DisposeError,
    injectorError.message,
  );

  assert(injectorSpy.called);
  assert(disposeSpy.called);
  assert(disposeSpy.exceptions.length);
});

Deno.test('On dispose error it should write warn logs about the error itself. (2)', async () => {
  const injectorError = new DisposeError('There was an error during disposing \'1\' global disposable object(s)');
  const instanceDisposeError = new Error('Something very bad happened during my disposal...');
  class TestDisposable implements IDisposable {
    public dispose() {
      throw instanceDisposeError;
    }
  }
  class TestInstance {}

  const testDisposable = new TestDisposable();
  const injector = new Injector();
  const disposeSpy = sinon.spy(testDisposable, 'dispose');
  const injectorSpy = sinon.spy(injector, 'dispose');
  await assertRejects(
    async () => {
      await using(injector, (i) => {
        i.setExplicitInstance(testDisposable);
        i.setExplicitInstance(new TestInstance());
      });
    },
    DisposeError,
    injectorError.message,
  );
  assert(injectorSpy.called);
  assert(disposeSpy.called && disposeSpy.exceptions.length);
});

Deno.test('On dispose error it should write warn logs about the error itself. (3)', async () => {
  const injectorError = new DisposeError('There was an error during disposing \'1\' global disposable object(s)');
  const instanceError = 'Something very bad happened during my disposal...';
  @Disposable()
  class TestDisposable {
    dispose() {
      throw new Error(instanceError);
    }
  }
  class TestInstance {}

  const testDisposable = new TestDisposable();
  await assertRejects(
    async () => {
      await using(new Injector(), (i) => {
        i.setExplicitInstance(testDisposable);
        i.setExplicitInstance(new TestInstance());
      });
    },
    DisposeError,
    injectorError.message,
  );
});

Deno.test('Remove should remove an entity from the cached singletons list', async () => {
  await using(new Injector(), (i) => {
    i.setExplicitInstance({}, Object);
    i.remove(Object);
    assertEquals(i.cachedSingletons.size, 0);
  });
});

Deno.test('Requesting an Injector instance should return self', async () => {
  await using(new Injector(), (i) => {
    assertEquals(i.getInstance(Injector), i);
  });
});

Deno.test('Requesting an undecorated instance should throw an error', async () => {
  class UndecoratedTestClass {}
  const expectedError = new DIError(
    UndecoratedTestClass,
    'No metadata found for \'UndecoratedTestClass\'. Dependencies: Injector1. Be sure that it\'s decorated with \'@Injectable()\' or added explicitly with SetInstance()',
  );
  await using(new Injector(), (i) => {
    assertThrows(
      () => {
        i.getInstance(UndecoratedTestClass, [Injector]);
      },
      DIError,
      expectedError.message,
    );
  });
});

Deno.test('Singleton with transient dependencies should throw an error', async () => {
  @Injectable({ lifetime: ServiceLifetime.Transient })
  class Trs1 {}

  @Injectable({ lifetime: ServiceLifetime.Singleton })
  class St1 {
    constructor(public lt: Trs1) {}
  }
  const diError = new DIError(
    St1,
    'Injector error: Singleton type \'St1\' depends on non-singleton injectables: Trs1:Transient',
  );
  await using(new Injector(), (i) => {
    assertThrows(
      () => {
        i.getInstance(St1);
      },
      DIError,
      diError.message,
    );
  });

  Deno.test('Singleton with scoped dependencies should throw an error', async () => {
    @Injectable({ lifetime: ServiceLifetime.Scoped })
    class Sc1 {}

    @Injectable({ lifetime: ServiceLifetime.Singleton })
    class St2 {
      constructor(public sc: Sc1) {}
    }
    const diError = new DIError(
      St2,
      'Injector error: Singleton type \'St2\' depends on non-singleton injectables: Sc1:Scoped',
    );
    await using(new Injector(), (i) => {
      assertThrows(() => i.getInstance(St2), DIError, diError.message);
    });
  });
});

Deno.test('Scoped with transient dependencies should throw an error', () => {
  @Injectable({ lifetime: ServiceLifetime.Transient })
  class Tr2 {}

  @Injectable({ lifetime: ServiceLifetime.Scoped })
  class Sc2 {
    constructor(public sc: Tr2) {}
  }
  const diError = new DIError(
    Sc2,
    'Injector error: Scoped type \'Sc2\' depends on transient injectables: Tr2:Transient',
  );
  using(new Injector(), (i) => {
    assertThrows(() => i.getInstance(Sc2), DIError, diError.message);
  });
});
