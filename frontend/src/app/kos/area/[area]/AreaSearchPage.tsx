'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { MapPin, ArrowRight, SlidersHorizontal, X } from 'lucide-react';
import api from '@/lib/api';
import PropertyCard from '@/components/PropertyCard';
import { PaginatedProperties, Facility } from '@/types';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';

const PropertyMap = dynamic(() => import('@/components/PropertyMap'), { ssr: false });

export default function AreaSearchPage({ areaName }: { areaName: string }) {
  const [view, setView] = useState<'list' | 'map'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    min_price: '',
    max_price: '',
    facilities: [] as number[],
    page: 1,
  });

  const { data: allFacilities } = useQuery<Facility[]>({
    queryKey: ['facilities'],
    queryFn: () => api.get('/facilities').then(r => r.data).catch(() => []),
  });

  const queryString = new URLSearchParams({
    area: areaName,
    ...(filters.type && { type: filters.type }),
    ...(filters.min_price && { min_price: filters.min_price }),
    ...(filters.max_price && { max_price: filters.max_price }),
    ...(filters.facilities.length > 0 && { facilities: filters.facilities.join(',') }),
    page: String(filters.page),
    per_page: '12',
  }).toString();

  const { data, isLoading } = useQuery<PaginatedProperties>({
    queryKey: ['properties', 'area', areaName, filters],
    queryFn: () => api.get(`/properties?${queryString}`).then(r => r.data),
  });

  const toggleFacility = (id: number) =>
    setFilters(f => ({
      ...f,
      facilities: f.facilities.includes(id)
        ? f.facilities.filter(x => x !== id)
        : [...f.facilities, id],
      page: 1,
    }));

  const resetFilters = () =>
    setFilters({ type: '', min_price: '', max_price: '', facilities: [], page: 1 });

  const activeFilterCount = [filters.type, filters.min_price, filters.max_price]
    .filter(Boolean).length + filters.facilities.length;

  return (
    <div className="pb-nav">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[var(--color-primary-600)] to-[var(--color-primary-400)] text-white px-4 pt-10 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-[12px] text-white/70 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
            <span>/</span>
            <Link href="/cari" className="hover:text-white transition-colors">Cari Kos</Link>
            <span>/</span>
            <span className="text-white font-600">{areaName}</span>
          </nav>

          <div className="flex items-center gap-2 mb-2">
            <MapPin size={20} className="text-white/80" />
            <h1 className="text-[26px] md:text-[32px] font-800 leading-tight">
              Kos di {areaName}
            </h1>
          </div>
          <p className="text-[14px] text-white/80 max-w-xl">
            {data?.total
              ? `${data.total} listing kos tersedia di kawasan ${areaName}, Jambi.`
              : `Temukan kos putra, putri & campur di kawasan ${areaName}, Jambi.`}
            {' '}Kontak pemilik langsung via WhatsApp.
          </p>

          {/* Quick type filter pills */}
          <div className="flex gap-2 mt-5 flex-wrap">
            {[['', 'Semua'], ['putra', '👨 Putra'], ['putri', '👩 Putri'], ['campur', '🤝 Campur']].map(([v, label]) => (
              <button
                key={v}
                onClick={() => setFilters(f => ({ ...f, type: v, page: 1 }))}
                className={cn(
                  'px-4 py-1.5 rounded-full text-[13px] font-600 border transition-colors',
                  filters.type === v
                    ? 'bg-white text-[var(--color-primary-600)] border-white'
                    : 'bg-white/10 text-white border-white/30 hover:bg-white/20'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="sticky top-[57px] z-10 bg-[var(--color-bg)] border-b border-[var(--color-border)] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-2">
          <button
            onClick={() => setShowFilters(p => !p)}
            className={cn(
              'btn rounded-xl px-3 py-2 text-[13px] gap-1.5 flex items-center',
              showFilters ? 'bg-[var(--color-primary-500)] text-white' : 'btn-ghost'
            )}
          >
            <SlidersHorizontal size={14} />
            Filter
            {activeFilterCount > 0 && (
              <span className="ml-1 bg-white text-[var(--color-primary-600)] rounded-full w-4 h-4 text-[10px] font-800 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          <div className="flex-1" />

          <button
            onClick={() => setView('list')}
            className={cn('btn p-2 rounded-xl', view === 'list' ? 'bg-[var(--color-primary-50)] text-[var(--color-primary-600)]' : 'btn-ghost')}
            aria-label="Tampilan daftar"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
          </button>
          <button
            onClick={() => setView('map')}
            className={cn('btn p-2 rounded-xl', view === 'map' ? 'bg-[var(--color-primary-50)] text-[var(--color-primary-600)]' : 'btn-ghost')}
            aria-label="Tampilan peta"
          >
            <MapPin size={16} />
          </button>
        </div>

        {/* Filter dropdown */}
        {showFilters && (
          <div className="max-w-7xl mx-auto px-4 pb-4">
            <div className="bg-white rounded-2xl border border-[var(--color-border)] p-4 shadow-card animate-fade-up">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="text-[11px] font-700 text-[var(--color-text-muted)] uppercase tracking-wide mb-1.5 block">Harga Min</label>
                  <input type="number" placeholder="Rp" className="input h-10 text-[13px] w-full"
                    value={filters.min_price}
                    onChange={e => setFilters(f => ({ ...f, min_price: e.target.value, page: 1 }))} />
                </div>
                <div>
                  <label className="text-[11px] font-700 text-[var(--color-text-muted)] uppercase tracking-wide mb-1.5 block">Harga Maks</label>
                  <input type="number" placeholder="Rp" className="input h-10 text-[13px] w-full"
                    value={filters.max_price}
                    onChange={e => setFilters(f => ({ ...f, max_price: e.target.value, page: 1 }))} />
                </div>
                <div className="col-span-2 flex items-end">
                  {activeFilterCount > 0 && (
                    <button onClick={resetFilters} className="btn btn-ghost h-10 w-full text-[13px] text-red-500 gap-1.5">
                      <X size={14} /> Reset Filter
                    </button>
                  )}
                </div>
              </div>

              {allFacilities && allFacilities.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
                  <p className="text-[11px] font-700 text-[var(--color-text-muted)] uppercase tracking-wide mb-3">Fasilitas</p>
                  <div className="flex flex-wrap gap-2">
                    {allFacilities.map(f => {
                      const active = filters.facilities.includes(f.id);
                      return (
                        <button key={f.id} onClick={() => toggleFacility(f.id)}
                          className={cn(
                            'px-3 py-1.5 rounded-full border text-[12px] font-500 transition-colors',
                            active
                              ? 'bg-[var(--color-primary-500)] border-[var(--color-primary-500)] text-white'
                              : 'bg-white border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary-300)]'
                          )}
                        >
                          {f.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-5">
        {view === 'map' ? (
          <div className="h-[65vh] rounded-2xl overflow-hidden">
            <PropertyMap properties={data?.data ?? []} />
          </div>
        ) : (
          <>
            {/* Results count */}
            {!isLoading && data && (
              <p className="text-[13px] text-[var(--color-text-muted)] mb-4">
                Menampilkan <span className="font-700 text-[var(--color-text-primary)]">{data.data.length}</span> dari{' '}
                <span className="font-700">{data.total}</span> kos di <span className="font-600">{areaName}</span>
              </p>
            )}

            {/* Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-64 rounded-2xl" />)}
              </div>
            ) : data?.data.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-4xl mb-3">🏠</p>
                <p className="font-700 text-[var(--color-text-secondary)] mb-2">Belum ada kos di {areaName}</p>
                <p className="text-[13px] text-[var(--color-text-muted)] mb-4">Coba cari di area lain?</p>
                <Link href="/cari" className="btn btn-primary px-5">Lihat Semua Area</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data?.data.map(p => <PropertyCard key={p.id} property={p} variant="grid" />)}
              </div>
            )}

            {/* Pagination */}
            {data && data.last_page > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button disabled={filters.page === 1}
                  onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}
                  className="btn btn-ghost px-4 disabled:opacity-40">← Sebelumnya</button>
                <span className="text-[13px] text-[var(--color-text-muted)] flex items-center px-2">
                  Halaman {filters.page} / {data.last_page}
                </span>
                <button disabled={filters.page === data.last_page}
                  onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}
                  className="btn btn-ghost px-4 disabled:opacity-40">Selanjutnya →</button>
              </div>
            )}
          </>
        )}

        {/* SEO: Link ke area lain */}
        <div className="mt-12 pt-8 border-t border-[var(--color-border)]">
          <p className="text-[13px] font-700 text-[var(--color-text-muted)] uppercase tracking-wide mb-4">
            Cari Kos di Area Lain
          </p>
          <div className="flex flex-wrap gap-2">
            {['Mendalo', 'Telanaipura', 'Sipin', 'Kota Baru', 'Alam Barajo', 'Jambi Selatan', 'Paal Merah', 'Thehok', 'Layang', 'Jambi Timur']
              .filter(a => a !== areaName)
              .map(a => (
                <Link
                  key={a}
                  href={`/kos/area/${a.toLowerCase().replace(/\s+/g, '-')}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] text-[13px] text-[var(--color-text-secondary)] hover:border-[var(--color-primary-400)] hover:text-[var(--color-primary-600)] transition-colors"
                >
                  <MapPin size={12} /> {a} <ArrowRight size={11} />
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
