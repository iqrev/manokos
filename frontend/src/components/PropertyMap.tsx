'use client';

import { useEffect, useRef } from 'react';
import { Property } from '@/types';
import { formatPrice } from '@/lib/utils';

interface PropertyMapProps {
  properties?: Property[];
  property?: Property;
  center?: [number, number];
  zoom?: number;
  locationPicker?: boolean;
  onLocationPick?: (lat: number, lng: number) => void;
  className?: string;
}

const JAMBI_CENTER: [number, number] = [-1.6101, 103.6131];
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';

function getImageUrl(path?: string) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${BACKEND_URL}/storage/${path}`;
}

/** Google Maps-style teardrop SVG pin */
function buildGMapsPin(color: string, border: string) {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="44" viewBox="0 0 32 44">
      <path d="M16 0C7.164 0 0 7.163 0 16c0 10.633 13.553 25.89 15.156 27.694a1.116 1.116 0 001.688 0C18.447 41.89 32 26.633 32 16 32 7.163 24.836 0 16 0z"
        fill="${color}" stroke="${border}" stroke-width="1.5"/>
      <circle cx="16" cy="16" r="7" fill="white" opacity="0.95"/>
    </svg>`;
}

/** Boosted star pin */
function buildBoostedPin() {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="48" viewBox="0 0 36 48">
      <path d="M18 0C8.059 0 0 8.059 0 18c0 11.963 15.25 29.127 17.051 31.155a1.255 1.255 0 001.898 0C20.75 47.127 36 29.963 36 18 36 8.059 27.941 0 18 0z"
        fill="#f59e0b" stroke="#d97706" stroke-width="1.5"/>
      <circle cx="18" cy="18" r="9" fill="white" opacity="0.95"/>
      <text x="18" y="22.5" text-anchor="middle" font-size="12" fill="#d97706" font-family="sans-serif">★</text>
    </svg>`;
}

/** Location picker pin (Google Maps drop pin style) */
function buildPickerPin() {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="52" viewBox="0 0 36 52">
      <filter id="shadow" x="-20%" y="-10%" width="140%" height="140%">
        <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#00000040"/>
      </filter>
      <path d="M18 0C8.059 0 0 8.059 0 18c0 11.963 15.25 29.127 17.051 31.155a1.255 1.255 0 001.898 0C20.75 47.127 36 29.963 36 18 36 8.059 27.941 0 18 0z"
        fill="#1a73e8" stroke="#1557b0" stroke-width="1.5" filter="url(#shadow)"/>
      <circle cx="18" cy="18" r="8" fill="white" opacity="0.95"/>
      <circle cx="18" cy="18" r="4" fill="#1a73e8"/>
    </svg>`;
}

