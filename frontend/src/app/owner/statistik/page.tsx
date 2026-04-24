'use client';

import { useQuery } from '@tanstack/react-query';
import { Eye, MessageCircle, TrendingUp } from 'lucide-react';
import api from '@/lib/api';
import { PropertyStat, Property } from '@/types';
import { useAuth } from '@/context/AuthContext';

export default function OwnerStatsPage() {
  const { user } = useAuth();

  const { data: stats = [] } = useQuery<PropertyStat[]>({
    queryKey: ['owner-stats'],
    queryFn: () => api.get('/owner/stats').then(r => r.data),
  });

  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ['owner-properties'],
    queryFn: () => api.get('/owner/properties').then(r => r.data),
  });

  const totalViews = stats.reduce((s, st) => s + st.views, 0);
  const totalClicks = stats.reduce((s, st) => s + st.whatsapp_clicks, 0);

  // Last 7 days
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-[22px] font-800 text-[var(--color-text-primary)] mb-1">Statistik Properti</h1>
      <p className="text-[14px] text-[var(--color-text-secondary)] mb-6">Pantau performa listing kamu.</p>

      {/* Big stat cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="card p-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-3">
            <Eye size={24} className="text-blue-500" />
          </div>
          <p className="text-[36px] font-800 text-[var(--color-text-primary)] leading-none">{totalViews.toLocaleString()}</p>
          <p className="text-[14px] text-[var(--color-text-secondary)] mt-1 font-500">Total Dilihat</p>
        </div>
        <div className="card p-6">
          <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center mb-3">
            <MessageCircle size={24} className="text-green-500" />
          </div>
          <p className="text-[36px] font-800 text-[var(--color-text-primary)] leading-none">{totalClicks.toLocaleString()}</p>
          <p className="text-[14px] text-[var(--color-text-secondary)] mt-1 font-500">Klik WhatsApp</p>
        </div>
      </div>

      {/* Per property stats */}
      <h2 className="section-title mb-3">Per Properti</h2>
      <div className="space-y-3">
        {properties.map(p => {
          const propStats = stats.filter(s => s.property_id === p.id);
          const views = propStats.reduce((s, st) => s + st.views, 0);
          const clicks = propStats.reduce((s, st) => s + st.whatsapp_clicks, 0);
          return (
            <div key={p.id} className="card p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-700 text-[14px] text-[var(--color-text-primary)] line-clamp-1">{p.title}</p>
                <p className="text-[12px] text-[var(--color-text-muted)]">{p.area}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-[20px] font-800 text-[var(--color-text-primary)]">{views}</p>
                  <p className="text-[11px] text-[var(--color-text-muted)] font-500 flex items-center gap-0.5"><Eye size={11} /> Dilihat</p>
                </div>
                <div className="text-center">
                  <p className="text-[20px] font-800 text-green-600">{clicks}</p>
                  <p className="text-[11px] text-[var(--color-text-muted)] font-500 flex items-center gap-0.5"><MessageCircle size={11} /> WA Click</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
