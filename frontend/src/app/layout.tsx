import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import ReactQueryProvider from '@/components/ReactQueryProvider';

export const metadata: Metadata = {
  title: 'Manokos – Direktori Kos & Kontrakan Terpercaya di Jambi',
  description: 'Temukan kos dan kontrakan terbaik di Jambi. Cari berdasarkan lokasi (Mendalo, Sipin, Telanaipura), harga, dan fasilitas. Terhubung langsung dengan pemilik via WhatsApp.',
  keywords: 'kos Jambi, kontrakan Jambi, cari kos Mendalo, kos Telanaipura, kos Sipin, kos mahasiswa Jambi',
  manifest: '/manifest.json',
  openGraph: {
    title: 'Manokos – Direktori Kos Jambi',
    description: 'Cari kos terverifikasi di Jambi dengan mudah.',
    url: 'https://manokos.id',
    siteName: 'Manokos',
    locale: 'id_ID',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0f9b98',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <ReactQueryProvider>
          <AuthProvider>
            <Navbar />
            <main className="min-h-screen">
              {children}
            </main>
            <BottomNav />
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
