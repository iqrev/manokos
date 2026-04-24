'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

interface BookmarkButtonProps {
  propertyId: number;
  className?: string;
}

export default function BookmarkButton({ propertyId, className }: BookmarkButtonProps) {
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data } = useQuery({
    queryKey: ['bookmark-status', propertyId],
    queryFn: () => api.get(`/bookmarks/${propertyId}/status`).then(r => r.data),
    enabled: !!user,
  });

  const mutation = useMutation({
    mutationFn: () => api.post(`/bookmarks/${propertyId}/toggle`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookmark-status', propertyId] });
      qc.invalidateQueries({ queryKey: ['bookmarks'] });
    },
  });

  if (!user) return null;

  const isBookmarked = data?.bookmarked ?? false;

  return (
    <button
      id={`btn-bookmark-${propertyId}`}
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
      aria-label={isBookmarked ? 'Hapus dari simpanan' : 'Simpan properti'}
      aria-pressed={isBookmarked}
      className={cn(
        'btn rounded-2xl transition-all duration-200',
        isBookmarked
          ? 'bg-[var(--color-primary-50)] text-[var(--color-primary-500)] border-2 border-[var(--color-primary-200)]'
          : 'bg-white/90 backdrop-blur-sm text-[var(--color-text-muted)] border-2 border-[var(--color-border)] hover:border-[var(--color-primary-300)]',
        className
      )}
    >
      {isBookmarked
        ? <BookmarkCheck size={20} className="fill-current" />
        : <Bookmark size={20} />
      }
    </button>
  );
}
