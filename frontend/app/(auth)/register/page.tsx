'use client';

import { authApi } from '@/lib/api/api';
import { useAuthStore } from '@/store/auth-store';
import { Lock, Mail, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RegisterPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.register({ nome, email, senha: password });
      const user = response.data.user;

      login(user);

      router.push('/dashboard');
    } catch (err: any) {
      console.error('Erro no registro:', err);
      setError(err.response?.data?.error || 'Erro ao registrar. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-background p-4'>
      <div className='w-full max-w-md rounded-xl shadow-lg p-8 flex flex-col items-center'>
        <img src='/logo-optimized.webp' alt='Fio Condutor' className='h-32 w-32 logo-custom-rounded' loading='lazy' />
        <h1 className='mt-4 text-2xl font-bold text-gray-900'>Fio Condutor</h1>
        <p className='text-gray-600'>Ateliê de Costura</p>

        <form onSubmit={handleSubmit} className='space-y-4 w-full'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Nome Completo</label>
            <div className='relative'>
              <User className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
              <input
                type='text'
                placeholder='Seu nome'
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className='pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent'
                required
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>E-mail</label>
            <div className='relative'>
              <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
              <input
                type='email'
                placeholder='seu@email.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent'
                required
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Senha</label>
            <div className='relative'>
              <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
              <input
                type='password'
                placeholder='••••••••'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent'
                required
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Confirmar Senha</label>
            <div className='relative'>
              <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
              <input
                type='password'
                placeholder='••••••••'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className='pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent'
                required
              />
            </div>
          </div>

          {error && <div className='rounded-lg bg-red-50 p-3 text-sm text-red-700'>{error}</div>}

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-primary text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
          >
            {loading ? 'Criando conta...' : 'Cadastrar'}
          </button>

          <div className='text-center text-sm'>
            <span className='text-gray-600'>Já tem uma conta? </span>
            <Link href='/login' className='text-primary hover:underline font-medium'>
              Faça login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
