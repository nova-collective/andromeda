import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

type MiddlewareFn = (
  request: NextRequest,
  next: () => NextResponse | Promise<NextResponse>
) => NextResponse | Promise<NextResponse>;

const loggerMiddleware: MiddlewareFn = async (request, next) => {
  // console.log('Hello world from middleware');
  return next();
};

const secondMiddleware: MiddlewareFn = async (_request, next) => {
  // console.log('Second middleware executed');
  return next();
};

const middlewareChain: MiddlewareFn[] = [loggerMiddleware, secondMiddleware];

export function middleware(request: NextRequest) {
  const execute = (index: number): NextResponse | Promise<NextResponse> => {
    if (index >= middlewareChain.length) {
      return NextResponse.next();
    }

    const handler = middlewareChain[index];
    return handler(request, () => execute(index + 1));
  };

  return execute(0);
}
