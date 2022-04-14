import { Context, IMiddleware, Next } from '../lib/web-api/middleware/index.ts';
import { Server } from '../lib/web-api/server.ts';

const port = 8080;

const server = new Server({
  port,
  hostname: '0.0.0.0',
});

server.use(async (ctx, next) => {
  console.log('1 started, next');
  await next();
  console.log('1 finished');
});

server.use(async (ctx, next) => {
  console.log('2 started, next');
  await next();
  console.log('2 finished');
  // breaks the middleware chain
});

class MyMiddleware implements IMiddleware {
  async execute(ctx: Context, next: Next): Promise<void> {
    console.log('3 started, next');
    await next();
    console.log('3 finished');
  }
}

server.use(new MyMiddleware());
class InPlaceMiddleware implements IMiddleware {
  async execute(ctx: Context, next: Next) {
    console.log('4 started, next');
    await next();
    ctx.response = new Response('Not found', { status: 404 });
    console.log('4 finished');
  }
}
server.use(InPlaceMiddleware);
console.log(`HTTP webserver running. Access it at: http://localhost:8080/`);
await server.listenAndServe();
// await serve(handler, { port });
