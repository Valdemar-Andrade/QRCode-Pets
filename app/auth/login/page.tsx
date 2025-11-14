'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '@/lib/validations/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Erro ao fazer login');
        setIsLoading(false);
        return;
      }

      // Redirecionar para o dashboard
      router.push('/dashboard/pets');
      router.refresh();
    } catch (err) {
      setError('Erro ao conectar com o servidor');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 px-4 relative overflow-hidden">
      {/* Decorações de fundo com tema Pet */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-6xl opacity-10 animate-bounce" style={{ animationDuration: '3s' }}>🐾</div>
        <div className="absolute top-40 right-20 text-5xl opacity-10 animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }}>🐶</div>
        <div className="absolute bottom-32 left-20 text-4xl opacity-10 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '1s' }}>🐱</div>
        <div className="absolute bottom-20 right-10 text-6xl opacity-10 animate-bounce" style={{ animationDuration: '4.5s', animationDelay: '1.5s' }}>❤️</div>
      </div>

      <div className="max-w-md w-full space-y-8 bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-pink-200 relative z-10">
        <div className="text-center">
          <div className="mb-4">
            <span className="text-6xl">🐾</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
            Bem-vindo de volta!
          </h1>
          <p className="mt-3 text-gray-600 text-lg">
            Entre na sua conta para cuidar dos seus pets
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <Input
              label="Email"
              type="email"
              {...register('email')}
              error={errors.email?.message}
              placeholder="seu@email.com"
            />

            <Input
              label="Senha"
              type="password"
              {...register('password')}
              error={errors.password?.message}
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" className="w-full text-lg py-3" isLoading={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar 🐾'}
          </Button>
        </form>

        <div className="text-center pt-4">
          <p className="text-sm text-gray-600">
            Não tem uma conta?{' '}
            <Link
              href="/auth/register"
              className="font-semibold text-pink-600 hover:text-pink-700 transition-colors"
            >
              Crie uma agora! 🎉
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
