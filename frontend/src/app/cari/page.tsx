'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { SlidersHorizontal, Map, List, X, Search } from 'lucide-react';
import api from '@/lib/api';
import PropertyCard from '@/components/PropertyCard';
import { PaginatedProperties, JAMBI_AREAS } from '@/types';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';

const PropertyMap = dynamic(() => import('@/components/PropertyMap'), { ssr: false });

function SearchPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [view, setView] = useState<'list' | 'map'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    area: searchParams.get('area') || '',
    type: '',
    min_price: '',
    max_price: '',
    page: 1,
  });

  const queryString = new URLSearchParams({
    ...(filters.area && { area: filters.area }),
    ...(filters.type && { type: filters.type }),
    ...(filters.min_price && { min_price: filters.min_price }),
    ...(filters.max_price && { max_price: filters.max_price }),
    page: String(filters.page),
    per_page: '12',
  }).toString();

  const { data, isLoading } = useQuery<PaginatedProperties>({
    queryKey: ['properties', queryString],
    queryFn: () => api.get(`/properties?${queryString}`).then(r => r.data),
  });

  const resetFilters = () =>
    setFilters({ area: '', type: '', min_price: '', max_price: '', page: 1 });

  const activeFilterCount = [filters.area, filters.type, filters.min_price, filters.max_price]
    .filter(Boolean).length;

  return (
    <div className="pb-nav">
      {/* Search Header */}
      <div className="sticky top-0 z-30 bg-[var(--color-bg)] border-b border-[var(--color-border)] px-4 py-3">
        <div className="max-w-7xl mx-auto flex gap-2">
          {/* Search input area */}
          <div className="flex-1 flex items-center gap-2 bg-white rounded-2xl border-2 border-[var(--color-border)] px-3 py-2 focus-within:border-[var(--color-primary-500)] transition-colors">
            <Search size={16} className="text-[var(--color-text-muted)] flex-shrink-0" />
            <select
              id="search-area-select"
              value={filters.area}
              onChange={e => setFilters(f => ({ ...f, area: e.target.value, page: 1 }))}
              className="flex-1 bg-transparent text-[14px] text-[var(--color-text-primary)] outline-none"
            >
              <option value="">Semua Area Jambi</option>
              {JAMBI_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          {/* Filter button */}
          <button
            id="btn-filter"
            onClick={() => setShowFilters(v => !v)}
            className={cn(
              'btn rounded-2xl px-3 min-h-[44px] border-2 gap-1.5 text-[13px]',
              activeFilterCount > 0
                ? 'bg-[var(--color-primary-50)] border-[var(--color-primary-500)] text-[var(--color-primary-500)]'
                : 'bg-white border-[var(--color-border)] text-[var(--color-text-secondary)]'
            )}
            aria-label="Filter pencarian"
          >
            <SlidersHorizontal size={16} />
            <span className="hidden sm:inline">Filter</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[var(--color-primary-500)] text-white text-[11px] flex items-center justify-center font-700">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Filter Panel (Dropdown) */}
        {showFilters && (
          <div className="max-w-7xl mx-auto mt-3 bg-white rounded-2xl border border-[var(--color-border)] p-4 shadow-card animate-fade-up">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label htmlFor="filter-type" className="text-[11px] font-700 text-[var(--color-text-muted)] uppercase tracking-wide mb-1 block">Tipe Kos</label>
                <select id="filter-type" value={filters.type}
                  onChange={e => setFilters(f => ({ ...f, type: e.target.value, page: 1 }))}
                  className="select-field h-10 text-[13px]">
                  <option value="">Semua Tipe</option>
                  <option value="putra">Putra</option>
                  <option value="putri">Putri</option>
                  <option value="campur">Campur</option>
                </select>
              </div>
              <div>
                <label htmlFor="filter-min" className="text-[11px] font-700 text-[var(--color-text-muted)] uppercase tracking-wide mb-1 block">Harga Min</label>
                <input id="filter-min" type="number" placeholder="Rp 0" value={filters.min_price}
                  onChange={e => setFilters(f => ({ ...f, min_price: e.target.value, page: 1 }))}
                  className="input-field h-10 text-[13px] pt-2 pb-2" />
              </div>
              <div>
                <label htmlFor="filter-max" className="text-[11px] font-700 text-[var(--color-text-muted)] uppercase tracking-wide mb-1 block">Harga Max</label>
                <input id="filter-max" type="number" placeholder="Rp 5.000.000" value={filters.max_price}
                  onChange={e => setFilters(f => ({ ...f, max_price: e.target.value, page: 1 }))}
                  className="input-field h-10 text-[13px] pt-2 pb-2" />
              </div>
              <div className="flex items-end">
                {activeFilterCount > 0 && (
                  <button onClick={resetFilters} className="btn btn-ghost w-full h-10 text-[13px] text-red-500">
                    <X size={14} /> Reset Filter
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ===== DESKTOP SPLIT-SCREEN / MOBILE TOGGLE ===== */}
      <div className="max-w-7xl mx-auto">
        {/* Results count */}
        <div className="px-4 pt-4 pb-2">
          <p className="text-[13px] text-[var(--color-text-muted)]">
            {isLoading ? 'Mencari...' : `${data?.total ?? 0} kos ditemukan${filters.area ? ` di ${filters.area}` : ''}`}
          </p>
        </div>

        {/* === DESKTOP: Split screen === */}
        <div className="hidden md:flex gap-0 h-[calc(100vh-140px)]">
          {/* Left: List */}
          <div className="w-1/2 overflow-y-auto px-4 py-2">
            {isLoading ? (
              <div className="grid grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-64 rounded-2xl" />)}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {data?.data.map(p => <PropertyCard key={p.id} property={p} />)}
              </div>
            )}
          </div>

          {/* Right: Map */}
          <div className="w-1/2 sticky top-0 h-full p-4">
            <PropertyMap
              properties={data?.data ?? []}
              center={[-1.6101, 103.6131]}
              zoom={13}
              className="h-full"
            />
          </div>
        </div>

        {/* === MOBILE: Toggle between list and map === */}
        <div className="md:hidden">
          {view === 'list' ? (
            <div className="px-4 grid grid-cols-1 gap-4">
              {isLoading ? (
                [...Array(4)].map((_, i) => <div key={i} className="skeleton h-60 rounded-2xl" />)
              ) : (
                data?.data.map(p => <PropertyCard key={p.id} property={p} />)
              )}
            </div>
          ) : (
            <div className="px-4 py-2" style={{ height: 'calc(100vh - 180px)' }}>
              <PropertyMap
                properties={data?.data ?? []}
                center={[-1.6101, 103.6131]}
                zoom={13}
                className="h-full"
              />
            </div>
          )}

          {/* Floating Toggle Button */}
          <div className="fab">
            <button
              id="toggle-list-view"
              className={cn('fab-btn', view === 'list' && 'active')}
              onClick={() => setView('list')}
              aria-pressed={view === 'list'}
            >
              <List size={16} /> Daftar
            </button>
            <button
              id="toggle-map-view"
              className={cn('fab-btn', view === 'map' && 'active')}
              onClick={() => setView('map')}
              aria-pressed={view === 'map'}
            >
              <Map size={16} /> Peta
            </button>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {data && data.last_page > 1 && (
        <div className="flex justify-center gap-2 py-8">
          {[...Array(data.last_page)].map((_, i) => (
            <button
              key={i}
              id={`page-btn-${i + 1}`}
              onClick={() => setFilters(f => ({ ...f, page: i + 1 }))}
              className={cn(
                'w-9 h-9 rounded-xl font-600 text-[14px] transition-all',
                filters.page === i + 1
                  ? 'bg-[var(--color-primary-500)] text-white'
                  : 'bg-white border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary-500)]'
              )}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchPageInner />
    </Suspense>
  );
}
