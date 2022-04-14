import { Context } from './context.ts';
import { Constructable } from '../../utils/helpers/types.ts';
import { Next } from './next.ts';

export interface IMiddleware<T = Context> {
  execute(ctx: T, next: Next): Promise<void>;
}

export type Middleware<T = Context> =
  | ((context: T, next: Next) => void | Promise<void>)
  | IMiddleware<T>
  | Constructable<IMiddleware<T>>;
