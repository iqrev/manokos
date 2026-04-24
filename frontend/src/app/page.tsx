'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, ChevronDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import api from '@/lib/api';
import PropertyCard from '@/components/PropertyCard';
import { Property, JAMBI_AREAS } from '@/types';
import { cn } from '@/lib/utils';

const AREA_ICONS: Record<string, string> = {
  'Mendalo': '🎓',
  'Telanaipura': '🏙️',
  'Sipin': '🌿',
  'Kota Baru': '🏘️',
  'Alam Barajo': '🌳',
  'Jambi Selatan': '🏢',
  'Paal Merah': '🏪',
};

export default function HomePage() {
  const router = useRouter();
  const [searchArea, setSearchArea] = useState('');

  // Featured/boosted properties
  const { data: featured, isLoading } = useQuery<{ data: Property[] }>({
    queryKey: ['featured-properties'],
    queryFn: () => api.get('/properties?per_page=8').then(r => r.data),
  });

  const handleSearch = (area?: string) => {
    const q = area || searchArea;
    if (q) router.push(`/cari?area=${encodeURIComponent(q)}`);
    else router.push('/cari');
  };

  return (
    <div className="pb-nav">
      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-primary-400) 100%)' }}>
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-8 right-8 w-40 h-40 rounded-full bg-white/30" />
          <div className="absolute bottom-4 left-4 w-24 h-24 rounded-full bg-white/20" />
          <div className="absolute top-1/2 left-1/3 w-16 h-16 rounded-full bg-white/10" />
        </div>

        <div className="relative max-w-2xl mx-auto px-5 pt-10 pb-16 text-center">
          {/* Tag */}
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-[12px] font-600 mb-4 border border-white/20">
            <span>🏠</span> Direktori Kos Terpercaya di Jambi
          </div>

          <h1 className="text-3xl md:text-4xl font-800 text-white leading-tight mb-3" style={{ letterSpacing: '-0.5px' }}>
            Temukan Kos Impian
            <br />
            <span className="text-white/80">di Kota Jambi</span>
          </h1>
          <p className="text-white/75 text-[15px] mb-8 leading-relaxed">
            Ribuan kos & kontrakan terverifikasi. Pilih, hubungi langsung via WhatsApp. Tanpa perantara.
          </p>

          {/* Search Box */}
          <div className="bg-white rounded-2xl p-2 flex gap-2 shadow-xl max-w-lg mx-auto">
            <div className="flex-1 flex items-center gap-2 px-3">
              <MapPin size={18} className="text-[var(--color-primary-500)] flex-shrink-0" />
              <select
                id="hero-area-select"
                value={searchArea}
                onChange={e => setSearchArea(e.target.value)}
                className="flex-1 text-[15px] text-[var(--color-text-primary)] bg-transparent outline-none font-500"
                aria-label="Pilih area"
              >
                <option value="">Pilih area (mis. Mendalo...)</option>
                {JAMBI_AREAS.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
            <button
              id="btn-hero-search"
              onClick={() => handleSearch()}
              className="btn btn-primary rounded-xl px-5 text-[14px]"
              aria-label="Cari kos"
            >
              <Search size={18} />
              <span className="hidden sm:inline">Cari Kos</span>
            </button>
          </div>
        </div>
      </section>

      {/* ===== AREA QUICK-SELECT ===== */}
      <section className="max-w-7xl mx-auto px-5 mt-6">
        <h2 className="section-title mb-4">Cari per Kawasan</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {JAMBI_AREAS.map(area => (
            <button
              key={area}
              id={`area-${area.toLowerCase().replace(/\s/g, '-')}`}
              onClick={() => handleSearch(area)}
              className="flex flex-col items-center flex-shrink-0 gap-1.5 px-4 py-3 bg-white rounded-2xl shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 border border-[var(--color-border)] min-w-[80px]"
            >
              <span className="text-2xl">{AREA_ICONS[area] || '📍'}</span>
              <span className="text-[12px] font-600 text-[var(--color-text-primary)] whitespace-nowrap">{area}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ===== FEATURED / BOOSTED SECTION ===== */}
      <section className="max-w-7xl mx-auto px-5 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">⭐ Kos Unggulan</h2>
          <Link href="/cari" className="text-[var(--color-primary-500)] text-[13px] font-600">
            Lihat Semua →
          </Link>
        </div>

        {isLoading ? (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-64">
                <div className="skeleton h-36 rounded-2xl mb-2" />
                <div className="skeleton h-4 w-3/4 mb-1" />
                <div className="skeleton h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="scroll-x-snap pb-3">
            {featured?.data?.map(p => (
              <PropertyCard key={p.id} property={p} variant="horizontal" />
            ))}
          </div>
        )}
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="max-w-7xl mx-auto px-5 mt-10 mb-6">
        <h2 className="section-title mb-6 text-center">Cara Pakai Manokos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: '🔍', title: 'Cari & Filter', desc: 'Pilih area, tipe, dan fasilitas yang kamu inginkan.' },
            { icon: '📸', title: 'Lihat Detail', desc: 'Foto lengkap, peta lokasi area, dan info fasilitas.' },
            { icon: '💬', title: 'Hubungi Langsung', desc: 'Chat pemilik langsung via WhatsApp. Gratis, tanpa perantara.' },
          ].map((step, i) => (
            <div key={i} className="card p-5 text-center animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="text-4xl mb-3">{step.icon}</div>
              <h3 className="font-700 text-[15px] text-[var(--color-text-primary)] mb-1">{step.title}</h3>
              <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA FOR OWNERS ===== */}
      <section className="mx-5 mb-10">
        <div className="rounded-3xl p-6 md:p-8 text-white" style={{ background: 'linear-gradient(135deg, #0a6867 0%, #0f9b98 100%)' }}>
          <h2 className="font-800 text-xl mb-2">Punya Kos? Daftarkan Sekarang!</h2>
          <p className="text-white/80 text-[14px] mb-5 leading-relaxed">
            Jangkau lebih banyak calon penyewa. Gratis, cepat, dan mudah.
          </p>
          <Link href="/daftar?role=owner" className="btn bg-white text-[var(--color-primary-500)] hover:bg-gray-50 font-700 text-[14px] px-5 py-2.5 rounded-xl inline-flex items-center gap-2">
            Daftar sebagai Pemilik →
          </Link>
        </div>
      </section>
    </div>
  );
}
