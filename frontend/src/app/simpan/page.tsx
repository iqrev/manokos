'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Bookmark, MapPin } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Property } from '@/types';
import { formatPrice, formatType, cn } from '@/lib/utils';
import PropertyCard from '@/components/PropertyCard';
import BookmarkButton from '@/components/BookmarkButton';

export default function SimpanPage() {
  const { user, loading } = useAuth();

  const { data: bookmarks = [], isLoading } = useQuery<Property[]>({
    queryKey: ['bookmarks'],
    queryFn: () => api.get('/bookmarks').then(r => r.data),
    enabled: !!user,
  });

  if (loading) {
    return (
      <div className="pb-nav px-5 pt-8 max-w-2xl mx-auto">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="skeleton h-64 rounded-2xl mb-4" />
        ))}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="pb-nav flex flex-col items-center justify-center min-h-[60vh] px-5 text-center">
        <div className="w-20 h-20 rounded-full bg-[var(--color-primary-50)] flex items-center justify-center mb-4">
          <Bookmark size={36} className="text-[var(--color-primary-400)]" />
        </div>
        <h1 className="text-[20px] font-800 text-[var(--color-text-primary)] mb-2">Simpan Kos Favoritmu</h1>
        <p className="text-[14px] text-[var(--color-text-secondary)] leading-relaxed mb-6 max-w-xs">
          Login untuk menyimpan dan membandingkan kos-kos yang kamu sukai.
        </p>
        <div className="flex gap-3">
          <Link href="/login" className="btn btn-primary px-6">Masuk</Link>
          <Link href="/daftar" className="btn btn-outline px-6">Daftar</Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="pb-nav px-5 pt-8 max-w-2xl mx-auto">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="skeleton h-64 rounded-2xl mb-4" />
        ))}
      </div>
    );
  }

  return (
    <div className="pb-nav">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 max-w-4xl mx-auto">
        <h1 className="text-[22px] font-800 text-[var(--color-text-primary)] flex items-center gap-2">
          <Bookmark size={22} className="text-[var(--color-primary-500)]" />
          Kos Tersimpan
        </h1>
        <p className="text-[14px] text-[var(--color-text-secondary)] mt-1">
          {bookmarks.length} kos tersimpan
        </p>
      </div>

      {bookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] px-5 text-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Bookmark size={36} className="text-gray-400" />
          </div>
          <h2 className="text-[18px] font-700 text-[var(--color-text-primary)] mb-2">Belum ada yang disimpan</h2>
          <p className="text-[14px] text-[var(--color-text-secondary)] mb-5">
            Tekan ikon 🔖 pada halaman detail kos untuk menyimpannya di sini.
          </p>
          <Link href="/cari" className="btn btn-primary px-6">Cari Kos Sekarang</Link>
        </div>
      ) : (
        <div className="px-5 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookmarks.map(property => (
              <div key={property.id} className="relative group">
                <PropertyCard property={property} />
                {/* Bookmark remove button overlay */}
                <div className="absolute top-3 right-3">
                  <BookmarkButton propertyId={property.id} className="p-2 min-h-[36px] min-w-[36px]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
