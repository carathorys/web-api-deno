// deno-lint-ignore-file no-explicit-any
import { Constructable } from "../../utils/helpers/types.ts";

export interface IServiceProvider {
  getInstance<T>(): T;

  get(T: Constructable<any>): any;
}
