/**
 * @description Simple IDisposable interface to use
 * @memberof IDisposable
 */
export interface IDisposable {
  /**
   * @description Disposes the object which implements the interface
   * @memberof IDisposable
   */
  dispose(): void | Promise<void>;
}
