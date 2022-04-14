// deno-lint-ignore-file ban-untagged-todo
import {
  ConnInfo,
  Server as DenoServer,
  ServerInit as DenoServerInit,
} from 'https://deno.land/std@0.134.0/http/server.ts';

import { Context } from './middleware/context.ts';
import { Middleware } from './middleware/index.ts';

import { isConstructor } from '../utils/helpers/index.ts';

export class Server extends DenoServer {
  private middlewares: Middleware[] = [];

  /** */
  constructor(param?: Pick<DenoServerInit, 'hostname' | 'onError' | 'port'>) {
    super({
      ...param,
      handler: (req: Request, connInfo: ConnInfo) => {
        return this.handleRequest(req, connInfo);
      },
    });
  }

  /**
   * Add a middleware function.
   */
  public use(...mw: Middleware[]): void {
    this.middlewares.push(...mw);
  }

  /**
   * Execute the chain of middlewares, in the order they were added on a
   * given Context.
   */
  private async dispatch(context: Context) {
    const control = { invocations: 0 };
    await Server.invokeMiddlewares(context, this.middlewares, control);
    if (control.invocations !== this.middlewares.length) {
      console.warn('Somewhere the middleware chain was broke!');
    }
  }

  /**
   * Helper function for invoking a chain of middlewares on a context.
   */
  private static async invokeMiddlewares<T>(
    context: T,
    middlewares: Middleware<T>[],
    options: { invocations: number },
  ): Promise<void> {
    if (!middlewares.length) return;

    const currentMiddleware = middlewares[0];
    const next = async () => {
      options.invocations += 1;
      await Server.invokeMiddlewares(context, middlewares.slice(1), options);
    };

    if (typeof currentMiddleware === 'function') {
      if (isConstructor(currentMiddleware)) {
        // TODO: Resolve this from the Injector
        await new currentMiddleware().execute(context, next);
      } else {
        await currentMiddleware(context, next);
      }
    } else {
      await currentMiddleware.execute(context, next);
    }
  }

  async handleRequest(req: Request, conn: ConnInfo) {
    const ctx = new Context(req, new Response());
    await this.dispatch(ctx);
    return ctx.response;
  }
}
