'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Eye, MessageSquare, Plus, ChevronRight, BarChart2, Home, Settings, LogOut } from 'lucide-react';
import api from '@/lib/api';
import { Property, PropertyStat } from '@/types';
import { formatPrice, cn } from '@/lib/utils';

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen bg-[var(--color-bg)] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 bg-white border-r border-[var(--color-border)] flex flex-col">
        {/* Logo */}
        <div className="p-5 border-b border-[var(--color-border)]">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[var(--color-primary-500)] flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="text-[17px] font-800">Mano<span className="text-[var(--color-primary-500)]">kos</span></span>
          </Link>
          <p className="text-[11px] text-[var(--color-text-muted)] mt-1">Dashboard Pemilik</p>
        </div>

        {/* User info */}
        <div className="px-4 py-3 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[var(--color-primary-100)] flex items-center justify-center flex-shrink-0">
              <span className="text-[var(--color-primary-600)] font-700 text-[14px]">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="font-700 text-[13px] text-[var(--color-text-primary)] truncate">{user?.name}</p>
              <p className="text-[11px] text-[var(--color-text-muted)] truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {[
            { href: '/owner', label: 'Beranda', Icon: Home },
            { href: '/owner/properti', label: 'Properti Saya', Icon: Home },
            { href: '/owner/statistik', label: 'Statistik', Icon: BarChart2 },
            { href: '/owner/kyc', label: 'Verifikasi KYC', Icon: Settings },
          ].map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-600 text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-50)] hover:text-[var(--color-primary-500)] transition-colors"
            >
              <Icon size={17} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-[var(--color-border)]">
          <button
            onClick={() => logout()}
            className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-[13px] font-600 text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={16} /> Keluar
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