export default function PropertyMap({
  properties = [],
  property,
  center,
  zoom = 14,
  locationPicker = false,
  onLocationPick,
  className = '',
}: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<unknown>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    let L: typeof import('leaflet');
    let map: any;

    async function init() {
      L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');

      if (!leafletMapRef.current) {
        const mapCenter = center ||
          (property?.latitude && property?.longitude
            ? [parseFloat(property.latitude), parseFloat(property.longitude)] as [number, number]
            : JAMBI_CENTER);

        map = L.map(mapRef.current!, {
          center: mapCenter,
          zoom,
          zoomControl: false,
          attributionControl: false,
        });

        L.tileLayer(
          'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
          {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OSM</a> © <a href="https://carto.com/">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20,
            detectRetina: true,
          }
        ).addTo(map);

        L.control.zoom({ position: 'bottomright' }).addTo(map);
        L.control.attribution({ position: 'bottomleft', prefix: false }).addTo(map);
        leafletMapRef.current = map;
      } else {
        map = leafletMapRef.current;
      }

      // Clear existing markers/layers minus the tile layer
      map.eachLayer((layer: any) => {
        if (layer instanceof L.Marker || layer instanceof L.Circle) {
          map.removeLayer(layer);
        }
      });

      // MODE 1: Single property detail view
      if (property?.latitude && property?.longitude) {
        const lat = parseFloat(property.latitude);
        const lng = parseFloat(property.longitude);

        L.circle([lat, lng], {
          color: '#1a73e8',
          fillColor: '#1a73e8',
          fillOpacity: 0.10,
          weight: 2,
          dashArray: '8 5',
          radius: 180,
        }).addTo(map);

        const pinIcon = L.divIcon({
          className: '',
          html: buildGMapsPin('#0f9b98', '#0a6867'),
          iconSize: [32, 44],
          iconAnchor: [16, 44],
          popupAnchor: [0, -48],
        });

        const imgUrl = getImageUrl(property.main_image);
        const marker = L.marker([lat, lng], { icon: pinIcon }).addTo(map);
        marker.bindPopup(
          `<div class="gmaps-popup">
            ${imgUrl ? `<img src="${imgUrl}" class="gmaps-popup-img" alt="${property.title}" onerror="this.style.display='none'"/>` : ''}
            <div class="gmaps-popup-body">
              <p class="gmaps-popup-title">${property.title}</p>
              <p class="gmaps-popup-sub">📍 ${property.area}</p>
              <p class="gmaps-popup-price">${formatPrice(property.price_monthly)}<span>/bulan</span></p>
            </div>
          </div>`,
          { maxWidth: 240, className: 'gmaps-popup-wrapper' }
        ).openPopup();
        
        if (!center) map.setView([lat, lng], zoom);
      }

      // MODE 2: Multi-property search view
      if (properties.length > 0) {
        const coords: [number, number][] = [];

        properties.forEach((p) => {
          if (!p.latitude || !p.longitude) return;
          const lat = parseFloat(p.latitude);
          const lng = parseFloat(p.longitude);
          coords.push([lat, lng]);

          const imgUrl = getImageUrl(p.main_image);
          const pillIcon = L.divIcon({
            className: '',
            html: `<div class="gm-pill${p.is_boosted ? ' gm-pill--boosted' : ''}">
                     ${formatPrice(p.price_monthly)}
                   </div>`,
            iconSize: [88, 32],
            iconAnchor: [44, 44],
            popupAnchor: [0, -46],
          });

          const marker = L.marker([lat, lng], { icon: pillIcon }).addTo(map);
          marker.bindPopup(
            `<div class="gmaps-popup">
              ${imgUrl
                ? `<img src="${imgUrl}" class="gmaps-popup-img" alt="${p.title}" onerror="this.style.display='none'"/>`
                : `<div class="gmaps-popup-img-placeholder">🏠</div>`
              }
              <div class="gmaps-popup-body">
                <p class="gmaps-popup-title">${p.title}</p>
                <p class="gmaps-popup-sub">📍 ${p.area}</p>
                <p class="gmaps-popup-price">${formatPrice(p.price_monthly)}<span>/bulan</span></p>
                <a href="/kos/${p.id}" class="gmaps-popup-btn">Lihat Detail →</a>
              </div>
            </div>`,
            { maxWidth: 240, className: 'gmaps-popup-wrapper' }
          );

          marker.on('popupopen', () => {
            const el = marker.getElement();
            el?.querySelector('.gm-pill')?.classList.add('gm-pill--active');
          });
          marker.on('popupclose', () => {
            const el = marker.getElement();
            el?.querySelector('.gm-pill')?.classList.remove('gm-pill--active');
          });
        });

        if (coords.length > 0 && !center && !property) {
          if (coords.length === 1) {
            map.setView(coords[0], zoom);
          } else {
            map.fitBounds(L.latLngBounds(coords), { padding: [48, 48] });
          }
        }
      }

      // MODE 3: Location picker
      if (locationPicker) {
        const pickerIcon = L.divIcon({
          className: '',
          html: buildPickerPin(),
          iconSize: [36, 52],
          iconAnchor: [18, 52],
        });

        const dragMarker = L.marker(map.getCenter(), {
          draggable: true,
          icon: pickerIcon,
        }).addTo(map);

        dragMarker.on('dragend', () => {
          const pos = dragMarker.getLatLng();
          onLocationPick?.(pos.lat, pos.lng);
        });

        map.on('click', (e: any) => {
          dragMarker.setLatLng(e.latlng);
          onLocationPick?.(e.latlng.lat, e.latlng.lng);
        });

        if (onLocationPick) onLocationPick(map.getCenter().lat, map.getCenter().lng);
      }
    }

    init();

    return () => {
      // We don't remove the map here because we want to reuse it, 
      // but maybe we should if the component unmounts completely.
      // However, for Next.js soft navigation, keeping it might be tricky.
      // Let's keep the cleanup for when the component really unmounts.
    };
  }, [properties, property, center, zoom, locationPicker]);
 // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={mapRef}
      className={`w-full ${className}`}
      style={{ minHeight: '280px', borderRadius: 'var(--radius-card)', overflow: 'hidden' }}
      aria-label="Peta Lokasi"
    />
  );
}
