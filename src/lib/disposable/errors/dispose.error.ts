// deno-lint-ignore-file no-explicit-any
export class DisposeError extends Error {
  constructor(message?: string, protected readonly parameters?: any[]) {
    super(message, {
      cause: parameters,
    });
  }
}
