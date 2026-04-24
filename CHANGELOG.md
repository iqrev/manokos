# Changelog Manokos

Semua pembaruan pada proyek ini akan dicatat dalam berkas ini. Format log berdasarkan panduan [Keep a Changelog](https://keepachangelog.com/id/1.0.0/).

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
