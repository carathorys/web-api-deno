import { DisposeError } from "./dispose.error.ts";

export class ObjectDisposedError extends DisposeError {
  constructor(message?: string) {
    super(message);
  }
}
