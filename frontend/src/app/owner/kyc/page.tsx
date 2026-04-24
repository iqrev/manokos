'use client';

import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { CheckCircle, Clock, Upload, AlertCircle } from 'lucide-react';
import api from '@/lib/api';
import Button from '@/components/ui/Button';
import { KycRecord } from '@/types';
import { cn } from '@/lib/utils';

const STEPS = ['Data Diri', 'Upload KTP', 'Selesai'];

export default function OwnerKycPage() {
  const [step, setStep] = useState(0);
  const [ktpFile, setKtpFile] = useState<File | null>(null);
  const [docFile, setDocFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<{ ktp?: string; doc?: string }>({});

  const { data: kycStatus } = useQuery<KycRecord | null>({
    queryKey: ['kyc-status'],
    queryFn: () => api.get('/owner/kyc/status').then(r => r.data).catch(() => null),
  });

  const mutation = useMutation({
    mutationFn: () => {
      const fd = new FormData();
      if (ktpFile) fd.append('ktp_image', ktpFile);
      if (docFile) fd.append('document_proof', docFile);
      return api.post('/owner/kyc', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    },
    onSuccess: () => setStep(2),
  });

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>, type: 'ktp' | 'doc') => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    if (type === 'ktp') { setKtpFile(f); setPreview(p => ({ ...p, ktp: url })); }
    else { setDocFile(f); setPreview(p => ({ ...p, doc: url })); }
  };

  // Already submitted
  if (kycStatus) {
    const statusConfig = {
      pending: { color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', Icon: Clock, msg: 'Pengajuan KYC kamu sedang dalam proses review oleh admin. Mohon tunggu 1-2 hari kerja.' },
      verified: { color: 'text-green-600', bg: 'bg-green-50 border-green-200', Icon: CheckCircle, msg: 'KYC kamu telah disetujui! Kamu kini bisa menambahkan properti.' },
      rejected: { color: 'text-red-600', bg: 'bg-red-50 border-red-200', Icon: AlertCircle, msg: `KYC ditolak. Catatan admin: "${kycStatus.admin_notes || '-'}"` },
    }[kycStatus.status];

    const { Icon, color, bg, msg } = statusConfig;

    return (
      <div className="max-w-lg mx-auto px-5 py-12">
        <div className={cn('card border p-6', bg)}>
          <div className="flex gap-3 items-start">
            <Icon size={24} className={color} />
            <div>
              <p className={cn('font-700 text-[16px] mb-1', color)}>
                Status KYC: {kycStatus.status === 'pending' ? 'Sedang Ditinjau' : kycStatus.status === 'verified' ? 'Disetujui' : 'Ditolak'}
              </p>
              <p className="text-[13px] text-gray-600 leading-relaxed">{msg}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-5 py-8">
      <h1 className="text-[22px] font-800 text-[var(--color-text-primary)] mb-1">Verifikasi Identitas</h1>
      <p className="text-[14px] text-[var(--color-text-secondary)] mb-6">
        Diperlukan agar propertimu dapat ditampilkan kepada calon penyewa.
      </p>

      {/* Stepper */}
      <div className="flex items-center mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={cn('stepper-step', i < step ? 'done' : i === step ? 'active' : 'inactive')}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={cn('text-[11px] font-600 mt-1 whitespace-nowrap',
                i === step ? 'text-[var(--color-primary-500)]' : 'text-[var(--color-text-muted)]')}>
                {s}
              </span>
            </div>
            {i < STEPS.length - 1 && <div className={cn('stepper-line mx-2 mb-5', i < step ? 'done' : '')} />}
          </div>
        ))}
      </div>

      {/* Step 0: Info */}
      {step === 0 && (
        <div className="card p-6 animate-fade-up">
          <h2 className="font-700 text-[18px] mb-3 text-[var(--color-text-primary)]">📋 Data yang Dibutuhkan</h2>
          <ul className="space-y-2 mb-6">
            {[
              'Foto KTP (format JPG/PNG, maks 2MB)',
              'Bukti kepemilikan/pengelolaan properti (foto sertifikat, surat kuasa, atau tagihan listrik atas nama pemilik)'
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-[14px] text-[var(--color-text-secondary)]">
                <CheckCircle size={16} className="text-[var(--color-primary-500)] mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <Button id="btn-kyc-next-step1" className="w-full" onClick={() => setStep(1)}>
            Lanjut ke Upload →
          </Button>
        </div>
      )}

      {/* Step 1: Upload */}
      {step === 1 && (
        <div className="animate-fade-up space-y-5">
          {/* KTP Upload */}
          <div className="card p-5">
            <h2 className="font-700 text-[16px] mb-3">📷 Foto KTP</h2>
            <label
              htmlFor="upload-ktp"
              className={cn(
                'block border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all',
                preview.ktp
                  ? 'border-[var(--color-primary-500)] bg-[var(--color-primary-50)]'
                  : 'border-[var(--color-border)] hover:border-[var(--color-primary-300)]'
              )}
            >
              {preview.ktp ? (
                <img src={preview.ktp} alt="Preview KTP" className="max-h-40 mx-auto rounded-xl object-contain" />
              ) : (
                <div>
                  <Upload size={32} className="mx-auto text-[var(--color-text-muted)] mb-2" />
                  <p className="text-[14px] font-600 text-[var(--color-text-secondary)]">Ketuk untuk pilih foto KTP</p>
                  <p className="text-[12px] text-[var(--color-text-muted)] mt-1">JPG, PNG – maks 2MB</p>
                </div>
              )}
              <input id="upload-ktp" type="file" accept="image/*" className="hidden" onChange={e => handleFile(e, 'ktp')} />
            </label>
          </div>

          {/* Document Upload */}
          <div className="card p-5">
            <h2 className="font-700 text-[16px] mb-3">📄 Bukti Kepemilikan</h2>
            <label
              htmlFor="upload-doc"
              className={cn(
                'block border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all',
                preview.doc
                  ? 'border-[var(--color-primary-500)] bg-[var(--color-primary-50)]'
                  : 'border-[var(--color-border)] hover:border-[var(--color-primary-300)]'
              )}
            >
              {preview.doc ? (
                <div className="text-[var(--color-primary-500)] font-600 flex items-center justify-center gap-2">
                  <CheckCircle size={20} /> File terpilih: {docFile?.name}
                </div>
              ) : (
                <div>
                  <Upload size={32} className="mx-auto text-[var(--color-text-muted)] mb-2" />
                  <p className="text-[14px] font-600 text-[var(--color-text-secondary)]">Ketuk untuk pilih dokumen</p>
                  <p className="text-[12px] text-[var(--color-text-muted)] mt-1">PDF, JPG, PNG – maks 5MB</p>
                </div>
              )}
              <input id="upload-doc" type="file" accept="image/*,application/pdf" className="hidden" onChange={e => handleFile(e, 'doc')} />
            </label>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(0)} className="flex-1">← Kembali</Button>
            <Button
              id="btn-kyc-submit"
              onClick={() => mutation.mutate()}
              loading={mutation.isPending}
              disabled={!ktpFile || !docFile}
              className="flex-1"
            >
              Kirim Verifikasi
            </Button>
          </div>

          {mutation.isError && (
            <p className="text-red-500 text-[13px] text-center">Terjadi kesalahan. Coba lagi.</p>
          )}
        </div>
      )}

      {/* Step 2: Done */}
      {step === 2 && (
        <div className="card p-8 text-center animate-fade-up">
          <div className="w-16 h-16 rounded-full bg-[var(--color-primary-50)] flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-[var(--color-primary-500)]" />
          </div>
          <h2 className="font-800 text-[20px] text-[var(--color-text-primary)] mb-2">Berhasil Dikirim!</h2>
          <p className="text-[14px] text-[var(--color-text-secondary)] leading-relaxed mb-6">
            Tim Manokos akan mereview dokumenmu dalam 1-2 hari kerja. Kamu akan mendapat notifikasi setelah proses selesai.
          </p>
          <Button id="btn-kyc-go-dashboard" variant="outline" className="w-full" onClick={() => window.location.href = '/owner'}>
            Ke Dashboard Saya →
          </Button>
        </div>
      )}
    </div>
  );
}
