import type { MetadataRoute } from 'next';
import { JAMBI_AREAS } from '@/types';

export default function sitemap(): MetadataRoute.Sitemap {
  const BASE = 'https://manokos.id';

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: 'daily', priority: 1 },
    { url: `${BASE}/cari`, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${BASE}/login`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE}/daftar`, changeFrequency: 'monthly', priority: 0.4 },
    // SEO landing pages per kecamatan – clean URL, prerendered statically
    ...JAMBI_AREAS.map(area => ({
      url: `${BASE}/kos/area/${area.toLowerCase().replace(/\s+/g, '-')}`,
      changeFrequency: 'daily' as const,
      priority: 0.85,
    })),
  ];

  return staticRoutes;
}
