'use client';

import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { MapPin, Upload, X, Images } from 'lucide-react';
import api from '@/lib/api';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { JAMBI_AREAS, Facility } from '@/types';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';

const PropertyMap = dynamic(() => import('@/components/PropertyMap'), { ssr: false });

export default function TambahPropertiPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '', description: '', type: 'putra', price_monthly: '', price_yearly: '',
    address: '', area: '', whatsapp_number: '',
    latitude: '', longitude: '',
  });
  const [facilities, setFacilities] = useState<number[]>([]);
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [previewImg, setPreviewImg] = useState('');
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mapCoords, setMapCoords] = useState<[number, number]>([-1.6101, 103.6131]);

  const { data: allFacilities } = useQuery<Facility[]>({
    queryKey: ['facilities'],
    queryFn: () => api.get('/facilities').then(r => r.data).catch(() => []),
  });

  const mutation = useMutation({
    mutationFn: () => {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      facilities.forEach(f => fd.append('facilities[]', String(f)));
      if (mainImage) fd.append('main_image', mainImage);
      galleryFiles.forEach(f => fd.append('gallery[]', f));
      return api.post('/owner/properties', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    },
    onSuccess: () => router.push('/owner'),
    onError: (err: unknown) => {
      const apiError = err as { response?: { data?: { errors?: Record<string, string[]> } } };
      const raw = apiError?.response?.data?.errors ?? {};
      const flat: Record<string, string> = {};
      Object.entries(raw).forEach(([k, v]) => { flat[k] = v[0]; });
      setErrors(flat);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  });

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setMainImage(f);
    setPreviewImg(URL.createObjectURL(f));
  };

  const handleLocationPick = (lat: number, lng: number) => {
    setForm(f => ({ ...f, latitude: String(lat), longitude: String(lng) }));
  };

  const handleGalleryPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 8);
    setGalleryFiles(prev => {
      const combined = [...prev, ...files].slice(0, 8);
      setGalleryPreviews(combined.map(f => URL.createObjectURL(f)));
      return combined;
    });
  };

  const removeGalleryImage = (idx: number) => {
    setGalleryFiles(prev => { const n = prev.filter((_, i) => i !== idx); setGalleryPreviews(n.map(f => URL.createObjectURL(f))); return n; });
  };

  const toggleFacility = (id: number) =>
    setFacilities(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);

  const COMMON_FACILITIES = [
    'AC', 'WiFi', 'Kamar Mandi Dalam', 'Parkir Motor', 'Parkir Mobil',
    'Dapur', 'Lemari', 'Kasur', 'TV', 'Laundry'
  ];

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-[22px] font-800 text-[var(--color-text-primary)] mb-1">Tambah Properti Baru</h1>
      <p className="text-[14px] text-[var(--color-text-secondary)] mb-6">Isi informasi kos kamu dengan lengkap dan jelas.</p>

      <form
        onSubmit={e => { e.preventDefault(); setErrors({}); mutation.mutate(); }}
        className="space-y-6"
        noValidate
      >
        {/* Main image */}
        <div>
          <p className="text-[13px] font-700 text-[var(--color-text-secondary)] mb-2 uppercase tracking-wide">Foto Utama</p>
          <label htmlFor="main-image" className={cn(
            'block border-2 border-dashed rounded-2xl overflow-hidden cursor-pointer transition-all',
            previewImg ? 'border-[var(--color-primary-500)]' : 'border-[var(--color-border)] hover:border-[var(--color-primary-300)]'
          )}>
            {previewImg ? (
              <img src={previewImg} alt="Preview" className="w-full h-48 object-cover" />
            ) : (
              <div className="p-8 text-center">
                <Upload size={28} className="mx-auto text-[var(--color-text-muted)] mb-2" />
                <p className="text-[14px] font-600 text-[var(--color-text-secondary)]">Ketuk untuk pilih foto utama</p>
                <p className="text-[12px] text-[var(--color-text-muted)] mt-1">JPG, PNG – maks 2MB</p>
              </div>
            )}
            <input id="main-image" type="file" accept="image/*" className="hidden" onChange={handleImagePick} />
          </label>
          {errors.main_image && <p className="text-red-500 text-[12px] mt-1">{errors.main_image}</p>}
        </div>

        {/* Gallery Images */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Images size={15} className="text-[var(--color-text-muted)]" />
            <p className="text-[13px] font-700 text-[var(--color-text-secondary)] uppercase tracking-wide">Foto Galeri (Maks. 8)</p>
          </div>
          {galleryPreviews.length > 0 && (
            <div className="grid grid-cols-4 gap-2 mb-3">
              {galleryPreviews.map((src, idx) => (
                <div key={idx} className="relative rounded-xl overflow-hidden aspect-square bg-gray-100">
                  <img src={src} alt={`Galeri ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(idx)}
                    className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5 text-white hover:bg-red-500 transition-colors"
                    aria-label="Hapus foto"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              {galleryPreviews.length < 8 && (
                <label className="aspect-square rounded-xl border-2 border-dashed border-[var(--color-border)] flex items-center justify-center cursor-pointer hover:border-[var(--color-primary-300)] transition-colors">
                  <Upload size={18} className="text-[var(--color-text-muted)]" />
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryPick} />
                </label>
              )}
            </div>
          )}
          {galleryPreviews.length === 0 && (
            <label className="flex items-center gap-3 border border-dashed border-[var(--color-border)] rounded-2xl p-4 cursor-pointer hover:border-[var(--color-primary-300)] transition-colors">
              <Upload size={20} className="text-[var(--color-text-muted)]" />
              <div>
                <p className="text-[13px] font-600 text-[var(--color-text-secondary)]">Ketuk untuk pilih foto galeri</p>
                <p className="text-[11px] text-[var(--color-text-muted)]">Hingga 8 foto – JPG/PNG, maks 2MB tiap foto</p>
              </div>
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryPick} />
            </label>
          )}
        </div>

        {/* Basic info */}
        <div className="space-y-4">
          <Input id="prop-title" label="Nama / Judul Kos" value={form.title} error={errors.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />

          <div>
            <p className="text-[11px] font-700 text-[var(--color-text-muted)] uppercase tracking-wide mb-2">Tipe Kos</p>
            <div className="grid grid-cols-3 gap-2">
              {[['putra', '👨 Putra'], ['putri', '👩 Putri'], ['campur', '🤝 Campur']].map(([v, label]) => (
                <button key={v} type="button" onClick={() => setForm(f => ({ ...f, type: v }))}
                  className={cn('py-2.5 rounded-xl text-[13px] font-600 border-2 transition-all',
                    form.type === v ? 'border-[var(--color-primary-500)] bg-[var(--color-primary-50)] text-[var(--color-primary-600)]' : 'border-[var(--color-border)] text-[var(--color-text-secondary)]')}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-2 gap-4">
          <Input id="price-monthly" label="Harga/Bulan (Rp)" type="number" value={form.price_monthly} error={errors.price_monthly}
            onChange={e => setForm(f => ({ ...f, price_monthly: e.target.value }))} required />
          <Input id="price-yearly" label="Harga/Tahun (Rp)" type="number" value={form.price_yearly}
            onChange={e => setForm(f => ({ ...f, price_yearly: e.target.value }))} />
        </div>

        {/* Location */}
        <div className="space-y-4">
          <div>
            <p className="text-[11px] font-700 text-[var(--color-text-muted)] uppercase tracking-wide mb-2">Kawasan</p>
            <select id="prop-area" value={form.area}
              onChange={e => setForm(f => ({ ...f, area: e.target.value }))}
              className="select-field" required>
              <option value="">Pilih kawasan...</option>
              {JAMBI_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            {errors.area && <p className="text-red-500 text-[12px] mt-1">{errors.area}</p>}
          </div>
          <Input id="prop-address" label="Alamat Lengkap" value={form.address} error={errors.address}
            onChange={e => setForm(f => ({ ...f, address: e.target.value }))} required />
          <Input id="prop-wa" label="No. WhatsApp Pemilik (contoh: 081234567890)" value={form.whatsapp_number}
            error={errors.whatsapp_number}
            onChange={e => setForm(f => ({ ...f, whatsapp_number: e.target.value }))} type="tel" required />
        </div>

        {/* Location picker map */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={16} className="text-[var(--color-primary-500)]" />
            <p className="font-700 text-[14px] text-[var(--color-text-primary)]">Titik Lokasi di Peta</p>
          </div>
          <p className="text-[12px] text-[var(--color-text-muted)] mb-3">
            Seret (drag) atau ketuk lokasi atap/depan kos kamu pada peta di bawah.
          </p>
          <PropertyMap
            locationPicker
            center={mapCoords}
            zoom={14}
            onLocationPick={handleLocationPick}
            className="h-60"
          />
          {form.latitude && (
            <p className="text-[12px] text-[var(--color-primary-500)] mt-2 font-500">
              ✓ Koordinat: {parseFloat(form.latitude).toFixed(5)}, {parseFloat(form.longitude).toFixed(5)}
            </p>
          )}
        </div>

        {/* Facilities */}
        <div>
          <p className="text-[11px] font-700 text-[var(--color-text-muted)] uppercase tracking-wide mb-3">Fasilitas</p>
          <div className="grid grid-cols-2 gap-2">
            {COMMON_FACILITIES.map((name, i) => {
              const matchedFacility = allFacilities?.find(f => f.name === name);
              const id = matchedFacility?.id ?? -(i + 1);
              const active = facilities.includes(id);
              return (
                <button key={name} type="button" onClick={() => matchedFacility && toggleFacility(matchedFacility.id)}
                  disabled={!matchedFacility}
                  className={cn(
                    'flex items-center gap-2 p-2.5 rounded-xl border-2 text-[13px] font-600 transition-all text-left',
                    active
                      ? 'border-[var(--color-primary-500)] bg-[var(--color-primary-50)] text-[var(--color-primary-600)]'
                      : 'border-[var(--color-border)] text-[var(--color-text-secondary)]',
                    !matchedFacility && 'opacity-40 cursor-not-allowed'
                  )}>
                  <span className={cn('w-4 h-4 rounded flex-shrink-0 border-2 flex items-center justify-center',
                    active ? 'bg-[var(--color-primary-500)] border-[var(--color-primary-500)]' : 'border-[var(--color-border)]')}>
                    {active && <span className="text-white text-[10px]">✓</span>}
                  </span>
                  {name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Description */}
        <div>
          <p className="text-[11px] font-700 text-[var(--color-text-muted)] uppercase tracking-wide mb-2">Deskripsi</p>
          <textarea
            id="prop-desc"
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            rows={5}
            placeholder="Ceritakan detail kos kamu: kondisi kamar, lingkungan, aturan, dll..."
            className="input-field pt-3 h-auto resize-y text-[14px]"
            required
            aria-label="Deskripsi properti"
          />
          {errors.description && <p className="text-red-500 text-[12px] mt-1">{errors.description}</p>}
        </div>

        {mutation.isError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3">
            <p className="text-red-600 text-[13px]">Terjadi kesalahan. Periksa kembali data yang diisi.</p>
          </div>
        )}

        <div className="flex gap-3 pb-8">
          <Button variant="outline" className="flex-1" type="button" onClick={() => router.back()}>
            Batal
          </Button>
          <Button id="btn-submit-property" type="submit" loading={mutation.isPending} className="flex-2">
            Simpan & Ajukan Verifikasi
          </Button>
        </div>
      </form>
    </div>
  );
}
