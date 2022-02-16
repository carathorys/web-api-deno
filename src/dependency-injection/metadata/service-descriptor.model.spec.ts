import {
  assert,
  assertThrows,
} from "https://deno.land/std@0.115.1/testing/asserts.ts";
import { ServiceDescriptorError } from "../errors/service-descriptor.error.ts";
import { ServiceLifetime } from "../parameters/service-lifetime.enum.ts";
import { ServiceDescriptor } from "./service-descriptor.model.ts";

const Service = Symbol("MyService");

class ServiceImplementation {
  getString(): string {
    return "getString()";
  }
}
Deno.test("ServiceDescriptor should be able to construct", () => {
  const descriptor = new ServiceDescriptor({
    lifetime: ServiceLifetime.Singleton,
    serviceType: Service,
    implementationFactory: () => new ServiceImplementation(),
  });
  assert(descriptor);
  assert(descriptor.serviceType);
});
Deno.test("ServiceDescriptor should be able to construct", () => {
  const descriptor = new ServiceDescriptor({
    lifetime: ServiceLifetime.Singleton,
    serviceType: Service,
    implementationInstance: new ServiceImplementation(),
  });
  assert(descriptor);
  assert(descriptor.serviceType);
});
Deno.test("ServiceDescriptor should be able to construct", () => {
  const descriptor = new ServiceDescriptor({
    lifetime: ServiceLifetime.Singleton,
    serviceType: Service,
    implementationType: ServiceImplementation,
  });
  assert(descriptor);
  assert(descriptor.serviceType);
});
Deno.test("ServiceDescriptor should be able to construct", () => {
  const descriptor = new ServiceDescriptor({
    lifetime: ServiceLifetime.Singleton,
    implementationType: ServiceImplementation,
  });
  assert(descriptor);
  assert(descriptor.serviceType);
});
Deno.test("ServiceDescriptor should be able to construct", () => {
  const descriptor = new ServiceDescriptor({
    lifetime: ServiceLifetime.Singleton,
    implementationInstance: new ServiceImplementation(),
  });
  assert(descriptor);
  assert(descriptor.serviceType);
});
Deno.test("ServiceDescriptor should be able to construct", () => {
  const descriptor = new ServiceDescriptor({
    lifetime: ServiceLifetime.Singleton,
    implementationFactory: () => new ServiceImplementation(),
  });
  assert(descriptor);
  assert(descriptor.serviceType);
});
Deno.test("ServiceDescriptor should be able to construct", () => {
  assertThrows(() =>
    new ServiceDescriptor({
      lifetime: ServiceLifetime.Scoped,
      implementationFactory: () => new ServiceImplementation(),
    }), ServiceDescriptorError);
});
