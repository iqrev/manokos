import type { Metadata } from 'next';
import { JAMBI_AREAS } from '@/types';
import { notFound } from 'next/navigation';
import AreaSearchPage from './AreaSearchPage';

type Props = { params: Promise<{ area: string }> };

// Prerender semua area saat build
export async function generateStaticParams() {
  return JAMBI_AREAS.map(area => ({
    area: area.toLowerCase().replace(/\s+/g, '-'),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { area } = await params;
  const areaName = JAMBI_AREAS.find(
    a => a.toLowerCase().replace(/\s+/g, '-') === area
  );

  if (!areaName) return { title: 'Area tidak ditemukan | Manokos' };

  const title = `Kos di ${areaName} Jambi – Harga Terjangkau | Manokos`;
  const description = `Temukan kos putra, putri & campur di ${areaName}, Jambi. Harga terjangkau, fasilitas lengkap, kontak pemilik langsung via WhatsApp. Cek listing terbaru di Manokos.`;

  return {
    title,
    description,
    keywords: `kos di ${areaName} Jambi, kos ${areaName}, kos murah ${areaName}, kos mahasiswa ${areaName} Jambi`,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'id_ID',
      siteName: 'Manokos',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    alternates: {
      canonical: `https://manokos.id/kos/${area}`,
    },
  };
}

export default async function AreaPage({ params }: Props) {
  const { area } = await params;
  const areaName = JAMBI_AREAS.find(
    a => a.toLowerCase().replace(/\s+/g, '-') === area
  );

  if (!areaName) notFound();

  return <AreaSearchPage areaName={areaName} />;
}
