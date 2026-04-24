'use client';

import { useQuery } from '@tanstack/react-query';
import { Eye, MessageCircle, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
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

  const chartData = last7Days.map(date => {
    const dayStats = stats.filter(s => s.date === date);
    return {
      name: new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
      views: dayStats.reduce((sum, st) => sum + st.views, 0),
      clicks: dayStats.reduce((sum, st) => sum + st.whatsapp_clicks, 0),
    };
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

      {/* Analytics Chart */}
      <div className="card p-5 mb-8 animate-fade-up">
        <h2 className="font-700 text-[16px] text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
          <TrendingUp size={18} className="text-[var(--color-primary-500)]" /> Tren 7 Hari Terakhir
        </h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                labelStyle={{ fontWeight: 700, color: '#1f2937', marginBottom: '8px' }}
                itemStyle={{ fontSize: '13px', fontWeight: 600 }}
              />
              <Line type="monotone" name="Dilihat" dataKey="views" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              <Line type="monotone" name="Klik WA" dataKey="clicks" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
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
