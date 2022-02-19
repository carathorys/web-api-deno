// deno-lint-ignore-file no-explicit-any
import { Constructable } from '../../utils/helpers/types.ts';

export class DIError extends Error {
  constructor(...args: any[]);
  constructor(private readonly ctor: Constructable<unknown>, ...args: any[]) {
    super(...args);
  }

  public get TypeName(): string {
    return this.ctor.name;
  }
}
