import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './jwt';

export async function authenticateRequest(request: NextRequest) {
  try {
    // Primeiro tenta pegar do cookie
    let token = request.cookies.get('token')?.value;
    
    // Se não tiver no cookie, tenta no header Authorization
    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }
    
    if (!token) {
      return {
        error: 'Unauthorized',
        status: 401,
      };
    }

    const payload = verifyToken(token);
    return {
      user: payload,
      error: null,
    };
  } catch (error) {
    return {
      error: 'Invalid token',
      status: 401,
    };
  }
}

export function createAuthResponse(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}
