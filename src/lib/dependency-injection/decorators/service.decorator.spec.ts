import { assert } from 'https://deno.land/std@0.160.0/testing/asserts.ts';

import { ServiceLifetime } from '../parameters/service-lifetime.enum.ts';
import { Service } from './service.decorator.ts';

Deno.test('ServiceDecorator should decorate class', () => {
  @Service({ lifetime: ServiceLifetime.Singleton, provideIn: 'root' })
  class MyServiceClass {}

  const x = new MyServiceClass();
  assert(x instanceof MyServiceClass);
});

Deno.test('ServiceDecorator should decorate class 2', () => {
  @Service({ provideIn: 'root', lifetime: ServiceLifetime.Singleton })
  class MyProvidedClass {
  }

  @Service({ lifetime: ServiceLifetime.Singleton })
  class MyDependency {}

  @Service({
    lifetime: ServiceLifetime.Singleton,
    provideIn: MyProvidedClass,
  })
  class MyServiceClass {
    /** */
    constructor(dep: MyDependency) {
    }
  }

  console.log(MyServiceClass);
});
