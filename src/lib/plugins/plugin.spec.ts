import { assert, assertRejects, assertThrows } from 'https://deno.land/std@0.125.0/testing/asserts.ts';

import { Injectable } from '../dependency-injection/index.ts';
import { ServiceLifetime } from '../dependency-injection/parameters/service-lifetime.enum.ts';
import { Plugin } from './plugin.decorator.ts';
import { IPlugin } from './plugin.interface.ts';

Deno.test('plugin should work', () => {
  @Injectable({ lifetime: ServiceLifetime.Scoped })
  class MyService {}

  @Plugin({ services: [] })
  class MyPlugin {}

  const myPlugin = new MyPlugin();
  assert((myPlugin as IPlugin).___injector);
  assert(!(myPlugin as IPlugin).___injector.meta.has(MyService));
});

Deno.test('using', () => {
  @Injectable()
  class MyService {}

  @Plugin({ services: [MyService] })
  class MyPlugin {}

  const myPlugin = new MyPlugin();
  const injector = (myPlugin as IPlugin).___injector;
  assert((myPlugin as IPlugin).___injector);
  assert((myPlugin as IPlugin).___injector.meta.has(MyService));
  assert(injector.getInstance(MyService));
});

Deno.test('Not registered', () => {
  @Injectable()
  class MySubService {}

  @Injectable({ lifetime: ServiceLifetime.Scoped })
  class MyService {
    /** */
    constructor(public subService: MySubService) {
    }
  }

  @Plugin({ services: [MyService] })
  class MyPlugin {
  }

  const myPlugin = new MyPlugin();
  const pluginInjector = (myPlugin as IPlugin).___injector;
  assertThrows(() => pluginInjector.getInstance(MyService));
});
