// deno-lint-ignore-file no-explicit-any
export class DisposeError extends Error {
  constructor(message?: string, public readonly parameters?: any[]) {
    super(message);
  }
}
