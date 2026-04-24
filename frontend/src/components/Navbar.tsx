'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, LogOut, LayoutDashboard, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Don't show on dashboard pages
  const hide = ['/owner', '/admin'].some(p => pathname.startsWith(p));
  if (hide) return null;

  const dashboardHref = user?.role === 'admin' ? '/admin' : '/owner';

  return (
    <header className="hidden md:block bg-white/80 backdrop-blur-lg border-b border-[var(--color-border)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-[var(--color-primary-500)] flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <span className="text-[18px] font-bold text-[var(--color-text-primary)] tracking-tight">
            Mano<span className="text-[var(--color-primary-500)]">kos</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="flex items-center gap-1" role="navigation" aria-label="Desktop Navigation">
          <Link href="/" className={cn(
            'px-4 py-2 rounded-xl text-sm font-600 transition-colors',
            pathname === '/'
              ? 'text-[var(--color-primary-500)] bg-[var(--color-primary-50)]'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-gray-50'
          )}>Beranda</Link>

          <Link href="/cari" className={cn(
            'px-4 py-2 rounded-xl text-sm font-600 transition-colors',
            pathname.startsWith('/cari')
              ? 'text-[var(--color-primary-500)] bg-[var(--color-primary-50)]'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-gray-50'
          )}>Cari Kos</Link>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link href={dashboardHref} className="btn btn-ghost gap-1.5 text-sm px-3 py-2">
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
              <button onClick={() => logout()} className="btn btn-ghost gap-1.5 text-sm px-3 py-2 text-red-500">
                <LogOut size={16} />
                Keluar
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost text-sm px-4 py-2">Masuk</Link>
              <Link href="/daftar" className="btn btn-primary text-sm px-4 py-2">Daftar Gratis</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
