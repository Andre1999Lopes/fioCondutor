import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Verificar se tem token no cookie (salvo pelo login)
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Rotas públicas que não precisam de autenticação
  const publicPaths = ["/login", "/register", "/"];
  const isPublicPath = publicPaths.some((path) => pathname === path);

  // Se não tem token e está tentando acessar rota protegida (que não seja pública)
  if (!token && !isPublicPath && !pathname.startsWith("/api")) {
    // Permitir acesso ao dashboard - deixar o cliente fazer a verificação
    // pois localStorage é verificado apenas no browser
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/(dashboard)")) {
      return NextResponse.next();
    }
    
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Se tem token e está tentando acessar rota pública
  if (token && (pathname.startsWith("/login") || pathname.startsWith("/register"))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

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
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};