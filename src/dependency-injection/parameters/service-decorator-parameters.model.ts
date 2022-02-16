// deno-lint-ignore-file no-explicit-any ban-types
import { Constructable } from "../../utils/helpers/types.ts";

import { IServiceProvider } from "../interfaces/service-provider.interface.ts";
import { ServiceLifetime } from "./service-lifetime.enum.ts";

export type ImplementationFactory<T> = (provider: IServiceProvider) => T;

export interface ServiceDecoratorParameters<T> {
  lifetime: ServiceLifetime;

  provideIn?: Constructable<any> | "root" | "any";
  implementationType?: Constructable<T>;
  implementationInstance?: T;
  implementationFactory?: ImplementationFactory<T>;
  
  serviceType?: Symbol;
}
