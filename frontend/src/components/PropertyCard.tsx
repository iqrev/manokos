import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Star } from 'lucide-react';
import { Property, FACILITY_ICONS } from '@/types';
import { formatPrice, formatType, cn } from '@/lib/utils';

interface PropertyCardProps {
  property: Property;
  variant?: 'grid' | 'horizontal';
  className?: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';

function getImageUrl(path?: string) {
  if (!path) return '/placeholder-kos.jpg';
  if (path.startsWith('http')) return path;
  return `${BACKEND_URL}/storage/${path}`;
}

export default function PropertyCard({ property, variant = 'grid', className }: PropertyCardProps) {
  const imageUrl = getImageUrl(property.main_image);
  const typeColor = property.type === 'putra' ? 'badge-putra' : property.type === 'putri' ? 'badge-putri' : 'badge-campur';

  if (variant === 'horizontal') {
    return (
      <Link href={`/kos/${property.id}`} id={`card-${property.id}`}>
        <div className={cn('card w-64', className)}>
          {/* Image */}
          <div className="relative w-full h-36 overflow-hidden">
            <Image
              src={imageUrl}
              alt={property.title}
              fill
              className="object-cover"
              unoptimized={imageUrl.startsWith('http')}
            />
            {property.is_boosted && (
              <span className="absolute top-2 left-2 badge" style={{ background: '#fef3c7', color: '#d97706' }}>
                ⭐ Unggulan
              </span>
            )}
          </div>

          {/* Content */}
          <div className="p-3">
            <span className={cn('badge text-xs mb-1', typeColor)}>
              Kos {formatType(property.type)}
            </span>
            <h3 className="font-700 text-[14px] text-[var(--color-text-primary)] leading-tight mt-1 line-clamp-2">
              {property.title}
            </h3>
            <div className="flex items-center gap-1 mt-1.5 text-[var(--color-text-muted)]">
              <MapPin size={11} />
              <span className="text-[12px]">{property.area}</span>
            </div>
            <p className="mt-2 font-800 text-[var(--color-primary-500)] text-[15px]">
              {formatPrice(property.price_monthly)}
              <span className="text-[11px] font-500 text-[var(--color-text-muted)]">/bln</span>
            </p>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/kos/${property.id}`} id={`card-${property.id}`} className="block">
      <div className={cn('card h-full', className)}>
        {/* Image */}
        <div className="relative w-full h-48 overflow-hidden">
          <Image
            src={imageUrl}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized={imageUrl.startsWith('http')}
          />
          {property.is_boosted && (
            <span className="absolute top-3 left-3 badge" style={{ background: '#fef3c7', color: '#d97706', fontSize: '11px' }}>
              ⭐ Unggulan
            </span>
          )}
          {!property.is_verified && (
            <span className="absolute top-3 right-3 badge badge-pending" style={{ fontSize: '11px' }}>
              Menunggu Verif.
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className={cn('badge', typeColor)}>
              Kos {formatType(property.type)}
            </span>
          </div>

          <h3 className="font-700 text-[15px] text-[var(--color-text-primary)] leading-snug line-clamp-2">
            {property.title}
          </h3>

          <div className="flex items-center gap-1 mt-2 text-[var(--color-text-muted)]">
            <MapPin size={12} />
            <span className="text-[13px]">{property.address ? `${property.area} · ${property.address.substring(0, 30)}...` : property.area}</span>
          </div>

          {/* Facilities (first 3) */}
          {property.facilities?.length > 0 && (
            <div className="flex gap-1.5 mt-2 flex-wrap">
              {property.facilities.slice(0, 3).map(f => (
                <span key={f.id} className="text-[11px] px-2 py-0.5 bg-gray-100 rounded-full text-[var(--color-text-secondary)] font-500">
                  {f.name}
                </span>
              ))}
              {property.facilities.length > 3 && (
                <span className="text-[11px] px-2 py-0.5 bg-gray-100 rounded-full text-[var(--color-text-muted)]">
                  +{property.facilities.length - 3}
                </span>
              )}
            </div>
          )}

          <div className="mt-3 flex items-end justify-between">
            <div>
              <p className="font-800 text-[var(--color-primary-500)] text-[17px] leading-none">
                {formatPrice(property.price_monthly)}
              </p>
              <p className="text-[12px] text-[var(--color-text-muted)] mt-0.5">per bulan</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
