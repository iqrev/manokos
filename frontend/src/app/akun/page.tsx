'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import {
  User, Settings, ChevronRight, LogOut, Bookmark, Home,
  ShieldCheck, MessageCircle
} from 'lucide-react';

export default function AkunPage() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="pb-nav px-5 pt-8 max-w-lg mx-auto space-y-4">
        <div className="skeleton h-24 rounded-3xl" />
        <div className="skeleton h-12 rounded-2xl" />
        <div className="skeleton h-12 rounded-2xl" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="pb-nav flex flex-col items-center justify-center min-h-[70vh] px-5 text-center">
        <div className="w-20 h-20 rounded-full bg-[var(--color-primary-50)] flex items-center justify-center mb-4">
          <User size={36} className="text-[var(--color-primary-400)]" />
        </div>
        <h1 className="text-[20px] font-800 text-[var(--color-text-primary)] mb-2">Akun Saya</h1>
        <p className="text-[14px] text-[var(--color-text-secondary)] mb-6 max-w-xs">
          Masuk untuk mengakses profil, kos tersimpan, dan fitur lainnya.
        </p>
        <div className="flex gap-3">
          <Link href="/login" className="btn btn-primary px-6">Masuk</Link>
          <Link href="/daftar" className="btn btn-outline px-6">Daftar</Link>
        </div>
      </div>
    );
  }

  const dashboardHref = user.role === 'admin' ? '/admin' : user.role === 'owner' ? '/owner' : null;

  const menuItems = [
    ...(dashboardHref ? [{ href: dashboardHref, label: 'Dashboard', Icon: LayoutDashboard, sub: user.role === 'owner' ? 'Kelola listing kos' : 'Panel admin' }] : []),
    { href: '/simpan', label: 'Kos Tersimpan', Icon: Bookmark, sub: 'Listing yang disimpan' },
    { href: '/akun/pengaturan', label: 'Pengaturan Akun', Icon: Settings, sub: 'Edit profil & password' },
  ];

  return (
    <div className="pb-nav">
      <div className="max-w-lg mx-auto px-5 pt-6 pb-8">

        {/* Profile Card */}
        <div className="card p-5 mb-5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--color-primary-400)] to-[var(--color-primary-600)] flex items-center justify-center flex-shrink-0">
            <span className="text-white font-800 text-[24px]">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-800 text-[17px] text-[var(--color-text-primary)] truncate">{user.name}</p>
            <p className="text-[13px] text-[var(--color-text-muted)] truncate">{user.email}</p>
            <div className="mt-1.5">
              {user.role === 'admin' && (
                <span className="badge badge-rejected text-[11px]">⚡ Administrator</span>
              )}
              {user.role === 'owner' && (
                <span className="badge badge-boosted text-[11px]">🏠 Pemilik Kos</span>
              )}
              {user.role === 'user' && (
                <span className="badge badge-active text-[11px]">🔍 Pencari Kos</span>
              )}
            </div>
          </div>
        </div>

        {/* KYC Status (for owners) */}
        {user.role === 'owner' && user.kyc && (
          <div className={`mb-4 rounded-2xl p-4 border flex items-center gap-3 ${
            user.kyc.status === 'verified'
              ? 'bg-green-50 border-green-200'
              : user.kyc.status === 'pending'
                ? 'bg-amber-50 border-amber-200'
                : 'bg-red-50 border-red-200'
          }`}>
            <ShieldCheck size={20} className={
              user.kyc.status === 'verified' ? 'text-green-500'
              : user.kyc.status === 'pending' ? 'text-amber-500'
              : 'text-red-500'
            } />
            <div>
              <p className="font-700 text-[13px]">
                Status KYC: {user.kyc.status === 'verified' ? 'Terverifikasi ✓' : user.kyc.status === 'pending' ? 'Sedang Ditinjau' : 'Ditolak'}
              </p>
              {user.kyc.status !== 'verified' && (
                <Link href="/owner/kyc" className="text-[12px] text-[var(--color-primary-500)] font-600">
                  Lihat Status →
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Menu Items */}
        <div className="card divide-y divide-[var(--color-border)] mb-4">
          {menuItems.map(({ href, label, Icon, sub }) => (
            <Link key={href} href={href} className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors first:rounded-t-[20px] last:rounded-b-[20px]">
              <div className="w-9 h-9 rounded-xl bg-[var(--color-primary-50)] flex items-center justify-center flex-shrink-0">
                <Icon size={18} className="text-[var(--color-primary-500)]" />
              </div>
              <div className="flex-1">
                <p className="font-700 text-[14px] text-[var(--color-text-primary)]">{label}</p>
                {sub && <p className="text-[12px] text-[var(--color-text-muted)]">{sub}</p>}
              </div>
              <ChevronRight size={16} className="text-[var(--color-text-muted)]" />
            </Link>
          ))}
        </div>

        {/* Logout */}
        <button
          id="btn-logout"
          onClick={() => logout()}
          className="w-full card p-4 flex items-center gap-3 text-red-500 hover:bg-red-50 transition-colors"
        >
          <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
            <LogOut size={18} className="text-red-500" />
          </div>
          <span className="font-700 text-[14px]">Keluar</span>
        </button>

        <p className="text-center text-[11px] text-[var(--color-text-muted)] mt-6">
          Manokos v1.0 – Hak Cipta © 2026 Manokos
        </p>
      </div>
    </div>
  );
}

// Need to import this
function LayoutDashboard({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  );
}
