import { NextResponse } from 'next/server';

export function middleware(request) {
    const authToken = request.cookies.get('authToken')?.value;
    const { pathname } = request.nextUrl;

    // Lista de rotas públicas que não precisam de autenticação
    const publicRoutes = ['/dashboard', '/login', '/novaSenha', '/cadAlunos', '/cadEmpresas', '/vagas'];
    const isPublicRoute = publicRoutes.includes(pathname);

    // Se não estiver autenticado
    if (!authToken) {
        // Se tentar acessar uma rota protegida, redireciona para /dashboard
        if (!isPublicRoute) {
            const url = new URL('/dashboard', request.url);
            return NextResponse.redirect(url);
        }
        // Se já estiver em uma rota pública, permite o acesso
        return NextResponse.next();
    }

    // Se estiver autenticado
    // Se tentar acessar rotas de login/cadastro (exceto /vagas), redireciona para a página principal
    if (isPublicRoute && pathname !== '/vagas') {
        const url = new URL('/', request.url);
        return NextResponse.redirect(url);
    }

    // Para todas as outras rotas, permite o acesso
    return NextResponse.next();
}

// Configurar quais caminhos o middleware deve ser executado
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
    ],
};