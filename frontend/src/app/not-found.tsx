import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Halaman Tidak Ditemukan | Manokos',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col items-center justify-center px-5 text-center">
      <div className="text-8xl mb-6">🏚️</div>
      <h1 className="text-[28px] font-800 text-[var(--color-text-primary)] mb-2">404</h1>
      <p className="text-[18px] font-700 text-[var(--color-text-primary)] mb-2">Halaman Tidak Ditemukan</p>
      <p className="text-[14px] text-[var(--color-text-secondary)] mb-8 max-w-xs leading-relaxed">
        Sepertinya kos yang kamu cari sudah penuh atau halaman ini tidak tersedia.
      </p>
      <div className="flex gap-3">
        <Link href="/" className="btn btn-primary px-6">Ke Beranda</Link>
        <Link href="/cari" className="btn btn-outline px-6">Cari Kos</Link>
      </div>
    </div>
  );
}
