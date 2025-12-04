'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/use-auth';
import { Bell, LogOut, Moon, Sun, User } from 'lucide-react';
import { useTheme } from 'next-themes';

export function Header() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <header className='sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-6'>
      <div className='flex flex-1 items-center gap-4'>
        <h1 className='text-lg font-semibold md:text-xl'>Fio Condutor - Escola de Corte e Costura</h1>
      </div>

      <div className='flex items-center gap-4'>
        <Button variant='ghost' size='icon' onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          <Sun className='h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
          <Moon className='absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
          <span className='sr-only'>Alternar tema</span>
        </Button>

        <Button variant='ghost' size='icon' className='relative'>
          <Bell className='h-5 w-5' />
          <span className='absolute -right-1 -top-1 flex h-3 w-3'>
            <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75'></span>
            <span className='relative inline-flex h-3 w-3 rounded-full bg-red-500'></span>
          </span>
        </Button>

        <div className='flex items-center gap-3'>
          <div className='flex h-8 w-8 items-center justify-center rounded-full bg-primary/10'>
            <User className='h-4 w-4 text-primary' />
          </div>
          <div className='hidden md:block'>
            <p className='text-sm font-medium'>{user?.nome}</p>
            <p className='text-xs text-muted-foreground'>{user?.email}</p>
          </div>
        </div>

        <Button variant='ghost' size='icon' onClick={logout} title='Sair'>
          <LogOut className='h-5 w-5' />
        </Button>
      </div>
    </header>
  );
}
