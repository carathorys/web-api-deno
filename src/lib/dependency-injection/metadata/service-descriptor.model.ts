// deno-lint-ignore-file ban-types no-explicit-any
import { IDisposable } from '../../disposable/index.ts';
import { Constructable } from '../../utils/helpers/types.ts';
import { ServiceDescriptorError } from '../errors/service-descriptor.error.ts';
import { ImplementationFactory, ServiceDecoratorParameters, ServiceLifetime } from '../parameters/index.ts';

export class ServiceDescriptor<T> {
  public readonly serviceLifetime: ServiceLifetime;

  public readonly serviceType?: Symbol;
  public readonly implementationType?: Constructable<T>;
  public readonly implementationInstance?: T;
  public readonly implementationFactory?: ImplementationFactory<T>;
  public readonly provideIn?:
    | Constructable<unknown>
    | 'root'
    | 'platform'
    | 'any';
  /** */
  constructor({
    lifetime,
    serviceType,
    provideIn,
    implementationFactory,
    implementationInstance,
    implementationType,
  }: ServiceDecoratorParameters<T>) {
    if (!lifetime) throw new Error('No `lifetime` (required) was provided!');
    this.serviceLifetime = lifetime;

    if (
      this.serviceLifetime === ServiceLifetime.Scoped &&
      !ServiceDescriptor.IsDisposable(provideIn)
    ) {
      throw new ServiceDescriptorError(
        'Scoped services can be injected into disposable objects only!',
      );
    }
    this.implementationType = implementationType;
    this.implementationInstance = implementationInstance;
    this.implementationFactory = implementationFactory;

    this.serviceType = serviceType ||
      Symbol(this.getImplementationType()?.name);

    if (this.serviceType === undefined) {
      throw new ServiceDescriptorError('Can\'t determine the service type!');
    }
  }

  public static IsDisposable(object: any): object is IDisposable {
    return !!(object as any) &&
      typeof (object as any)['dispose'] === 'function';
  }

  public getImplementationType(): Constructable<T> | undefined {
    if (this.implementationType) {
      return this.implementationType;
    } else if (this.implementationInstance) {
      return (this.implementationInstance as any)['constructor'];
    } else if (this.implementationFactory !== undefined) {
      return ((typeof (false as true) &&
        this.implementationFactory(undefined as any)) as any)['constructor'];
    }
    return undefined;
  }
}
