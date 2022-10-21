import { assert } from 'https://deno.land/std@0.160.0/testing/asserts.ts';

import { ServiceLifetime } from '../parameters/service-lifetime.enum.ts';
import { Service } from './service.decorator.ts';

Deno.test('ServiceDecorator should decorate class', () => {
  @Service({ lifetime: ServiceLifetime.Singleton, provideIn: 'root' })
  class MyServiceClass {}

  const x = new MyServiceClass();
  assert(x instanceof MyServiceClass);
});
