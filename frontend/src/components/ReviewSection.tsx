'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Star } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { ReviewsResponse } from '@/types';
import { cn } from '@/lib/utils';

function StarRating({
  value,
  onChange,
  size = 20,
  readonly = false,
}: {
  value: number;
  onChange?: (v: number) => void;
  size?: number;
  readonly?: boolean;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={cn('transition-transform', !readonly && 'hover:scale-110 cursor-pointer', readonly && 'cursor-default')}
          aria-label={`${star} bintang`}
        >
          <Star
            size={size}
            className={cn(
              'transition-colors',
              (hovered || value) >= star
                ? 'fill-amber-400 stroke-amber-400'
                : 'fill-none stroke-gray-300'
            )}
          />
        </button>
      ))}
    </div>
  );
}

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Hari ini';
  if (days === 1) return 'Kemarin';
  if (days < 30) return `${days} hari lalu`;
  if (days < 365) return `${Math.floor(days / 30)} bulan lalu`;
  return `${Math.floor(days / 365)} tahun lalu`;
}

export default function ReviewSection({ propertyId }: { propertyId: string | number }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [body, setBody] = useState('');
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading } = useQuery<ReviewsResponse>({
    queryKey: ['reviews', propertyId],
    queryFn: () => api.get(`/properties/${propertyId}/reviews`).then(r => r.data),
  });

  const submitMutation = useMutation({
    mutationFn: () => api.post(`/properties/${propertyId}/reviews`, { rating, body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', propertyId] });
      setRating(0);
      setBody('');
      setShowForm(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/reviews/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reviews', propertyId] }),
  });

  const alreadyReviewed = data?.reviews.some(r => r.user.id === user?.id);

  return (
    <div className="mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-700 text-[16px] text-[var(--color-text-primary)]">
          Ulasan Penghuni
          {data?.total ? (
            <span className="ml-2 text-[13px] text-[var(--color-text-muted)] font-500">
              ({data.total})
            </span>
          ) : null}
        </h2>
        {data?.avg_rating && (
          <div className="flex items-center gap-1.5">
            <StarRating value={Math.round(data.avg_rating)} size={16} readonly />
            <span className="font-800 text-[15px] text-amber-500">{data.avg_rating}</span>
          </div>
        )}
      </div>

      {/* CTA Tambah Ulasan */}
      {user && !alreadyReviewed && !showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full mb-5 py-3 rounded-2xl border-2 border-dashed border-[var(--color-primary-200)] text-[var(--color-primary-600)] text-[13px] font-600 hover:bg-[var(--color-primary-50)] transition-colors"
        >
          + Tulis Ulasan Anda
        </button>
      )}

      {/* Form Ulasan */}
      {showForm && (
        <div className="card p-5 mb-5 animate-fade-up">
          <p className="font-700 text-[14px] mb-3">Rating & Ulasan Anda</p>
          <div className="mb-3">
            <StarRating value={rating} onChange={setRating} size={28} />
            {rating > 0 && (
              <p className="text-[12px] text-[var(--color-primary-500)] mt-1 font-500">
                {['', 'Sangat Buruk', 'Buruk', 'Cukup', 'Bagus', 'Sangat Bagus'][rating]}
              </p>
            )}
          </div>
          <textarea
            className="input w-full h-24 resize-none text-[13px]"
            placeholder="Ceritakan pengalaman tinggal di sini (opsional)..."
            value={body}
            onChange={e => setBody(e.target.value)}
          />
          <div className="flex gap-2 mt-3">
            <button
              className="btn btn-ghost text-[13px] flex-1"
              onClick={() => setShowForm(false)}
            >
              Batal
            </button>
            <button
              className="btn btn-primary text-[13px] flex-1"
              disabled={rating === 0 || submitMutation.isPending}
              onClick={() => submitMutation.mutate()}
            >
              {submitMutation.isPending ? 'Mengirim...' : 'Kirim Ulasan'}
            </button>
          </div>
          {submitMutation.isError && (
            <p className="text-red-500 text-[12px] mt-2 text-center">
              Gagal mengirim. Anda mungkin sudah pernah memberikan ulasan.
            </p>
          )}
        </div>
      )}

      {/* Daftar Ulasan */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map(i => <div key={i} className="skeleton h-20 rounded-2xl" />)}
        </div>
      ) : data?.reviews.length === 0 ? (
        <div className="text-center py-8 text-[var(--color-text-muted)] text-[13px]">
          <p className="text-2xl mb-2">💬</p>
          Belum ada ulasan. Jadilah yang pertama!
        </div>
      ) : (
        <div className="space-y-3">
          {data?.reviews.map(review => (
            <div key={review.id} className="card p-4 flex gap-3">
              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-[var(--color-primary-100)] flex items-center justify-center flex-shrink-0">
                <span className="text-[12px] font-700 text-[var(--color-primary-600)]">
                  {getInitials(review.user.name)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="font-700 text-[13px] text-[var(--color-text-primary)] truncate">{review.user.name}</p>
                  <span className="text-[11px] text-[var(--color-text-muted)] flex-shrink-0">{timeAgo(review.created_at)}</span>
                </div>
                <StarRating value={review.rating} size={13} readonly />
                {review.body && (
                  <p className="text-[13px] text-[var(--color-text-secondary)] mt-1.5 leading-relaxed">{review.body}</p>
                )}
                {user?.id === review.user.id && (
                  <button
                    className="text-[11px] text-red-400 hover:text-red-600 mt-2 font-500"
                    onClick={() => deleteMutation.mutate(review.id)}
                  >
                    Hapus ulasan saya
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!user && (
        <p className="text-center text-[13px] text-[var(--color-text-muted)] mt-4">
          <a href="/login" className="text-[var(--color-primary-500)] font-600 hover:underline">Login</a> untuk menulis ulasan.
        </p>
      )}
    </div>
  );
}
