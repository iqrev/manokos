'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  X, CheckCircle, XCircle, Eye, Clock, LogOut, Users, Home,
  FileText, Plus, Trash2, Edit3, Rocket, Wrench, Zap, AlertTriangle,
  BarChart3, UserCog, UserMinus, ShieldCheck, Mail, Phone,
  TrendingUp, Activity, PieChart as PieChartIcon
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { KycRecord, Property } from '@/types';
import { formatPrice, cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, Legend
} from 'recharts';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';

type Tab = 'dashboard' | 'users' | 'kyc' | 'properties' | 'changelog';

// ─── Shared Components ───────────────────────────────────────────────────────

function StatCard({ title, value, icon: Icon, colorClass, subText }: { title: string, value: string | number, icon: any, colorClass: string, subText?: string }) {
  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0", colorClass)}>
        <Icon size={24} className="text-white" />
      </div>
      <div>
        <p className="text-[12px] font-700 text-[var(--color-text-muted)] uppercase tracking-wider">{title}</p>
        <p className="text-[24px] font-800 text-[var(--color-text-primary)] leading-none mt-1">{value}</p>
        {subText && <p className="text-[11px] text-[var(--color-text-muted)] mt-1">{subText}</p>}
      </div>
    </div>
  );
}

// ─── Dashboard Tab ──────────────────────────────────────────────────────────

function DashboardView() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => api.get('/admin/stats').then(r => r.data),
  });

  if (isLoading) return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}</div>;

  const chartData = stats?.charts?.daily || [];
  const typeData = stats?.charts?.types?.map((t: any) => ({ name: t.type.toUpperCase(), value: t.count })) || [];
  const COLORS = ['#0f9b98', '#f59e0b', '#3b82f6'];

  return (
    <div className="space-y-6">
      <h1 className="text-[24px] font-800 text-[var(--color-text-primary)]">Performa Website</h1>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard title="Total User" value={stats?.overview?.total_users} icon={Users} colorClass="bg-blue-500" />
        <StatCard title="Pemilik" value={stats?.overview?.total_owners} icon={ShieldCheck} colorClass="bg-purple-500" />
        <StatCard title="Properti" value={stats?.overview?.total_properties} icon={Home} colorClass="bg-[var(--color-primary-500)]" />
        <StatCard title="Klik WA" value={stats?.overview?.total_clicks} icon={Activity} colorClass="bg-green-500" />
        <StatCard title="Antrian KYC" value={stats?.overview?.pending_kyc} icon={Clock} colorClass="bg-amber-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart: Clicks & Views */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-800 text-[16px] flex items-center gap-2"><TrendingUp size={18} className="text-[var(--color-primary-500)]" /> Tren Interaksi (7 Hari Terakhir)</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(val) => format(new Date(val), 'dd MMM', { locale: id })}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  labelFormatter={(val) => format(new Date(val), 'EEEE, dd MMMM yyyy', { locale: id })}
                />
                <Line type="monotone" dataKey="total_views" name="Dilihat" stroke="#0f9b98" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="total_clicks" name="Klik WA" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Property Types */}
        <div className="card p-6">
          <h3 className="font-800 text-[16px] mb-6 flex items-center gap-2"><PieChartIcon size={18} className="text-purple-500" /> Komposisi Tipe Kos</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {typeData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── User Management Tab ─────────────────────────────────────────────────────

function UsersView() {
  const qc = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users', roleFilter, searchTerm],
    queryFn: () => api.get('/admin/users', { params: { role: roleFilter, search: searchTerm } }).then(r => r.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/admin/users/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: number, role: string }) => api.put(`/admin/users/${id}/role`, { role }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  });

  if (isLoading) return <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-[24px] font-800 text-[var(--color-text-primary)]">Manajemen User</h1>
        <div className="flex gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="input-field py-0 px-4 h-11 w-40 text-[14px]"
          >
            <option value="">Semua Role</option>
            <option value="user">Pencari</option>
            <option value="owner">Pemilik</option>
            <option value="admin">Admin</option>
          </select>
          <div className="relative">
            <input
              type="text"
              placeholder="Cari nama, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 h-11 w-64 text-[14px]"
            />
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={18} />
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-[var(--color-border)]">
              <th className="p-4 text-[12px] font-700 text-[var(--color-text-muted)] uppercase tracking-wider">User</th>
              <th className="p-4 text-[12px] font-700 text-[var(--color-text-muted)] uppercase tracking-wider">Kontak</th>
              <th className="p-4 text-[12px] font-700 text-[var(--color-text-muted)] uppercase tracking-wider">Role</th>
              <th className="p-4 text-[12px] font-700 text-[var(--color-text-muted)] uppercase tracking-wider">Terdaftar</th>
              <th className="p-4 text-[12px] font-700 text-[var(--color-text-muted)] uppercase tracking-wider text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {users.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-[var(--color-text-muted)]">User tidak ditemukan.</td></tr>
            ) : (
              users.map((u: any) => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--color-primary-400)] to-[var(--color-primary-600)] flex items-center justify-center text-white font-700 text-[14px]">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-700 text-[14px] text-[var(--color-text-primary)]">{u.name}</p>
                        <p className="text-[12px] text-[var(--color-text-muted)]">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[12px] flex items-center gap-1.5"><Mail size={12} className="text-gray-400" /> {u.email}</span>
                      <span className="text-[12px] flex items-center gap-1.5"><Phone size={12} className="text-gray-400" /> {u.phone || '-'}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <select
                      value={u.role}
                      onChange={(e) => updateRoleMutation.mutate({ id: u.id, role: e.target.value })}
                      className={cn("text-[11px] font-700 px-2.5 py-1 rounded-full border-none cursor-pointer focus:ring-2",
                        u.role === 'admin' ? "bg-red-100 text-red-600" :
                        u.role === 'owner' ? "bg-orange-100 text-orange-600" :
                        "bg-blue-100 text-blue-600")}
                    >
                      <option value="user">User/Pencari</option>
                      <option value="owner">Owner/Pemilik</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <p className="text-[12px] text-[var(--color-text-secondary)]">{format(new Date(u.created_at), 'dd MMM yyyy')}</p>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => { if (confirm(`Yakin ingin menghapus ${u.name}?`)) deleteMutation.mutate(u.id); }}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="Hapus User"
                    >
                      <UserMinus size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Main Admin Dashboard ─────────────────────────────────────────────────────

