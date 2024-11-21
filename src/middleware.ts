import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {

  const token = await getToken({ req, secret: process.env.SECRET });

  if (!token) {
    console.log('Usuário não autenticado. Redirecionando para /login');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/criarx5', '/criarx5/(.*)', '/cadastrar-jogador', '/cadastrar-jogador/(.*)', '/editar-partida', '/editar-partida/(.*)'], // Corrige o formato
};