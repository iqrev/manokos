# 📘 Manokos – Buku Panduan Pengoperasian (Manual Book)

> Versi: 1.0.0 | Terakhir diperbarui: April 2026

---

## Daftar Isi

1. [Prasyarat Sistem](#1-prasyarat-sistem)
2. [Konfigurasi Backend (Laravel)](#2-konfigurasi-backend-laravel)
3. [Konfigurasi Frontend (Next.js)](#3-konfigurasi-frontend-nextjs)
4. [Menjalankan untuk Development](#4-menjalankan-untuk-development)
5. [Akses Aplikasi](#5-akses-aplikasi)
6. [Membuat Akun Admin Pertama](#6-membuat-akun-admin-pertama)
7. [Panduan Penggunaan – Pencari Kos](#7-panduan-penggunaan--pencari-kos)
8. [Panduan Penggunaan – Pemilik Kos (Owner)](#8-panduan-penggunaan--pemilik-kos-owner)
9. [Panduan Penggunaan – Admin](#9-panduan-penggunaan--admin)
10. [Deployment ke Produksi](#10-deployment-ke-produksi)
11. [Troubleshooting](#11-troubleshooting)

---

## 1. Prasyarat Sistem

Pastikan software berikut sudah terinstal di komputer kamu:

| Software | Versi Minimum | Cek dengan |
|---|---|---|
| PHP | 8.2+ | `php --version` |
| Composer | 2.x | `composer --version` |
| Node.js | 18+ | `node --version` |
| npm | 9+ | `npm --version` |
| MySQL | 8.0+ | `mysql --version` |
| Git | Terbaru | `git --version` |

> **Pengguna Mac dengan ServBay/Herd**: Pastikan PHP dan MySQL sudah aktif di panel ServBay/Herd sebelum melanjutkan.

---

## 2. Konfigurasi Backend (Laravel)

### 2.1 Clone & Install Dependencies

```bash
# Masuk ke folder backend
cd manokos/backend

# Install composer dependencies
composer install
```

### 2.2 Konfigurasi Environment

```bash
# Salin file environment
cp .env.example .env

# Generate application key
php artisan key:generate
```

Buka file `backend/.env` dan sesuaikan konfigurasi berikut:

```env
APP_NAME=Manokos
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=manokos
DB_USERNAME=root
DB_PASSWORD=password_mysql_kamu

# Sanctum
SANCTUM_STATEFUL_DOMAINS=localhost:3000

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### 2.3 Buat Database

```sql
-- Di MySQL shell atau phpMyAdmin
CREATE DATABASE manokos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2.4 Jalankan Migrasi & Seeder

```bash
# Jalankan semua migrasi
php artisan migrate

# Isi data fasilitas (wajib dilakukan sekali)
php artisan db:seed --class=FacilitySeeder

# Aktifkan symlink storage untuk akses gambar
php artisan storage:link
```

### 2.5 Verifikasi Instalasi Backend

```bash
# Cek semua route aktif
php artisan route:list --path=api
```

---

## 3. Konfigurasi Frontend (Next.js)

### 3.1 Install Dependencies

```bash
cd manokos/frontend

npm install
```

### 3.2 Konfigurasi Environment

```bash
cp .env.local.example .env.local
```

Isi file `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

> Ganti `localhost:8000` dengan URL server backend kamu jika berbeda.

---

## 4. Menjalankan untuk Development

Buka **2 terminal** secara bersamaan:

### Terminal 1 – Backend

```bash
cd manokos/backend
php artisan serve
# Backend berjalan di: http://localhost:8000
```

### Terminal 2 – Frontend

```bash
cd manokos/frontend
npm run dev
# Frontend berjalan di: http://localhost:3000
```

---

## 5. Akses Aplikasi

| URL | Keterangan |
|---|---|
| `http://localhost:3000` | Halaman utama (publik) |
| `http://localhost:3000/cari` | Pencarian kos |
| `http://localhost:3000/login` | Halaman login |
| `http://localhost:3000/daftar` | Halaman registrasi |
| `http://localhost:3000/owner` | Dashboard pemilik kos |
| `http://localhost:3000/admin` | Panel admin |
| `http://localhost:3000/simpan` | Kos tersimpan (login required) |
| `http://localhost:3000/changelog` | Riwayat update publik |
| `http://localhost:8000/api/...` | API Backend |

---

## 6. Membuat Akun Admin Pertama

Akun admin **tidak bisa** didaftarkan lewat form publik. Buat langsung via Artisan Tinker:

```bash
cd backend

php artisan tinker
```

Di dalam Tinker:

```php
use App\Models\User;
use Illuminate\Support\Facades\Hash;

User::updateOrCreate(
    ['email' => 'admin@swarnatech.com'],
    [
        'name'     => 'Admin Manokos',
        'phone'    => '081234567890',
        'password' => Hash::make('password'),
        'role'     => 'admin',
    ]
);

# Atau jalankan seeder dummy data yang sudah disediakan:
php artisan db:seed --class=DummyDataSeeder
```

Login ke `http://localhost:3000/login` dengan info:
- **Email**: `admin@swarnatech.com`
- **Password**: `password`
---

## 7. Panduan Penggunaan – Pencari Kos

### 7.1 Mencari Kos

1. Buka halaman utama → pilih kawasan di kolom pencarian (Mendalo, Sipin, dll)
2. Klik **"Cari Kos"** atau pilih dari shortcut kawasan
3. Di halaman hasil:
   - **Mobile**: Gunakan tombol **"Daftar"** / **"Peta"** (FAB bawah) untuk beralih tampilan
   - **Desktop**: Tampilan split otomatis (daftar kiri, peta kanan)

### 7.2 Filter Pencarian

Klik ikon **Filter** di halaman `/cari` untuk memilih:
- **Kawasan**: Area spesifik di Jambi
- **Tipe Kos**: Putra / Putri / Campur
- **Harga Min/Max**: Rentang harga per bulan

### 7.3 Melihat Detail Kos

1. Klik kartu kos dari hasil pencarian
2. Di halaman detail kamu melihat:
   - Galeri foto (swipe mobile / click desktop)
   - Peta lokasi perkiraan (radius privasi ~150m)
   - Daftar fasilitas
   - Harga per bulan dan per tahun

### 7.4 Menghubungi Pemilik

- Klik **"Hubungi via WhatsApp"** (tombol hijau)
- Template pesan akan otomatis terisi di WhatsApp
- Negosiasi dan transaksi dilakukan langsung dengan pemilik

### 7.5 Menyimpan Kos Favorit

- **Login** terlebih dahulu
- Klik ikon 🔖 di halaman detail kos
- Lihat semua kos tersimpan di `/simpan` atau menu **Tersimpan** di navigasi

---

## 8. Panduan Penggunaan – Pemilik Kos (Owner)

### 8.1 Registrasi sebagai Pemilik

1. Buka `http://localhost:3000/daftar`
2. Pilih tab **"🏠 Pemilik Kos"**
3. Isi nama, email, nomor WhatsApp, dan password
4. Klik **"Daftar Sekarang"**
5. Setelah registrasi, kamu akan diarahkan ke halaman KYC

### 8.2 Verifikasi KYC (Wajib)

Propertimu tidak akan muncul di pencarian sebelum KYC disetujui.

1. Masuk ke `/owner/kyc`
2. **Step 1**: Baca persyaratan yang dibutuhkan
3. **Step 2**: Upload **Foto KTP** (maks 2MB, JPG/PNG) + **Bukti Kepemilikan** (sertifikat, surat kuasa, atau tagihan listrik)
4. Klik **"Kirim Verifikasi"**
5. Tunggu 1-2 hari kerja untuk review dari admin

### 8.3 Menambah Properti Baru

1. Masuk ke `/owner` → klik **"+ Tambah Kos"**
2. Isi semua data:
   - **Foto Utama**: Foto terbaik kos (wajib)
   - **Nama/Judul Kos**: Deskriptif, mis. "Kos Putri Bu Sari di Mendalo"
   - **Tipe**: Putra / Putri / Campur
   - **Harga**: Per bulan (wajib) dan per tahun (opsional)
   - **Kawasan & Alamat**: Pilih kawasan dari dropdown
   - **No. WhatsApp**: Nomor yang aktif untuk dihubungi penyewa
   - **Titik Lokasi**: Tap atau drag marker di peta untuk menentukan posisi kos
   - **Fasilitas**: Centang fasilitas yang tersedia
   - **Deskripsi**: Ceritakan kondisi kos, aturan, lingkungan, dll
3. Klik **"Simpan & Ajukan Verifikasi"**
4. Properti menunggu verifikasi admin sebelum tampil publik

### 8.4 Melihat Statistik

Masuk ke `/owner/statistik` untuk melihat:
- Total dilihat (views) oleh calon penyewa
- Total klik tombol WhatsApp
- Statistik per masing-masing properti

---

## 9. Panduan Penggunaan – Admin

Login sebagai admin, lalu akses `http://localhost:3000/admin`.

### 9.1 Tab Verifikasi KYC

- Lihat semua pengajuan KYC dari pemilik (status: Pending / Disetujui / Ditolak)
- Klik **"Preview KTP"** untuk membuka modal review
- Di modal: preview foto KTP, link buka dokumen kepemilikan, isian catatan
- Klik **"Setujui"** atau **"Tolak"**
- Jika ditolak, isi catatan alasan penolakan

### 9.2 Tab Properti

- Lihat semua listing properti dari seluruh pemilik
- **Verifikasi**: Klik tombol untuk mengubah status terverifikasi/belum
- **Boost**: Tandai properti sebagai "⭐ Unggulan" agar muncul di featured section

### 9.3 Tab Update Log

Fitur untuk mencatat riwayat pembaruan platform:

**Menambah Log Baru:**
1. Klik **"+ Tambah Log"**
2. Isi:
   - **Versi**: Format sem-ver, mis. `1.2.0`
   - **Tanggal Rilis**: Tanggal deploy/release
   - **Judul**: Ringkasan singkat perubahan
   - **Tipe**: Feature Baru / Perbaikan / Peningkatan / Breaking
   - **Deskripsi**: Detail perubahan (mendukung format list dengan `-`)
   - **Status**: Published (tampil publik) atau Draft
3. Klik **"Tambah Log"**

**Edit/Hapus Log:**
- Klik ✏️ untuk mengedit
- Klik 🗑️ untuk menghapus (dengan konfirmasi)

Log yang dipublikasikan akan tampil di halaman publik `/changelog`.

---

## 10. Deployment ke Produksi

### 10.1 Frontend – Cloudflare Pages

```bash
cd frontend

# Build production
npm run build

# Deploy ke Cloudflare Pages menggunakan Wrangler
npx wrangler pages deploy .next/
```

Atau hubungkan repo GitHub ke Cloudflare Pages Dashboard:
- **Build command**: `npm run build`
- **Build output**: `.next`
- **Environment variable**: `NEXT_PUBLIC_API_URL=https://api.manokos.id/api`

### 10.2 Backend – VPS / Shared Hosting

```bash
# Di server produksi
cd /path/to/backend

composer install --no-dev --optimize-autoloader

php artisan key:generate
php artisan config:cache
php artisan route:cache
php artisan migrate --force
php artisan storage:link
php artisan db:seed --class=FacilitySeeder
```

**Konfigurasi Nginx** (contoh):
```nginx
server {
    listen 80;
    server_name api.manokos.id;
    root /path/to/backend/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

### 10.3 Konfigurasi CORS Produksi

Edit `backend/config/cors.php`:

```php
'allowed_origins' => ['https://manokos.id', 'https://www.manokos.id'],
'supports_credentials' => true,
```

---

## 11. Troubleshooting

### ❌ "CORS error" di browser

- Pastikan `SANCTUM_STATEFUL_DOMAINS` di `.env` backend berisi domain frontend
- Pastikan `allowed_origins` di `config/cors.php` berisi URL frontend
- Jalankan `php artisan config:clear`

### ❌ Gambar tidak muncul

```bash
# Pastikan storage link aktif
php artisan storage:link
```

Cek apakah `public/storage` → `storage/app/public` sudah terhubung.

### ❌ "Peta tidak muncul" (blank Leaflet)

- Leaflet di-load secara dynamic (client-side only). Pastikan `dynamic(() => import(...), { ssr: false })` sudah ada
- Cek apakah file `leaflet/dist/leaflet.css` di-import di dalam `useEffect`

### ❌ "Unauthenticated" padahal sudah login

- Token Sanctum disimpan di `localStorage` (`manokos_token`)
- Pastikan header `Authorization: Bearer <token>` dikirim di setiap request API (cek `src/lib/api.ts`)

### ❌ Error 500 saat upload KTP/dokumen

- Pastikan `php.ini` mengizinkan upload file (cek `upload_max_filesize` dan `post_max_size`)
- Pastikan folder `storage/app/public` writable: `chmod -R 775 storage`

### ❌ Facility tidak muncul di form tambah properti

```bash
# Jalankan seeder fasilitas
php artisan db:seed --class=FacilitySeeder
```

---

## 📞 Kontak & Dukungan

Untuk pertanyaan teknis atau dukungan pengembangan, hubungi tim Swarnatech.

---

*Manokos © 2026 – Dokumen ini bersifat internal dan ditujukan untuk tim developer.*
