import { assertExists } from "https://deno.land/std@0.107.0/testing/asserts.ts";

import { Injector } from "../injector.ts";

// import { Inject } from './inject.decorator';
// import { Injectable } from './injectable.decorator';

Deno.test("@FromService decorator", () => {
  const injector = new Injector();
  assertExists(injector);
});
