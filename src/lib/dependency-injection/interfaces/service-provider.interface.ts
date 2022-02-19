import { Constructable } from "../../utils/helpers/types.ts";

export interface IServiceProvider {
  getInstance<T>(): T;
  get(T: Constructable<unknown>): unknown;
}
