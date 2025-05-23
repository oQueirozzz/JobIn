import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token');
  const { pathname } = request.nextUrl;

  // Se estiver na página inicial (/) e não estiver autenticado, redireciona para /dashboard
  if (pathname === '/' && !token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Se estiver na página inicial (/) e estiver autenticado, permite o acesso
  if (pathname === '/' && token) {
    return NextResponse.next();
  }

  // Se estiver em /dashboard e estiver autenticado, redireciona para /
  if (pathname === '/dashboard' && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Se estiver em uma rota protegida e não estiver autenticado, redireciona para /dashboard
  if ((pathname.startsWith('/feed') || pathname.startsWith('/perfil') || pathname.startsWith('/vagas')) && !token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/dashboard',
    '/feed/:path*',
    '/perfil/:path*',
    '/vagas/:path*'
  ],
}; 