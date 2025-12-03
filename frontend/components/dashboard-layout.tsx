'use client';

import { useAuth } from '@/lib/hooks/use-auth';
import { BarChart3, BookOpen, CreditCard, GraduationCap, LogOut, Menu, User, Users, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const menuItems = [
    { label: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { label: 'Alunos', href: '/dashboard/alunos', icon: Users },
    { label: 'Turmas', href: '/dashboard/turmas', icon: GraduationCap },
    { label: 'Matrículas', href: '/dashboard/matriculas', icon: GraduationCap },
    { label: 'Planos', href: '/dashboard/planos', icon: BookOpen },
    { label: 'Pagamentos', href: '/dashboard/pagamentos', icon: CreditCard }
  ];

  return (
    <div className='flex h-screen bg-gray-50'>
      <aside
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed left-0 top-0 z-40 h-full w-64 !bg-primary text-white transition-transform duration-300 lg:relative lg:translate-x-0`}
      >
        <div className='flex h-16 items-center justify-between border-b border-primary/20 px-6'>
          <Link href='/dashboard' className='flex items-center gap-3 hover:opacity-80 transition-opacity'>
            <img
              src='/logo-optimized.webp'
              alt='Fio Condutor'
              className='h-12 w-12 logo-custom-rounded'
              loading='lazy'
            />
            <h1 className='text-xl font-bold'>Fio Condutor</h1>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className='lg:hidden'>
            <X className='h-5 w-5' />
          </button>
        </div>

        <nav className='space-y-2 p-4'>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className='hover:opacity-80 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium'
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className='h-5 w-5' />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className='border-t border-primary/20 p-4'>
          <button
            onClick={handleLogout}
            className='hover-bg-destructive-10 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-destructive'
          >
            <LogOut className='h-5 w-5' />
            Sair
          </button>
        </div>
      </aside>

      <div className='flex flex-1 flex-col overflow-hidden'>
        <header className='border-b border-gray-200 bg-white px-6 py-4'>
          <div className='flex items-center justify-between'>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className='lg:hidden'>
              <Menu className='h-5 w-5' />
            </button>
            <div className='flex items-center gap-4'>
              <div className='text-right'>
                <p className='text-sm font-medium text-gray-900'>{user?.nome}</p>
                <p className='text-xs text-gray-500'>{user?.email}</p>
              </div>
              <div className='h-10 w-10 rounded-full bg-primary flex items-center justify-center'>
                <User className='h-5 w-5 text-white' />
              </div>
            </div>
          </div>
        </header>

        {sidebarOpen && (
          <div className='fixed inset-0 z-30 bg-black/50 lg:hidden' onClick={() => setSidebarOpen(false)} />
        )}

        {/* Page content */}
        <main className='flex-1 overflow-auto p-6'>{children}</main>
      </div>
    </div>
  );
}
