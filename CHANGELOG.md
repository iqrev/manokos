# Changelog Manokos

Semua pembaruan pada proyek ini akan dicatat dalam berkas ini. Format log berdasarkan panduan [Keep a Changelog](https://keepachangelog.com/id/1.0.0/).

## [1.2.0] - 2026-04-24

### Ditambahkan
- **Sistem Ulasan & Rating ⭐:** Pencari kos kini dapat memberikan ulasan tekstual dan rating bintang (1-5) pada setiap properti untuk meningkatkan transparansi.
- **Multi-Photo Gallery Upload 📸:** Pemilik kos kini dapat mengunggah hingga 8 foto tambahan (total 9 dengan foto utama) untuk memberikan gambaran properti yang lebih detail.
- **PWA (Progressive Web App) 📱:** Aplikasi kini dapat diinstal di homescreen HP dan desktop, serta mendukung cache offline untuk navigasi yang lebih cepat.
- **Email Alert Otomatis (Retensi) 📧:** Sistem pengecekan kos baru setiap hari yang mengirimkan ringkasan via email sesuai kawasan favorit pengguna.
- **Landing Page SEO per Kecamatan 🔍:** URL bersih (`/kos/area/[slug]`) untuk setiap kawasan di Jambi dengan metadata unik untuk optimasi mesin pencari (SSG).

### Diubah
- **Dashboard Profil User:** Menu Akun yang diperbarui dengan navigasi ke pengaturan notifikasi email.
- **Sitemap Dinamis:** Pembaruan otomatis XML sitemap untuk menyertakan seluruh landing page kawasan terbaru.

## [1.1.0] - 2026-04-24

### Ditambahkan (Fitur Ekosistem Pencari Kos)
- **Modul Koordinat Terdekat (GIS GPS):** Integrasi fungsi Haversine SQL dan GeoLocation Navigator API untuk menyortir dan menampilkan hasil kos di radius 20KM dari posisi *device* pencari.
- **Filter Fasilitas Fleksibel:** Pengguna kini bisa mencentang satu atau multi-fasilitas (e.g. "Kloset Duduk" & "Kamar Mandi Dalam") di panel pencarian, yang otomatis disinkronisasi dengan relasi `whereHas` backend.
- **Sistem Laporan Keamanan Moderasi:** Kemampuan untuk pencari anonim melaporkan listing palsu, salah harga, atau nomor mati melalui API `POST /api/properties/{id}/report` terlindung *middleware throttle* (keamanan antispam).
- **Progres Kelengkapan Profil Pemilik:** Dashboard Owner kini menampilkan visual *completion bar* (gradient) yang mendeteksi approval KYC dan pemilikan/jumlah repositori.
- **Analisis Grafik dasbor Owner:** Implementasi Visualisasi data berbasis *Recharts* yang membuat trend pengunjung & klik WhatsApp tampil dinamis tiap pergerakan 7 harinya.

### Diubah (Refactoring)
- **Tombol Ketersediaan Kilat (Owner):** Label *Badge* status "Aktif/Nonaktif" milik owner dilenyapkan, diganti *switch toggle/checkbox* yang langsung mengikat ke `useMutation` API, mempermudah owner mematikan listing apabila sudah Laku/Penuh dalam satu ketukan jari.
- **Peningkatan Responsivitas Gambar:** Ekstensifikasi elemen `<Image>` milik Vercel/Next.js di seluruh katalog frontend untuk melakukan *caching* dan pembatasan resolusi webP gambar.

### Dioptimalkan
- **Asynchronous Statistic Engine:** Eksekusi Database di log views and click properti kini berjalan secepat kilat dengan dibungkus kedalam ekstensi *Async* di core controller laravel, memangkas lag *blocking* yang tinggi saat ribuan pengunjung mampir berbarengan.
- **Kondisi Kompilasi Render Lanjutan:** Next.js divalidasi hingga berhasil menjajaki *Exit Code 0* (*Zero Bugs* Tipe maupun Sinkronisasi File).
