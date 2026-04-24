# Manokos 🏠

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![Laravel](https://img.shields.io/badge/Laravel-11-FF2D20?logo=laravel)](https://laravel.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

**Direktori Kos & Kontrakan Terkurasi untuk Wilayah Jambi**

Manokos adalah platform digital repositori terpusat yang menghubungkan pencari kos (mahasiswa, pekerja) dengan pemilik properti secara langsung via WhatsApp. Fokus utama aplikasi ini adalah pada visibilitas tinggi, verifikasi identitas (KYC) yang aman, dan kemudahan akses di perangkat mobile maupun desktop.

---

## ✨ Fitur Utama

| Fitur | Status |
|---|---|
| Pencarian & Filter (area, tipe, harga, fasilitas detail) | ✅ |
| Pencarian GPS Radius "Di Dekat Saya" (Haversine) | ✅ |
| Modul Laporkan Properti Palsu/Penipuan | ✅ |
| Peta Leaflet interaktif (multi-pin search, radius privasi detail) | ✅ |
| Drag-and-drop location picker (owner) | ✅ |
| Koneksi langsung ke WhatsApp pemilik | ✅ |
| Sistem KYC upload (KTP + bukti kepemilikan) | ✅ |
| Admin verifikasi KYC & properti | ✅ |
| Bookmark / Simpan properti | ✅ |
| Dashboard pemilik (CRUD, progres profil, toggle aktif cepat) | ✅ |
| Statistik performa interaktif (Grafik Recharts) | ✅ |
| Update Log & Changelog publik | ✅ |
| SEO (meta tags, OpenGraph, sitemap.xml, robots.txt) | ✅ |
| PWA-ready (manifest, theme color) | ✅ |

---

## 🗂️ Struktur Proyek

```
manokos/
├── backend/          # Laravel 11 API
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   │   ├── AuthController.php
│   │   │   ├── PropertyController.php
│   │   │   ├── FacilityController.php
│   │   │   ├── BookmarkController.php
│   │   │   ├── Owner/
│   │   │   │   ├── PropertyController.php
│   │   │   │   └── KycController.php
│   │   │   └── Admin/
│   │   │       ├── VerificationController.php
│   │   │       └── UpdateLogController.php
│   │   └── Models/
│   │       ├── User.php
│   │       ├── Property.php
│   │       ├── Kyc.php
│   │       ├── Facility.php
│   │       ├── Bookmark.php
│   │       ├── PropertyStat.php
│   │       └── UpdateLog.php
│   ├── database/migrations/
│   └── routes/api.php
└── frontend/          # Next.js 15 (App Router)
    └── src/
        ├── app/
        │   ├── page.tsx            # Landing page
        │   ├── cari/               # Search results
        │   ├── kos/[id]/           # Property detail
        │   ├── login/ & daftar/    # Auth
        │   ├── simpan/             # Bookmarks
        │   ├── akun/               # Profile
        │   ├── changelog/          # Public changelog
        │   ├── owner/              # Owner dashboard
        │   └── admin/              # Admin panel
        ├── components/
        ├── context/AuthContext.tsx
        ├── lib/api.ts
        └── types/index.ts
```

---

## ⚙️ Tech Stack

| Layer | Teknologi |
|---|---|
| Backend | Laravel 11, Sanctum, MySQL |
| Frontend | Next.js 15 (App Router), Tailwind CSS v4 |
| Peta | Leaflet.js + OpenStreetMap (gratis) |
| State | TanStack React Query v5 |
| HTTP Client | Axios |
| Icons | Lucide React |
| Font | Plus Jakarta Sans (Google Fonts) |
| Deployment (Target) | Frontend: Cloudflare Pages, Backend: VPS/Shared Hosting |

---

## 🚀 Quick Start

Lihat **[MANUAL_BOOK.md](./MANUAL_BOOK.md)** untuk panduan lengkap instalasi dan konfigurasi.

---

## 🔗 API Endpoints Utama

### Public
| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/api/properties` | Daftar properti (filter: area, type, min/max_price) |
| GET | `/api/properties/{id}` | Detail properti |
| POST | `/api/properties/{id}/click` | Catat klik WhatsApp |
| POST | `/api/properties/{id}/report`| Laporkan listing bermasalah |
| GET | `/api/facilities` | Daftar fasilitas |
| GET | `/api/changelog` | Update log publik |

### Auth
| Method | Endpoint | Keterangan |
|---|---|---|
| POST | `/api/register` | Daftar (role: user/owner) |
| POST | `/api/login` | Login → token Sanctum |
| POST | `/api/logout` | Logout |
| GET | `/api/me` | Info user login |

### Owner (Auth required)
| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/api/owner/properties` | Daftar properti milik owner |
| POST | `/api/owner/properties` | Tambah properti baru |
| PUT | `/api/owner/properties/{id}` | Edit properti |
| DELETE | `/api/owner/properties/{id}` | Hapus properti |
| POST | `/api/owner/kyc` | Upload dokumen KYC |
| GET | `/api/owner/kyc/status` | Status KYC |
| GET | `/api/owner/stats` | Statistik views & klik WA |

### Admin (Auth required, role: admin)
| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/api/admin/verifications/kyc` | Antrian KYC |
| POST | `/api/admin/verifications/kyc/{id}` | Approve/reject KYC |
| GET | `/api/admin/verifications/properties` | Daftar properti |
| POST | `/api/admin/verifications/properties/{id}` | Verifikasi/boost properti |
| GET | `/api/admin/update-logs` | Semua update log |
| POST | `/api/admin/update-logs` | Tambah update log |
| PUT | `/api/admin/update-logs/{id}` | Edit update log |
| DELETE | `/api/admin/update-logs/{id}` | Hapus update log |

### Bookmark (Auth required)
| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/api/bookmarks` | Daftar properti tersimpan |
| POST | `/api/bookmarks/{id}/toggle` | Toggle simpan/hapus |
| GET | `/api/bookmarks/{id}/status` | Status bookmark properti |

---

## 👥 Role Pengguna

| Role | Kemampuan |
|---|---|
| `user` | Pencarian, bookmark, kontak pemilik |
| `owner` | + KYC, kelola listing, lihat statistik |
| `admin` | + Verifikasi semua, kelola update log |

---

## 📍 Area Jambi yang Didukung

Mendalo · Telanaipura · Sipin · Kota Baru · Alam Barajo · Jambi Selatan · Paal Merah

---

## 📄 Lisensi

© 2026 Manokos – All rights reserved.
