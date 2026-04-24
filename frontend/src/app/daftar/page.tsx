'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

function DaftarPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register } = useAuth();

  const defaultRole = (searchParams.get('role') === 'owner' ? 'owner' : 'user') as 'owner' | 'user';
  const [role, setRole] = useState<'owner' | 'user'>(defaultRole);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', password_confirmation: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const mutation = useMutation({
    mutationFn: () => register({ ...form, role }),
    onSuccess: () => {
      if (role === 'owner') router.push('/owner/kyc');
      else router.push('/');
    },
    onError: (err: unknown) => {
      const apiError = err as { response?: { data?: { errors?: Record<string, string[]> } } };
      const raw = apiError?.response?.data?.errors;
      if (raw) {
        const flat: Record<string, string> = {};
        Object.entries(raw).forEach(([k, v]) => { flat[k] = v[0]; });
        setErrors(flat);
      }
    },
  });

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col items-center justify-center px-5 py-12">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mb-8">
        <div className="w-10 h-10 rounded-2xl bg-[var(--color-primary-500)] flex items-center justify-center">
          <span className="text-white font-bold text-lg">M</span>
        </div>
        <span className="text-[22px] font-800 text-[var(--color-text-primary)]">
          Mano<span className="text-[var(--color-primary-500)]">kos</span>
        </span>
      </Link>

      <div className="card w-full max-w-md p-8">
        <h1 className="text-[24px] font-800 text-[var(--color-text-primary)] mb-1">Buat Akun Baru</h1>
        <p className="text-[14px] text-[var(--color-text-secondary)] mb-5">Bergabung dengan Manokos. Gratis selamanya.</p>

        {/* Role Toggle */}
        <div className="grid grid-cols-2 gap-2 mb-5 bg-gray-100 rounded-2xl p-1">
          {([['user', '🔍 Pencari Kos'], ['owner', '🏠 Pemilik Kos']] as const).map(([r, label]) => (
            <button
              key={r}
              id={`role-${r}`}
              type="button"
              onClick={() => setRole(r)}
              className={cn(
                'py-2.5 rounded-xl text-[13px] font-600 transition-all',
                role === r ? 'bg-white shadow-card text-[var(--color-primary-500)]' : 'text-[var(--color-text-secondary)]'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <form
          onSubmit={e => { e.preventDefault(); setErrors({}); mutation.mutate(); }}
          className="space-y-4"
          noValidate
        >
          <Input id="reg-name" label="Nama Lengkap" value={form.name} error={errors.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          <Input id="reg-email" label="Email" type="email" value={form.email} error={errors.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))} autoComplete="email" required />
          <Input id="reg-phone" label="No. WhatsApp" type="tel" value={form.phone} error={errors.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder=" " />
          <Input id="reg-password" label="Password" type="password" value={form.password} error={errors.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))} autoComplete="new-password" required />
          <Input id="reg-confirm" label="Konfirmasi Password" type="password" value={form.password_confirmation}
            error={errors.password_confirmation}
            onChange={e => setForm(f => ({ ...f, password_confirmation: e.target.value }))}
            autoComplete="new-password" required />

          {role === 'owner' && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
              <p className="text-amber-700 text-[12px] font-500 leading-relaxed">
                📋 Setelah mendaftar, kamu perlu mengisi data verifikasi (KYC) agar properti dapat ditampilkan.
              </p>
            </div>
          )}

          <Button id="btn-register" type="submit" loading={mutation.isPending} className="w-full mt-2">
            Daftar Sekarang
          </Button>
        </form>

        <p className="text-center text-[14px] text-[var(--color-text-secondary)] mt-5">
          Sudah punya akun?{' '}
          <Link href="/login" className="text-[var(--color-primary-500)] font-700">Masuk</Link>
        </p>
      </div>
    </div>
  );
}

export default function DaftarPage() {
  return (
    <Suspense>
      <DaftarPageInner />
    </Suspense>
  );
}
