import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

  try {
    const res = await fetch(`${API}/properties/${id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error();
    const property = await res.json();

    const price = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(property.price_monthly);

    const title = `${property.title} – ${property.area} | Manokos`;
    const description = `Kos ${property.type} di ${property.area}, Jambi. Harga mulai ${price}/bulan. Fasilitas: ${
      property.facilities?.map((f: { name: string }) => f.name).join(', ') || 'lengkap'
    }. Hubungi pemilik langsung via WhatsApp.`;

    const imageUrl = property.main_image
      ? `${API.replace('/api', '')}/storage/${property.main_image}`
      : undefined;

    return {
      title,
      description,
      keywords: `kos ${property.area} Jambi, kos ${property.type}, ${property.title}`,
      openGraph: {
        title,
        description,
        type: 'website',
        locale: 'id_ID',
        siteName: 'Manokos',
        images: imageUrl ? [{ url: imageUrl, width: 800, height: 600, alt: property.title }] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: imageUrl ? [imageUrl] : [],
      },
    };
  } catch {
    return {
      title: 'Detail Kos | Manokos',
      description: 'Cari kos dan kontrakan terpercaya di Jambi.',
    };
  }
}

export { default } from './page';
