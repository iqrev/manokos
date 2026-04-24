'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Bell, MapPin, Check, Save } from 'lucide-react';
import { JAMBI_AREAS } from '@/types';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface UserPreference {
  preferred_areas: string[];
  notify_email: boolean;
}

export default function NotifikasiPage() {
  const { user, loading } = useAuth();
  const queryClient = useQueryClient();
  const [prefs, setPrefs] = useState<UserPreference>({
    preferred_areas: [],
    notify_email: true,
  });

  const { data, isLoading } = useQuery<UserPreference>({
    queryKey: ['me', 'preferences'],
    queryFn: () => api.get('/me/preferences').then(r => r.data),
    enabled: !!user,
  });

  useEffect(() => {
    if (data) {
      setPrefs({
        preferred_areas: data.preferred_areas || [],
        notify_email: data.notify_email,
      });
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: (newPrefs: UserPreference) => api.post('/me/preferences', newPrefs),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me', 'preferences'] });
      alert('Pengaturan berhasil disimpan!');
    },
  });

  const toggleArea = (area: string) => {
    setPrefs(prev => ({
      ...prev,
      preferred_areas: prev.preferred_areas.includes(area)
        ? prev.preferred_areas.filter(a => a !== area)
        : [...prev.preferred_areas, area],
    }));
  };

  if (loading || isLoading) {
    return (
      <div className="pb-nav px-5 pt-10 max-w-lg mx-auto space-y-4">
        <div className="skeleton h-12 rounded-2xl" />
        <div className="skeleton h-40 rounded-3xl" />
        <div className="skeleton h-60 rounded-3xl" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="pb-nav min-h-screen bg-[var(--color-bg-subtle)]">
      <div className="max-w-lg mx-auto px-5 pt-6 pb-20">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/akun" className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-[var(--color-border)]">
            <Check size={16} className="rotate-180" style={{ transform: 'rotate(180deg)' }} /> 
          </Link>
          <h1 className="text-[20px] font-800 text-[var(--color-text-primary)]">Email Notifikasi</h1>
        </div>

        {/* Info Card */}
        <div className="card p-5 mb-5 bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-primary-700)] text-white">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Bell size={22} className="text-white" />
            </div>
            <div>
              <p className="font-800 text-[16px]">Peringatan Kos Baru</p>
              <p className="text-[13px] text-white/80 leading-relaxed mt-1">
                Kami akan mengirimkan ringkasan kos baru sesuai kawasan pilihanmu setiap hari ke <strong>{user.email}</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Notification Toggle */}
        <div className="card p-5 mb-5 flex items-center justify-between">
          <div>
            <p className="font-700 text-[14px]">Aktifkan Notifikasi</p>
            <p className="text-[12px] text-[var(--color-text-muted)]">Kirim email jika ada kos baru</p>
          </div>
          <button
            onClick={() => setPrefs(p => ({ ...p, notify_email: !p.notify_email }))}
            className={cn(
              'w-12 h-6 rounded-full transition-colors relative',
              prefs.notify_email ? 'bg-[var(--color-primary-500)]' : 'bg-gray-300'
            )}
          >
            <div className={cn(
              'absolute top-1 w-4 h-4 rounded-full bg-white transition-all',
              prefs.notify_email ? 'left-7' : 'left-1'
            )} />
          </button>
        </div>

        {/* Area Selection */}
        <div className={cn('card p-5 mb-8 transition-opacity', !prefs.notify_email && 'opacity-50 pointer-events-none')}>
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={16} className="text-[var(--color-primary-500)]" />
            <p className="font-700 text-[14px]">Pilih Kawasan Favorit</p>
          </div>
          <p className="text-[12px] text-[var(--color-text-muted)] mb-4">
            Dapatkan info kos hanya di area terdekat kampus atau kantor impianmu.
          </p>

          <div className="grid grid-cols-2 gap-2">
            {JAMBI_AREAS.map(area => {
              const active = prefs.preferred_areas.includes(area);
              return (
                <button
                  key={area}
                  onClick={() => toggleArea(area)}
                  className={cn(
                    'flex items-center justify-between p-3 rounded-xl border transition-all text-[13px] font-600',
                    active
                      ? 'border-[var(--color-primary-500)] bg-[var(--color-primary-50)] text-[var(--color-primary-700)]'
                      : 'border-[var(--color-border)] bg-gray-50 text-[var(--color-text-secondary)] hover:border-[var(--color-primary-300)]'
                  )}
                >
                  {area}
                  {active && <Check size={14} />}
                </button>
              );
            })}
          </div>
          
          <p className="text-[11px] text-[var(--color-text-muted)] mt-4 text-center italic">
            Kosongkan pilihan untuk mendapatkan info dari seluruh wilayah Jambi.
          </p>
        </div>

        {/* Save Button */}
        <button
          onClick={() => mutation.mutate(prefs)}
          disabled={mutation.isPending}
          className="btn btn-primary w-full py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[var(--color-primary-200)]"
        >
          <Save size={18} />
          {mutation.isPending ? 'Menyimpan...' : 'Simpan Pengaturan'}
        </button>

      </div>
    </div>
  );
}
