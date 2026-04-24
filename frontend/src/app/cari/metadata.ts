import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cari Kos di Jambi | Manokos',
  description:
    'Cari dan filter kos di Mendalo, Telanaipura, Sipin, Kota Baru, dan area Jambi lainnya. Kos Putra, Putri, atau Campur dengan harga terjangkau.',
  keywords: 'cari kos Jambi, kos Mendalo, kos Telanaipura, kos Sipin, kos mahasiswa Jambi, kontrakan Jambi',
  openGraph: {
    title: 'Cari Kos di Jambi – Manokos',
    description: 'Filter berdasarkan area, harga, dan fasilitas. Lihat pada peta interaktif.',
    locale: 'id_ID',
    type: 'website',
    siteName: 'Manokos',
  },
};

export { default } from './page';
