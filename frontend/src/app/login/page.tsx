'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { Home } from 'lucide-react';

function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: () => login(form.email, form.password),
    onSuccess: () => {
      const redirect = searchParams.get('redirect') || '/';
      router.push(redirect);
    },
    onError: (err: unknown) => {
      const apiError = err as { response?: { data?: { message?: string } } };
      setError(apiError?.response?.data?.message || 'Email atau password salah.');
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
        <h1 className="text-[24px] font-800 text-[var(--color-text-primary)] mb-1">Selamat Datang!</h1>
        <p className="text-[14px] text-[var(--color-text-secondary)] mb-6">Masuk ke akun Manokos kamu</p>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4" role="alert">
            <p className="text-red-600 text-[13px] font-500">{error}</p>
          </div>
        )}

        <form
          onSubmit={e => { e.preventDefault(); setError(''); mutation.mutate(); }}
          className="space-y-4"
          noValidate
        >
          <Input
            id="login-email"
            label="Email"
            type="email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            autoComplete="email"
            required
          />
          <Input
            id="login-password"
            label="Password"
            type="password"
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            autoComplete="current-password"
            required
          />

          <Button
            id="btn-login"
            type="submit"
            loading={mutation.isPending}
            className="w-full mt-2"
          >
            Masuk
          </Button>
        </form>

        <p className="text-center text-[14px] text-[var(--color-text-secondary)] mt-5">
          Belum punya akun?{' '}
          <Link href="/daftar" className="text-[var(--color-primary-500)] font-700">
            Daftar Gratis
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageInner />
    </Suspense>
  );
}
