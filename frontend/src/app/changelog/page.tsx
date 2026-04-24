'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Rocket, Wrench, Zap, AlertTriangle } from 'lucide-react';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

interface UpdateLog {
  id: number;
  version: string;
  title: string;
  description: string;
  type: 'feature' | 'fix' | 'improvement' | 'breaking';
  release_date: string;
}

const TYPE_CONFIG = {
  feature:     { label: 'Fitur Baru',   Icon: Rocket,        color: 'bg-blue-100 text-blue-700',     dot: 'bg-blue-500' },
  fix:         { label: 'Perbaikan',    Icon: Wrench,        color: 'bg-green-100 text-green-700',   dot: 'bg-green-500' },
  improvement: { label: 'Peningkatan', Icon: Zap,           color: 'bg-purple-100 text-purple-700', dot: 'bg-purple-500' },
  breaking:    { label: 'Breaking',    Icon: AlertTriangle, color: 'bg-red-100 text-red-700',       dot: 'bg-red-500' },
};

export default function ChangelogPage() {
  const { data: logs = [], isLoading } = useQuery<UpdateLog[]>({
    queryKey: ['public-changelog'],
    queryFn: () => api.get('/changelog').then(r => r.data),
  });

  return (
    <div className="pb-nav bg-[var(--color-bg)]">
      {/* Header */}
      <div className="max-w-2xl mx-auto px-5 pt-8 pb-4">
        <div className="inline-flex items-center gap-1.5 bg-[var(--color-primary-50)] text-[var(--color-primary-600)] px-3 py-1.5 rounded-full text-[12px] font-600 mb-3 border border-[var(--color-primary-100)]">
          📋 Update Log
        </div>
        <h1 className="text-[28px] font-800 text-[var(--color-text-primary)] leading-tight mb-2">
          Catatan Pembaruan Manokos
        </h1>
        <p className="text-[14px] text-[var(--color-text-secondary)] leading-relaxed">
          Semua pembaruan, perbaikan, dan peningkatan fitur platform Manokos dicatat di sini secara transparan.
        </p>
      </div>

      {/* Timeline */}
      <div className="max-w-2xl mx-auto px-5 pb-12">
        {isLoading ? (
          <div className="space-y-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="skeleton w-3 h-3 rounded-full mt-1" />
                  <div className="w-px flex-1 bg-gray-200 mt-2" />
                </div>
                <div className="flex-1 pb-6">
                  <div className="skeleton h-4 w-1/3 mb-2" />
                  <div className="skeleton h-24 rounded-2xl" />
                </div>
              </div>
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="card p-8 text-center mt-4">
            <p className="text-4xl mb-3">📭</p>
            <p className="font-600 text-[var(--color-text-secondary)]">Belum ada update log yang dipublikasikan.</p>
          </div>
        ) : (
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 top-2 bottom-0 w-px bg-[var(--color-border)]" />

            <div className="space-y-6">
              {logs.map((log, index) => {
                const cfg = TYPE_CONFIG[log.type] || TYPE_CONFIG.feature;
                const Icon = cfg.Icon;
                const isLatest = index === 0;
                return (
                  <div key={log.id} className="flex gap-5 animate-fade-up" style={{ animationDelay: `${index * 0.05}s` }}>
                    {/* Timeline dot */}
                    <div className="flex-shrink-0 flex flex-col items-center pt-1">
                      <div className={cn('w-3 h-3 rounded-full border-2 border-white shadow-sm z-10', cfg.dot)} />
                    </div>

                    {/* Content card */}
                    <div className="flex-1 pb-2">
                      {/* Date & version */}
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <p className="text-[12px] font-600 text-[var(--color-text-muted)]">
                          {new Date(log.release_date).toLocaleDateString('id-ID', {
                            day: 'numeric', month: 'long', year: 'numeric',
                          })}
                        </p>
                        <code className="text-[11px] bg-gray-100 px-1.5 py-0.5 rounded font-mono text-[var(--color-text-secondary)]">
                          v{log.version}
                        </code>
                        {isLatest && (
                          <span className="text-[11px] bg-[var(--color-primary-500)] text-white px-2 py-0.5 rounded-full font-600">
                            Terbaru
                          </span>
                        )}
                      </div>

                      <div className="card p-4">
                        {/* Type badge + title */}
                        <div className="flex items-start gap-3 mb-3">
                          <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0', cfg.color.split(' ')[0])}>
                            <Icon size={16} className={cfg.color.split(' ')[1]} />
                          </div>
                          <div>
                            <span className={cn('badge text-[11px] mb-1', cfg.color)}>
                              {cfg.label}
                            </span>
                            <h2 className="font-800 text-[16px] text-[var(--color-text-primary)] leading-snug">
                              {log.title}
                            </h2>
                          </div>
                        </div>

                        {/* Description */}
                        <div className="pl-11">
                          <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-line">
                            {log.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Back link */}
        <div className="mt-10 text-center">
          <Link href="/" className="btn btn-outline px-6 text-[14px]">
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
