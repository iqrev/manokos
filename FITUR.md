# Arsitektur & Spesifikasi Fitur Manokos

Dokumen ini menjelaskan secara teknis dan konseptual seluruh kapabilitas *(Capabilities)* platform Manokos dari berbagai sisi (End-User, Mitra Owner, dan Pengawas Admin).

---

## 1. Modul Pencari Kos (End-User) 🧑‍🎓

Fokus dari segmen pengguna ini adalah penekanan UX (Beban Otak Minim) dan konversi klik tercepat menuju WhatsApp pemilik kos.
*   **Pencarian Geo-Radius (Lokasi Sekitar GPS):** Jika dipercaya oleh *browser*, HP pengguna langsung dapat melacak posisinya dan mencairkan kos per-urutan KM terdekat dibandingkan menyortir dari data terlama.
*   **Filter Matrix Super Tajam:** Bukan hanya menyortir *Range* harga (Min-Max) dan wilayah, tapi ditopang pemilihan Fasilitas spesifik (Misal: Hanya kos Campur di Mendalo yang ber-AC).
*   **Sistem Markah (*Bookmark*) Lintas Device:** Semua anak kos dapat login cepat untuk mendirikan perpustakaan target survei mereka, sehingga aman bila tab ter-close atau berpindah membuka dari laptop.
*   **Report System / Laporkan Properti Berbohong:** Laporkan Listing palsu! Dengan sekali tekan di halaman terbawah profil kos, pengguna bisa memblokir penipuan untuk membantu pengguna lainnya sebelum jatuh korban. Tombol diamankan fitur *rate limiting* canggih dari backend.
*   **Sistem Ulasan & Reputasi Terbuka:** Transparansi adalah kunci. Pengguna bisa memberikan Rating bintang dan naratif ulasan untuk membantu pencari lain membedakan kos "Aman" dan kos "Bermasalah".
*   **Email Alert Kawasan Favorit:** Jangan sampai keduluan! Pengguna bisa mendaftar notifikasi otomatis yang akan mengirim "E-Katalog" kos baru per-area pilihan mereka langsung ke Inbox setiap pagi.

## 2. Modul Pemilik Properti Kos (Mitra Owner) 🏠

Fokus utama kami merancang dasbor ini adalah membuat bisnis hunian rumahan berasa di-managerial layaknya hotel berbintang.
*   **Kurba Grafik Data Analisis Cerdas (Recharts):** Data "Kos Dilihat" vs "WhatsApp di Klik" bukan saja tergeletak sebagai teks mati. Terekam dan digeser dalam bentuk plot grafik kartesius di dashboard (sirkulasi grafik 7 hari terakhir - yang menandakan naik turunnya traksi pasar kos mereka).
*   **Tolak-Ukur Skor Identitas (Gamifikasi *Profile Progress*):** Jika KYC atau kos mereka kosong, *progress bar* merah/kuning terus menghantui dasbor sebagai pengingat. Ini memaksa kepatuhan standard *Trust & Safety* secara psikologis bawah sadar.
*   **One-Tap Toggle Availability:** Jika kos penuh malam ini, pemiik tidak perlu masuk ke panel edit data rumit. Ada UI mirip sistem *Smart Home* di beranda untuk sekadar menutup/mematikan penayangan kos dari etalase.
*   **Proteksi Akun Spam (Limit Login KYC):** Para kompetitor/hacker dilarang mendaftarkan spam berkas, dikawal kuat lewat sistem *throttle* Laravel yang melarang tembakan file bertubi-tubi.
*   **Multi-Aspect Gallery Showcase:** Pemilik bebas mengunggah hingga 8 foto ekstra untuk memamerkan detail tiap sudut kamar, kamar mandi, hingga area parkir, meningkatkan konversi klik hingga 300%.

## 3. Komando Super Admin (Moderasi Manokos) 👨‍⚖️

Admin adalah Tuhan dalam *environment* data properti, dibekali dasbor khusus untuk mengatur kemudi seluruh katalog.
*   **Inspektorat Dokumen *Know Your Customer (KYC)*:** Menganulir atau Meng-*Approve* KTP & SHM Mitra sebelum mengizinkan penayangan properti mereka ke khalayak publik.
*   **Katalog *Boost / Unggulan*:** Properti Mitra yang berlangganan berbayar dapat ditekan status *Boosted*-nya untuk terus menduduki Top 5 di semua rekomendasi / sortir pencarian.
*   **Pusat Operasional Log Aplikasi (Changelog Modulator):** Mengatur seluruh pembaruan/notasi update dari Manokos pada panel yang terkoneksi langsung dengan UI publik *"Yang Terbaru Malam Ini"* di menu pengguna biasa.

## 4. Inovasi Platform & Performa 🚀

Manokos didesain bukan sekadar website, tapi aplikasi yang "hidup" di perangkat pengguna.
*   **Teknologi PWA (Progressive Web App):** Bisa diinstal di Android/iOS tanpa AppStore. Mendukung *Offline Shell* yang membuat aplikasi terasa cepat dan aksesibel meski sinyal Jambi sedang tidak stabil.
*   **Otomasi SEO (Search Engine Optimization):** Strategi *Pre-rendering* statis per-kecamatan untuk memastikan ketika orang mencari "Kos Mendalo Jambi" di Google, Manokos bertengger di urutan teratas.
*   **Smart Cache Management:** Menggunakan *TanStack Query* untuk memastikan data yang ditampilkan selalu segar namun tidak boros kuota data pengguna.