// Keep existing sub-components for KYC, Properties, Changelog but wrap them nicely.
// ... (omitted duplicated sub-components if they stay the same, but let's just combine everything for a clean rewrite)

interface UpdateLog {
  id: number;
  version: string;
  title: string;
  description: string;
  type: 'feature' | 'fix' | 'improvement' | 'breaking';
  is_published: boolean;
  release_date: string;
}

const LOG_TYPE_CONFIG = {
  feature:     { label: 'Fitur Baru',   Icon: Rocket,   color: 'bg-blue-100 text-blue-700',   border: 'border-blue-200' },
  fix:         { label: 'Perbaikan',    Icon: Wrench,   color: 'bg-green-100 text-green-700', border: 'border-green-200' },
  improvement: { label: 'Peningkatan', Icon: Zap,      color: 'bg-purple-100 text-purple-700', border:'border-purple-200' },
  breaking:    { label: 'Breaking',    Icon: AlertTriangle, color: 'bg-red-100 text-red-700', border: 'border-red-200' },
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const qc = useQueryClient();
  const [tab, setTab] = useState<Tab>('dashboard');
  const [selectedKyc, setSelectedKyc] = useState<KycRecord | null>(null);
  const [changelogModal, setChangelogModal] = useState<{ open: boolean; item?: UpdateLog | null }>({ open: false });

  // ── Original Data fetching ──────────────────────────────────────────────────────

  const { data: kycs = [], isLoading: kycLoading } = useQuery<KycRecord[]>({
    queryKey: ['admin-kycs'],
    queryFn: () => api.get('/admin/verifications/kyc').then(r => r.data),
    enabled: tab === 'kyc'
  });

  const { data: properties = [], isLoading: propLoading } = useQuery<Property[]>({
    queryKey: ['admin-properties'],
    queryFn: () => api.get('/admin/verifications/properties').then(r => r.data),
    enabled: tab === 'properties'
  });

  const { data: changeLogs = [], isLoading: logLoading } = useQuery<UpdateLog[]>({
    queryKey: ['admin-update-logs'],
    queryFn: () => api.get('/admin/update-logs').then(r => r.data),
    enabled: tab === 'changelog'
  });

  // ── Original Mutations ──────────────────────────────────────────────────────────

  const kycMutation = useMutation({
    mutationFn: ({ id, status, notes }: { id: number; status: string; notes: string }) =>
      api.post(`/admin/verifications/kyc/${id}`, { status, admin_notes: notes }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-kycs'] }); setSelectedKyc(null); },
  });

  const propertyMutation = useMutation({
    mutationFn: ({ id, is_verified, is_boosted }: { id: number; is_verified: boolean; is_boosted?: boolean }) =>
      api.post(`/admin/verifications/properties/${id}`, { is_verified, is_boosted }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-properties'] }),
  });

  const logCreateMutation = useMutation({
    mutationFn: (data: Partial<UpdateLog>) => api.post('/admin/update-logs', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-update-logs'] }); setChangelogModal({ open: false }); },
  });

  const logUpdateMutation = useMutation({
    mutationFn: ({ id, ...data }: Partial<UpdateLog> & { id: number }) =>
      api.put(`/admin/update-logs/${id}`, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-update-logs'] }); setChangelogModal({ open: false }); },
  });

  const logDeleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/admin/update-logs/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-update-logs'] }),
  });

  // ── Counters for sidebar ──────────────────────────────────────────────────
  // Note: ideally these come from a single 'counts' endpoint to save requests.
  const pendingKycCount = kycs.filter(k => k.status === 'pending').length;

  const navItems: { key: Tab; label: string; Icon: React.ElementType; badge?: number }[] = [
    { key: 'dashboard',  label: 'Performa',       Icon: BarChart3 },
    { key: 'users',      label: 'Data User',      Icon: UserCog },
    { key: 'kyc',        label: 'Verifikasi KYC', Icon: Users,    badge: pendingKycCount },
    { key: 'properties', label: 'Properti',        Icon: Home },
    { key: 'changelog',  label: 'Update Log',     Icon: FileText },
  ];

  return (
    <div className="flex h-screen bg-[var(--color-bg)] overflow-hidden">
      {/* ── Sidebar ───────────────────────────────────────────────── */}
      <aside className="w-64 flex-shrink-0 bg-white border-r border-[var(--color-border)] flex flex-col">
        <div className="p-6 border-b border-[var(--color-border)]">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--color-primary-400)] to-[var(--color-primary-600)] flex items-center justify-center shadow-lg shadow-[var(--color-primary-100)]">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="text-[19px] font-900 tracking-tight text-[var(--color-text-primary)]">Mano<span className="text-[var(--color-primary-500)]">kos</span></span>
          </Link>
          <div className="mt-4 flex items-center gap-3 bg-gray-50 p-2 rounded-xl border border-gray-100">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-800 text-[13px]">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-800 text-[12px] text-[var(--color-text-primary)] truncate leading-tight">{user?.name}</p>
              <p className="text-[10px] text-blue-600 font-700 uppercase tracking-wider">Super Admin</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map(({ key, label, Icon, badge }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={cn('w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[14px] font-700 transition-all group',
                tab === key
                  ? 'bg-[var(--color-primary-500)] text-white shadow-lg shadow-[var(--color-primary-100)]'
                  : 'text-[var(--color-text-secondary)] hover:bg-gray-50 hover:text-[var(--color-text-primary)]')}
            >
              <Icon size={19} className={cn(tab === key ? "text-white" : "text-[var(--color-text-muted)] group-hover:text-[var(--color-primary-500)]")} />
              {label}
              {badge != null && badge > 0 && (
                <span className={cn("ml-auto text-[11px] font-900 w-5 h-5 rounded-full flex items-center justify-center", tab === key ? "bg-white text-[var(--color-primary-500)]" : "bg-red-500 text-white")}>
                  {badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[var(--color-border)]">
          <button onClick={() => logout()}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-[14px] font-700 text-red-500 hover:bg-red-50 transition-colors">
            <LogOut size={19} /> Keluar Panel
          </button>
        </div>
      </aside>

      {/* ── Main content ──────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-8">

        {tab === 'dashboard' && <DashboardView />}
        {tab === 'users'     && <UsersView />}

        {/* ======= KYC TAB ======= */}
        {tab === 'kyc' && (
          <div>
            <h1 className="text-[24px] font-800 text-[var(--color-text-primary)] mb-6">Verifikasi KYC Masuk</h1>
            {kycLoading ? (
              <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}</div>
            ) : kycs.length === 0 ? (
              <div className="card p-12 text-center">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-green-500" />
                </div>
                <h3 className="font-800 text-[18px]">Semua beres!</h3>
                <p className="text-[var(--color-text-secondary)]">Tidak ada pengajuan KYC yang perlu ditinjau.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {kycs.map(kyc => (
                  <div key={kyc.id} className="card p-5 flex items-center gap-5 hover:border-[var(--color-primary-200)] transition-colors border border-transparent">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 font-900 text-[var(--color-primary-500)]">
                      {kyc.owner?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-800 text-[15px] text-[var(--color-text-primary)]">{kyc.owner?.name}</p>
                      <p className="text-[13px] text-[var(--color-text-muted)]">{kyc.owner?.email} · {kyc.owner?.phone}</p>
                    </div>
                    <span className={cn('badge text-[12px] px-4 py-1.5',
                      kyc.status === 'pending' ? 'badge-pending' : kyc.status === 'verified' ? 'badge-verified' : 'badge-rejected')}>
                      {kyc.status === 'pending' ? '⏳ Menunggu Review' : kyc.status === 'verified' ? '✓ Terverifikasi' : '✗ Ditolak'}
                    </span>
                    <button id={`btn-preview-kyc-${kyc.id}`} onClick={() => setSelectedKyc(kyc)}
                      className="btn btn-outline text-[13px] px-5 h-10 gap-2">
                      <Eye size={16} /> Review Data
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======= PROPERTIES TAB ======= */}
        {tab === 'properties' && (
          <div>
            <h1 className="text-[24px] font-800 text-[var(--color-text-primary)] mb-6">Manajemen Properti</h1>
            {propLoading ? (
              <div className="space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}</div>
            ) : (
              <div className="space-y-3">
                {properties.map(p => (
                  <div key={p.id} className="card p-4 flex items-center gap-5">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100 shadow-sm">
                      {p.main_image
                        ? <img src={`${BACKEND_URL}/storage/${p.main_image}`} alt={p.title} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-3xl">🏠</div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-800 text-[16px] text-[var(--color-text-primary)] truncate">{p.title}</span>
                        {p.is_boosted && <span className="bg-amber-100 text-amber-700 text-[10px] font-900 px-2 py-0.5 rounded-full uppercase">VIP</span>}
                      </div>
                      <p className="text-[13px] text-[var(--color-text-muted)] flex items-center gap-1">
                        <Rocket size={14} className="text-blue-500" /> {p.area} · <span className="font-700 text-[var(--color-primary-600)]">{formatPrice(p.price_monthly)}/bln</span>
                      </p>
                      <p className="text-[11px] text-[var(--color-text-muted)] mt-1">Oleh: <span className="font-600">{p.owner?.name}</span></p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button id={`btn-verify-prop-${p.id}`}
                        onClick={() => propertyMutation.mutate({ id: p.id, is_verified: !p.is_verified })}
                        className={cn('btn h-10 text-[13px] px-4 gap-2 border-2 transition-all',
                          p.is_verified
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-gray-50 text-gray-400 border-gray-200 hover:text-green-600')}>
                        {p.is_verified ? <><CheckCircle size={16} /> Verif</> : <><Clock size={16} /> Verif</>}
                      </button>
                      <button id={`btn-boost-prop-${p.id}`}
                        onClick={() => propertyMutation.mutate({ id: p.id, is_verified: p.is_verified, is_boosted: !p.is_boosted })}
                        className={cn('btn h-10 text-[13px] px-4 gap-2 border-2 transition-all',
                          p.is_boosted
                            ? 'bg-amber-100 text-amber-700 border-amber-300'
                            : 'bg-gray-50 text-gray-400 border-gray-200 hover:text-amber-600')}>
                        {p.is_boosted ? '⭐ Boosted' : 'Boost'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======= CHANGELOG TAB ======= */}
        {tab === 'changelog' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-[24px] font-800 text-[var(--color-text-primary)]">Log Update Platform</h1>
              <button
                onClick={() => setChangelogModal({ open: true, item: null })}
                className="btn btn-primary h-11 px-6 gap-2 text-[14px]"
              >
                <Plus size={18} /> Rilis Update Baru
              </button>
            </div>

            {logLoading ? (
              <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-32 rounded-2xl" />)}</div>
            ) : changeLogs.length === 0 ? (
              <div className="card p-12 text-center text-gray-400">Belum ada catatan update.</div>
            ) : (
              <div className="space-y-3">
                {changeLogs.map(log => {
                  const cfg = LOG_TYPE_CONFIG[log.type] || LOG_TYPE_CONFIG.feature;
                  const Icon = cfg.Icon;
                  return (
                    <div key={log.id} className={cn('card p-5 border-l-4 transition-all hover:translate-x-1', cfg.border)}>
                      <div className="flex items-start gap-4">
                        <div className={cn('w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0', cfg.color.split(' ')[0])}>
                          <Icon size={20} className={cfg.color.split(' ')[1]} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 flex-wrap mb-1">
                            <span className="font-900 text-[17px] text-[var(--color-text-primary)]">{log.title}</span>
                            <span className={cn('badge text-[10px] uppercase font-900', cfg.color)}>{cfg.label}</span>
                            <code className="text-[12px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-lg font-mono">v{log.version}</code>
                          </div>
                          <p className="text-[12px] text-[var(--color-text-muted)] mb-3 font-600">Terbit: {format(new Date(log.release_date), 'dd MMMM yyyy', { locale: id })}</p>
                          <p className="text-[14px] text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-line bg-gray-50/50 p-4 rounded-2xl border border-gray-100 italic">
                            "{log.description}"
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => setChangelogModal({ open: true, item: log })} className="p-2 text-gray-400 hover:text-blue-500"><Edit3 size={18} /></button>
                          <button onClick={() => { if (confirm('Hapus log?')) logDeleteMutation.mutate(log.id); }} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals (KYC Modal, Changelog Modal) are huge, keep them as sub-components for cleanliness */}
      {selectedKyc && (
        <KycModal
          kyc={selectedKyc}
          onClose={() => setSelectedKyc(null)}
          onVerify={(id: number, status: string, notes: string) => kycMutation.mutate({ id, status, notes })}
          loading={kycMutation.isPending}
        />
      )}

      {changelogModal.open && (
        <ChangelogForm
          initial={changelogModal.item}
          onClose={() => setChangelogModal({ open: false })}
          onSave={(data: any) => {
            if (changelogModal.item) logUpdateMutation.mutate({ ...data, id: changelogModal.item.id });
            else logCreateMutation.mutate(data);
          }}
          loading={logCreateMutation.isPending || logUpdateMutation.isPending}
        />
      )}
    </div>
  );
}

// ─── Modal Sub-components ───────────────────────────────────────────────────

function KycModal({ kyc, onClose, onVerify, loading }: { kyc: KycRecord; onClose: () => void; onVerify: any; loading: boolean }) {
  const [notes, setNotes] = useState('');
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-up" onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--color-border)]">
          <div>
            <h2 className="font-900 text-[19px] leading-tight text-[var(--color-text-primary)]">Review KYC</h2>
            <p className="text-[12px] text-[var(--color-text-muted)]">Pemilik: {kyc.owner?.name}</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center" aria-label="Tutup"><X size={24} /></button>
        </div>
        <div className="p-6 space-y-6 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] font-800 text-[var(--color-text-muted)] uppercase tracking-widest mb-3">Foto KTP</p>
              <div className="aspect-[3/2] rounded-2xl overflow-hidden border border-gray-200">
                <img src={`${BACKEND_URL}/storage/${kyc.ktp_path}`} className="w-full h-full object-cover" alt="KTP" />
              </div>
            </div>
            <div>
              <p className="text-[11px] font-800 text-[var(--color-text-muted)] uppercase tracking-widest mb-3">Bukti Kepemilikan</p>
              <a href={`${BACKEND_URL}/storage/${kyc.document_path}`} target="_blank" className="flex flex-col items-center justify-center aspect-[3/2] rounded-2xl border-2 border-dashed border-[var(--color-primary-200)] bg-[var(--color-primary-50)] text-[var(--color-primary-600)] hover:bg-[var(--color-primary-100)] transition-colors group">
                <FileText size={32} className="mb-2 group-hover:scale-110 transition-transform" />
                <span className="font-800 text-[13px]">Buka Dokumen</span>
              </a>
            </div>
          </div>
          <div className="bg-gray-50 p-5 rounded-2xl space-y-3">
             <h4 className="font-800 text-[14px]">Keputusan Admin</h4>
             <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Alasan penolakan jika diperlukan..." className="input-field pt-3 resize-none text-[13px]" />
          </div>
        </div>
        <div className="flex gap-4 p-6 pt-0">
          <button onClick={() => onVerify(kyc.id, 'rejected', notes)} disabled={loading} className="flex-1 btn bg-red-50 text-red-600 border border-red-200 h-12 font-800 gap-2">Tolak</button>
          <button onClick={() => onVerify(kyc.id, 'verified', notes)} disabled={loading} className="flex-1 btn btn-primary h-12 font-800 gap-2">Setujui</button>
        </div>
      </div>
    </div>
  );
}

function ChangelogForm({ initial, onClose, onSave, loading }: { initial?: UpdateLog | null; onClose: () => void; onSave: any, loading: boolean }) {
  const [form, setForm] = useState({
    version:      initial?.version       ?? '',
    title:        initial?.title         ?? '',
    description:  initial?.description   ?? '',
    type:         initial?.type          ?? 'feature',
    is_published: initial?.is_published  ?? true,
    release_date: initial?.release_date  ?? new Date().toISOString().split('T')[0],
  });

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-up" onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl p-6" onClick={e => e.stopPropagation()}>
        <h2 className="font-900 text-[20px] mb-6">{initial ? 'Edit Rilis' : 'Publish Rilis Baru'}</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Versi" placeholder="1.2.0" value={form.version} onChange={e => setForm({...form, version: e.target.value})} required />
            <Input label="Tgl Rilis" type="date" value={form.release_date} onChange={e => setForm({...form, release_date: e.target.value})} required />
          </div>
          <Input label="Judul Update" placeholder="Peningkatan UI..." value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
          <div>
            <p className="text-[11px] font-800 text-[var(--color-text-muted)] uppercase mb-2">Tipe Perubahan</p>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(LOG_TYPE_CONFIG).map(([k, v]: any) => (
                <button key={k} onClick={() => setForm({...form, type: k})} className={cn("p-2 rounded-xl border-2 text-[12px] font-800 flex items-center gap-2", form.type === k ? "border-[var(--color-primary-500)] text-[var(--color-primary-600)] bg-[var(--color-primary-50)]" : "border-gray-100 text-gray-500")}>
                  <v.Icon size={14} /> {v.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[11px] font-800 text-[var(--color-text-muted)] uppercase mb-2">Keterangan</p>
            <textarea rows={5} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input-field pt-3 resize-none text-[13px]" placeholder="- Menambahkan grafik performance..." />
          </div>
          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl">
            <button onClick={() => setForm({...form, is_published: !form.is_published})} className={cn("w-12 h-6 rounded-full transition-all relative", form.is_published ? "bg-[var(--color-primary-500)]" : "bg-gray-300")}>
              <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-all", form.is_published ? "left-7" : "left-1")} />
            </button>
            <span className="text-[13px] font-800">{form.is_published ? '🔥 Published' : '🔒 Draft'}</span>
          </div>
        </div>
        <div className="flex gap-3 mt-8">
          <button onClick={onClose} className="flex-1 btn btn-outline h-12">Batal</button>
          <button onClick={() => onSave(form)} disabled={loading} className="flex-1 btn btn-primary h-12 font-900">{loading ? 'Tunggu...' : 'Simpan Rilis'}</button>
        </div>
      </div>
    </div>
  );
}
