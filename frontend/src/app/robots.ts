import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/owner/', '/admin/', '/akun/'],
      },
    ],
    sitemap: 'https://manokos.id/sitemap.xml',
  };
}
