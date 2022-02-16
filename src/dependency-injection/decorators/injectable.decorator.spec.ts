// deno-lint-ignore-file no-explicit-any no-unused-vars
import { assert } from 'https://deno.land/std@0.125.0/testing/asserts.ts';
import { Injector } from '../injector.ts';
import { ServiceLifetime } from '../parameters/service-lifetime.enum.ts';
import { Injectable } from './injectable.decorator.ts';

Deno.test('Injectable decorator should decorate classes', () => {
	@Injectable()
	class MyCustomService {}
	const a = new MyCustomService();
	assert(a instanceof MyCustomService);
});

Deno.test('InjectableDecorator should resolve ctor parameters', () => {
	class ServiceDependency {
		public value = 1;

		public print() {
			// ignore
		}
	}
	@Injectable()
	class MyCustomService {
		constructor(public service: ServiceDependency) {
		}
		setValue(value: number) {
			this.service.print();
		}
	}

	const a = new MyCustomService(null as any);
	assert(a instanceof MyCustomService);
	assert(Injector.meta.has(MyCustomService));
});

Deno.test('Should resolve ctor paramaters', () => {
	interface IServiceDefinition {
		value: string;
	}
	@Injectable({ lifetime: ServiceLifetime.Scoped })
	class ServiceDependency implements IServiceDefinition {
		public value = '1';
	}

	@Injectable({ lifetime: ServiceLifetime.Scoped })
	class ServiceDependency2 implements IServiceDefinition {
		public value = '1';
		constructor(private readonly dep: ServiceDependency) {}
		clone(): ServiceDependency2 {
			return new ServiceDependency2(this.dep);
		}
	}
	@Injectable()
	class MyCustomService {
		constructor(public service: IServiceDefinition) {
			if (this.service instanceof ServiceDependency) {
				console.log('1');
			} else if (this.service instanceof ServiceDependency2) {
				console.log('1');
			} else {
				console.log('3');
			}
		}
	}

	const a = new MyCustomService(null as any);
	assert(a instanceof MyCustomService);
	assert(Injector.meta.has(MyCustomService));
});
