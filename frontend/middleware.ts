import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rotas públicas que não precisam de autenticação
  const publicPaths = ['/login', '/register', '/'];
  const isPublicPath = publicPaths.some((path) => pathname === path);

  // Como estamos usando localStorage (client-side only),
  // não podemos verificar autenticação no middleware (server-side)
  // A proteção de rotas será feita no client-side pelos componentes

  // Apenas permitir acesso a todas as rotas
  // A verificação real acontecerá nos layouts e componentes protegidos
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ]
};
