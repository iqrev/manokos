'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Plus, Eye, MessageCircle, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Property, PropertyStat } from '@/types';
import { formatPrice, cn } from '@/lib/utils';

export default function OwnerDashboard() {
  const { user } = useAuth();

  const { data: properties } = useQuery<Property[]>({
    queryKey: ['owner-properties'],
    queryFn: () => api.get('/owner/properties').then(r => r.data),
  });

  const { data: stats } = useQuery<PropertyStat[]>({
    queryKey: ['owner-stats'],
    queryFn: () => api.get('/owner/stats').then(r => r.data),
  });

  const kycStatus = user?.kyc?.status;
  const totalViews = stats?.reduce((s, st) => s + st.views, 0) ?? 0;
  const totalClicks = stats?.reduce((s, st) => s + st.whatsapp_clicks, 0) ?? 0;

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-[24px] font-800 text-[var(--color-text-primary)] mb-1">
        Selamat datang, {user?.name?.split(' ')[0]}! 👋
      </h1>
      <p className="text-[14px] text-[var(--color-text-secondary)] mb-6">
        Kelola listing kos dan pantau performa propertimu di sini.
      </p>

      {/* KYC Banner */}
      {(!kycStatus || kycStatus === 'pending' || kycStatus === 'rejected') && (
        <div className={cn(
          'rounded-2xl p-4 mb-6 flex items-start gap-3 border',
          kycStatus === 'rejected' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'
        )}>
          {kycStatus === 'rejected' ? <AlertCircle size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
            : <Clock size={20} className="text-amber-600 mt-0.5 flex-shrink-0" />}
          <div className="flex-1">
            <p className={cn('font-700 text-[14px]', kycStatus === 'rejected' ? 'text-red-700' : 'text-amber-700')}>
              {!kycStatus ? 'Lengkapi Verifikasi KYC' : kycStatus === 'pending' ? 'KYC Sedang Ditinjau' : 'KYC Ditolak – Harap Ajukan Ulang'}
            </p>
            <p className="text-[12px] text-[var(--color-text-secondary)] mt-0.5">
              {!kycStatus ? 'Verifikasi identitas diperlukan agar propertimu muncul di halaman pencarian.' : kycStatus === 'pending' ? 'Tunggu 1-2 hari kerja.' : 'Hubungi admin atau ajukan ulang dokumen.'}
            </p>
          </div>
          {(!kycStatus || kycStatus === 'rejected') && (
            <Link href="/owner/kyc" className="btn btn-primary text-[13px] px-3 py-1.5 flex-shrink-0">Verifikasi</Link>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {[
          { icon: '🏠', label: 'Total Properti', value: properties?.length ?? 0 },
          { icon: '👁️', label: 'Total Dilihat', value: totalViews.toLocaleString() },
          { icon: '💬', label: 'Klik WhatsApp', value: totalClicks.toLocaleString() },
        ].map(({ icon, label, value }) => (
          <div key={label} className="card p-5">
            <p className="text-3xl mb-2">{icon}</p>
            <p className="text-[28px] font-800 text-[var(--color-text-primary)] leading-none">{value}</p>
            <p className="text-[13px] text-[var(--color-text-muted)] mt-0.5 font-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Properties List */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title">Properti Saya</h2>
        <Link href="/owner/properti/tambah" className="btn btn-primary text-[13px] px-4 py-2 gap-1.5">
          <Plus size={16} /> Tambah Kos
        </Link>
      </div>

      <div className="space-y-3">
        {properties?.length === 0 && (
          <div className="card p-8 text-center">
            <p className="text-4xl mb-3">🏡</p>
            <p className="font-600 text-[var(--color-text-secondary)]">Belum ada properti. Mulai tambahkan!</p>
            <Link href="/owner/properti/tambah" className="btn btn-primary mt-4 px-5">
              + Tambah Properti Pertama
            </Link>
          </div>
        )}

        {properties?.map(p => (
          <div key={p.id} className="card p-4 flex gap-3 items-center">
            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
              {p.main_image ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/storage/${p.main_image}`}
                  alt={p.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xl">🏠</div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-700 text-[14px] text-[var(--color-text-primary)] truncate">{p.title}</p>
              <p className="text-[12px] text-[var(--color-text-muted)] mb-1">{p.area} · {formatPrice(p.price_monthly)}/bln</p>
              <div className="flex gap-1.5 flex-wrap">
                <span className={cn('badge text-[11px]', p.status === 'active' ? 'badge-active' : 'badge-pending')}>
                  {p.status === 'active' ? 'Aktif' : 'Nonaktif'}
                </span>
                {!p.is_verified && <span className="badge badge-pending text-[11px]">Menunggu Verif.</span>}
                {p.is_boosted && <span className="badge badge-boosted text-[11px]">⭐ Unggulan</span>}
              </div>
            </div>

            <Link href={`/owner/properti/${p.id}/edit`} className="btn btn-ghost text-[13px] px-3 py-2">
              Edit
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
