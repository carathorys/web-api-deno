// deno-lint-ignore-file ban-types
import { Reflect } from 'https://deno.land/x/deno_reflect@v0.2.1/mod.ts';

import { DIError } from './errors/di.error.ts';

import { IDisposable } from '../disposable/interfaces/disposable.ts';
import { Disposable } from '../disposable/decorators/disposable-decorator.ts';
import { DisposeError } from '../disposable/errors/dispose.error.ts';
import { Constructable } from '../utils/helpers/types.ts';

import type { InjectorParameters } from './parameters/index.ts';
import { InjectableParameters, ServiceLifetime } from './parameters/index.ts';

@Disposable({ recursive: true })
export class Injector implements IDisposable {
  constructor(public readonly parameters?: InjectorParameters) {}

  /**
   * Static class metadata map, filled by the @Injectable() decorator
   */
  public static meta: Map<
    Constructable<unknown>,
    {
      dependencies: Array<Constructable<unknown>>;
      options: InjectableParameters;
    }
  > = new Map();

  public readonly cachedSingletons: Map<Constructable<unknown>, unknown> = new Map();

  public remove<T>(ctor: Constructable<T>) {
    this.cachedSingletons.delete(ctor);
  }

  private getOriginalType<T>(ctor: Constructable<T>) {
    if (ctor.name === 'DisposableClass') {
      return (ctor as unknown as { __baseClass: Constructable<T> }).__baseClass;
    }
    return ctor;
  }

  /**
   * @param ctor The constructor object (e.g. MyClass)
   * @param dependencies Resolved dependencies (usually provided by the framework)
   * @returns The instance of the requested service
   */
  public getInstance<T>(ctor: Constructable<T>, dependencies: Array<Constructable<T>> = []): T {
    if (ctor === this.constructor) {
      return this as unknown as T;
    }

    const meta = Injector.meta.get(ctor);
    if (!meta) {
      throw new DIError(
        ctor,
        `No metadata found for '${this.getOriginalType(ctor).name}'. Dependencies: ${
          dependencies
            .map((d) => this.getOriginalType(d).name)
            .join(',')
        }. Be sure that it's decorated with '@Injectable()' or added explicitly with SetInstance()`,
      );
    }
    if (dependencies.includes(ctor)) {
      throw new DIError(ctor, `Circular dependencies found.`);
    }

    if (meta.options.lifetime === ServiceLifetime.Singleton) {
      const invalidDeps = meta.dependencies
        .map((dep) => ({ meta: Injector.meta.get(dep), dep }))
        .filter(
          (m) =>
            m.meta &&
            (m.meta.options.lifetime === ServiceLifetime.Scoped ||
              m.meta.options.lifetime === ServiceLifetime.Transient),
        )
        .map((i) => i.meta && `${i.dep.name}:${ServiceLifetime[i.meta.options.lifetime]}`);
      if (invalidDeps.length) {
        throw new DIError(
          ctor,
          `Injector error: Singleton type '${this.getOriginalType(ctor).name}' depends on non-singleton injectables: ${
            invalidDeps.join(',')
          }`,
        );
      }
    } else if (meta.options.lifetime === ServiceLifetime.Scoped) {
      const invalidDeps = meta.dependencies
        .map((dep) => ({ meta: Injector.meta.get(dep), dep }))
        .filter((m) => m.meta && m.meta.options.lifetime === ServiceLifetime.Transient)
        .map((i) => i.meta && `${this.getOriginalType(i.dep).name}:${ServiceLifetime[i.meta.options.lifetime]}`);
      if (invalidDeps.length) {
        throw new DIError(
          ctor,
          `Injector error: Scoped type '${this.getOriginalType(ctor).name}' depends on transient injectables: ${
            invalidDeps.join(',')
          }`,
        );
      }
    }

    if (this.cachedSingletons.has(ctor)) {
      return this.cachedSingletons.get(ctor) as T;
    }
    const fromParent = meta.options.lifetime === ServiceLifetime.Singleton &&
      this.parameters?.parent &&
      this.parameters.parent.getInstance(ctor);
    if (fromParent) {
      return fromParent;
    }
    const deps = meta.dependencies.map((dep) => this.getInstance(dep, [...dependencies, ctor]));
    const newInstance = new ctor(...deps);
    if (meta.options.lifetime !== ServiceLifetime.Transient) {
      this.setExplicitInstance(newInstance as object);
    }
    return newInstance;
  }

  /**
   * Sets explicitliy an instance for a key in the store
   *
   * @param instance The created instance
   * @param key The class key to be persisted (optional, calls back to the instance's constructor)
   */
  public setExplicitInstance<T extends object>(instance: T, key?: Constructable<T>) {
    const ctor = key || (instance.constructor as Constructable<T>);
    if (!Injector.meta.has(ctor)) {
      const meta = Reflect.getMetadata('design:paramtypes', ctor);
      Injector.meta.set(ctor, {
        dependencies: (meta &&
          (meta as unknown[]).map((param) => {
            return param;
          })) ||
          [],
        options: { lifetime: ServiceLifetime.Explicit },
      });
    }
    if (instance.constructor === this.constructor) {
      throw new DIError(this.getOriginalType(ctor), 'Cannot set an injector instance as injectable');
    }
    this.cachedSingletons.set(ctor, instance);
  }

  /**
   * Creates a child injector instance
   *
   * @param options Additional injector options
   * @returns the created Injector
   */
  public createChild(options?: Partial<Injector['parameters']>) {
    return new Injector({ ...options, parent: this });
  }

  /**
   * Disposes the Injector object and all its disposable injectables
   */
  public async dispose() {
    // deno-lint-ignore no-explicit-any
    const singletons = Array.from(this.cachedSingletons.entries()).map((e) => e[1] as any);
    const disposeRequests = singletons
      .filter((s) => s !== this)
      .map(async (s) => {
        if (s.dispose) {
          await s.dispose();
        }
      });
    const result = await Promise.allSettled(disposeRequests);
    const fails = result.filter((r) => r.status === 'rejected').map((x) => (x as PromiseRejectedResult).reason);
    if (fails && fails.length) {
      throw new DisposeError(
        `There was an error during disposing '${fails.length}' global disposable object(s)`,
        fails,
      );
    }

    this.cachedSingletons.clear();
  }
}
