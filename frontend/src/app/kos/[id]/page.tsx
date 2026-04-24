'use client';

import { useState, use } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  MapPin, MessageCircle, ChevronLeft, Eye, CheckCircle,
  Wifi, AirVent, ShowerHead, Car, Bike, ChefHat, Bed, Tv,
  Zap, Droplets, Camera, Shield, X
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { Property, FACILITY_ICONS } from '@/types';
import { formatPrice, formatType, toWhatsAppUrl, buildWhatsAppMessage, cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import BookmarkButton from '@/components/BookmarkButton';
import ReviewSection from '@/components/ReviewSection';

const PropertyMap = dynamic(() => import('@/components/PropertyMap'), { ssr: false });

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';

function getImageUrl(path?: string) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${BACKEND_URL}/storage/${path}`;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Wifi, AirVent, ShowerHead, Car, Bike, ChefHat, Bed, Tv, Zap, Droplets, Camera, Shield,
};

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  const [reportOpen, setReportOpen] = useState(false);
  const [reportForm, setReportForm] = useState({ reason: '', details: '' });

  const { data: property, isLoading } = useQuery<Property>({
    queryKey: ['property', id],
    queryFn: () => api.get(`/properties/${id}`).then(r => r.data),
  });

  const clickMutation = useMutation({
    mutationFn: () => api.post(`/properties/${id}/click`),
  });

  const reportMutation = useMutation({
    mutationFn: (data: typeof reportForm) => api.post(`/properties/${id}/report`, data),
    onSuccess: () => {
      alert('Laporan berhasil dikirim. Terima kasih atas bantuan Anda menjaga kualitas Manokos.');
      setReportOpen(false);
      setReportForm({ reason: '', details: '' });
    },
    onError: () => alert('Gagal mengirim laporan. Coba lagi nanti.')
  });

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 pb-32 animate-fade-up">
        <div className="skeleton h-72 rounded-3xl mb-4 mt-4" />
        <div className="skeleton h-6 w-3/4 mb-2" />
        <div className="skeleton h-4 w-1/2 mb-4" />
        <div className="skeleton h-24 rounded-2xl" />
      </div>
    );
  }

  if (!property) return null;

  const mainImage = getImageUrl(property.main_image);
  const gallery = property.gallery?.map(g => getImageUrl(g)!).filter(Boolean) ?? [];
  const allImages = [mainImage, ...gallery].filter(Boolean) as string[];

  const waUrl = toWhatsAppUrl(property.whatsapp_number, buildWhatsAppMessage(property.title));
  const typeColor = property.type === 'putra' ? 'badge-putra' : property.type === 'putri' ? 'badge-putri' : 'badge-campur';

  const handleWhatsApp = () => {
    clickMutation.mutate();
    window.open(waUrl, '_blank');
  };

  return (
    <div className="bg-[var(--color-bg)] pb-28 md:pb-8">
      {/* Mobile back + bookmark bar */}
      <div className="md:hidden flex items-center px-4 py-3 sticky top-0 z-20 bg-[var(--color-bg)]">
        <Link href="/cari" className="btn btn-ghost p-2 -ml-2" aria-label="Kembali">
          <ChevronLeft size={22} />
        </Link>
        <span className="ml-2 font-700 text-[16px] text-[var(--color-text-primary)] line-clamp-1 flex-1">{property.title}</span>
        <BookmarkButton propertyId={property.id} className="p-2 min-h-[40px] min-w-[40px]" />
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-6">
        {/* ===== GALLERY ===== */}
        <div className="mt-2 md:mt-6">
          {/* Mobile: full-width carousel */}
          <div className="md:hidden relative rounded-3xl overflow-hidden h-64">
            {allImages.length > 0 ? (
              <>
                <img src={allImages[activeImg]} alt={property.title} className="w-full h-full object-cover" />
                {allImages.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {allImages.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImg(i)}
                        className={cn('w-1.5 h-1.5 rounded-full transition-all', i === activeImg ? 'bg-white w-4' : 'bg-white/60')}
                        aria-label={`Foto ${i + 1}`}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <span className="text-4xl">🏠</span>
              </div>
            )}
          </div>

          {/* Desktop: Airbnb grid */}
          <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-2 h-72 rounded-3xl overflow-hidden">
            {allImages.slice(0, 5).map((img, i) => (
              <div
                key={i}
                className={cn('overflow-hidden cursor-pointer relative', i === 0 ? 'col-span-2 row-span-2' : '')}
                onClick={() => { setActiveImg(i); setGalleryOpen(true); }}
              >
                <img src={img} alt={`${property.title} foto ${i+1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                {i === 4 && allImages.length > 5 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-700 text-lg">+{allImages.length - 5}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ===== MAIN CONTENT ===== */}
        <div className="flex flex-col md:flex-row gap-6 mt-6">
          {/* Left: main info */}
          <div className="flex-1">
            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span className={cn('badge', typeColor)}>Kos {formatType(property.type)}</span>
              {property.is_boosted && <span className="badge badge-boosted">⭐ Unggulan</span>}
              {property.is_verified
                ? <span className="badge badge-verified"><CheckCircle size={11} /> Terverifikasi</span>
                : <span className="badge badge-pending">Menunggu Verifikasi</span>
              }
              <span className="badge" style={{ background: '#f3f4f6', color: '#374151' }}>
                <MapPin size={11} /> {property.area}
              </span>
            </div>

            <h1 className="text-[22px] md:text-[26px] font-800 text-[var(--color-text-primary)] leading-tight mb-2">
              {property.title}
            </h1>

            <p className="text-[13px] text-[var(--color-text-muted)] mb-4 flex items-center gap-1">
              <MapPin size={13} /> {property.address}
            </p>

            {/* Price */}
            <div className="bg-[var(--color-primary-50)] rounded-2xl p-4 mb-5 border border-[var(--color-primary-100)]">
              <p className="text-[12px] font-600 text-[var(--color-primary-700)] uppercase tracking-wide mb-1">Harga Sewa</p>
              <div className="flex items-baseline gap-3 flex-wrap">
                <p className="text-[28px] font-800 text-[var(--color-primary-600)]">
                  {formatPrice(property.price_monthly)}
                  <span className="text-[15px] font-500 text-[var(--color-primary-400)]">/bulan</span>
                </p>
                {property.price_yearly && (
                  <p className="text-[16px] font-600 text-[var(--color-primary-400)]">
                    · {formatPrice(property.price_yearly)}/tahun
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="font-700 text-[16px] text-[var(--color-text-primary)] mb-2">Deskripsi</h2>
              <p className="text-[14px] text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-wrap">
                {property.description}
              </p>
            </div>

            {/* Facilities */}
            {property.facilities?.length > 0 && (
              <div className="mb-6">
                <h2 className="font-700 text-[16px] text-[var(--color-text-primary)] mb-3">Fasilitas</h2>
                <div className="grid grid-cols-2 gap-2">
                  {property.facilities.map(f => {
                    const iconName = FACILITY_ICONS[f.name];
                    const Icon = iconName ? ICON_MAP[iconName] : null;
                    return (
                      <div key={f.id} className="flex items-center gap-2 bg-white rounded-xl p-3 border border-[var(--color-border)]">
                        {Icon ? <Icon size={18} className="text-[var(--color-primary-500)]" /> : <span className="text-lg">✓</span>}
                        <span className="text-[13px] font-600 text-[var(--color-text-primary)]">{f.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Reviews */}
            <ReviewSection propertyId={id} />

            {/* Map */}
            {property.latitude && property.longitude && (
              <div className="mb-6">
                <h2 className="font-700 text-[16px] text-[var(--color-text-primary)] mb-3">
                  Lokasi Perkiraan
                  <span className="text-[12px] font-400 text-[var(--color-text-muted)] ml-2">🔒 Titik pasti akan diberikan saat konfirmasi</span>
                </h2>
                <PropertyMap property={property} zoom={15} className="h-52 md:h-72" />
              </div>
            )}
          </div>

          {/* Right: Desktop contact card */}
          <div className="md:w-80 flex-shrink-0">
            <div className="card p-5 sticky top-20">
              <p className="text-[13px] text-[var(--color-text-muted)] mb-1">Ditawarkan oleh</p>
              <p className="font-700 text-[16px] text-[var(--color-text-primary)] mb-4">{property.owner?.name}</p>

              <div className="space-y-2">
                <button
                  id="btn-whatsapp-desktop"
                  onClick={handleWhatsApp}
                  className="btn btn-whatsapp w-full text-[15px] gap-2"
                >
                  <MessageCircle size={20} />
                  Hubungi via WhatsApp
                </button>
                <BookmarkButton propertyId={property.id} className="w-full justify-center gap-2 text-[14px]" />
                <p className="text-[11px] text-center text-[var(--color-text-muted)]">
                  Template pesan otomatis akan dikirim
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-[var(--color-border)] flex gap-3">
                <div className="flex-1 text-center">
                  <p className="text-[22px] font-800 text-[var(--color-text-primary)]">–</p>
                  <p className="text-[11px] text-[var(--color-text-muted)] font-500">Dilihat</p>
                </div>
                <div className="w-px bg-[var(--color-border)]" />
                <div className="flex-1 text-center">
                  <p className="text-[22px] font-800 text-[var(--color-text-primary)]">–</p>
                  <p className="text-[11px] text-[var(--color-text-muted)] font-500">Chat WA</p>
                </div>
              </div>

              <div className="mt-5 text-center">
                <button onClick={() => setReportOpen(true)} className="text-[12px] font-600 text-red-500 hover:text-red-700 transition items-center justify-center gap-1.5 mx-auto flex">
                  <Shield size={14} /> Laporkan Properti
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== STICKY BOTTOM CTA (Mobile) ===== */}
      <div className="sticky-cta md:hidden">
        <button
          id="btn-whatsapp-mobile"
          onClick={handleWhatsApp}
          className="btn btn-whatsapp w-full py-4 text-[16px] gap-2 rounded-2xl"
        >
          <MessageCircle size={22} />
          Hubungi Pemilik via WhatsApp
        </button>
      </div>

      {/* ===== GALLERY LIGHTBOX ===== */}
      {galleryOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setGalleryOpen(false)}>
          <button
            className="absolute top-4 right-4 text-white btn btn-ghost p-2"
            onClick={() => setGalleryOpen(false)}
            aria-label="Tutup galeri"
          >
            <X size={24} />
          </button>
          <img
            src={allImages[activeImg]}
            alt="Galeri"
            className="max-w-full max-h-full object-contain rounded-2xl"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}

      {/* ===== REPORT MODAL ===== */}
      {reportOpen && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm animate-fade-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-800 text-[18px]">Laporkan Properti</h3>
              <button onClick={() => setReportOpen(false)} className="btn btn-ghost p-1 -mr-2"><X size={20} className="text-[var(--color-text-secondary)]"/></button>
            </div>
            <p className="text-[13px] text-[var(--color-text-muted)] mb-4">Laporan Anda bersifat rahasia. Admin Manokos akan turun tangan.</p>
            
            <div className="mb-4">
              <label className="block text-[12px] font-700 text-[var(--color-text-primary)] mb-1.5">Alasan Laporan</label>
              <select 
                className="input text-[13px] h-10 w-full" 
                value={reportForm.reason} 
                onChange={e => setReportForm(f => ({ ...f, reason: e.target.value }))}
              >
                <option value="">Pilih alasan...</option>
                <option value="Harga Tidak Sesuai">Harga aslinya berbeda</option>
                <option value="Foto Palsu/Menipu">Foto tidak sesuai dengan aslinya</option>
                <option value="Properti Sudah Penuh">Kamar sebenarnya sudah habis</option>
                <option value="Kontak Penipu">Curiga penipuan / minta DP aneh</option>
                <option value="Lainnya">Masalah lainnya</option>
              </select>
            </div>
            
            <div className="mb-5">
              <label className="block text-[12px] font-700 text-[var(--color-text-primary)] mb-1.5">Keterangan (Opsional)</label>
              <textarea 
                className="input h-24 resize-none w-full text-[13px]" 
                placeholder="Tuliskan pengalaman atau detail tambahan Anda..."
                value={reportForm.details}
                onChange={e => setReportForm(f => ({ ...f, details: e.target.value }))}
              />
            </div>
            
            <button 
              className="btn btn-primary w-full"
              disabled={!reportForm.reason || reportMutation.isPending}
              onClick={() => reportMutation.mutate(reportForm)}
            >
              {reportMutation.isPending ? 'Mengirim Data...' : 'Kirim Laporan'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
