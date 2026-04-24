// Utility to merge class names, handling conditional expressions cleanly
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

// Format price to Rp format
export function formatPrice(price: number): string {
  if (price >= 1000000) {
    return `Rp ${(price / 1000000).toFixed(price % 1000000 === 0 ? 0 : 1)}jt`;
  }
  if (price >= 1000) {
    return `Rp ${(price / 1000).toFixed(0)}rb`;
  }
  return `Rp ${price.toLocaleString('id-ID')}`;
}

// Format phone to WhatsApp link
export function toWhatsAppUrl(phone: string, message?: string): string {
  const cleaned = phone.replace(/\D/g, '').replace(/^0/, '62');
  const encoded = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${cleaned}${encoded}`;
}

// Build WhatsApp message template for a property
export function buildWhatsAppMessage(propertyTitle: string): string {
  return `Halo Kak, saya tertarik dengan kos *"${propertyTitle}"* yang saya lihat di Manokos. Apakah masih tersedia? Boleh saya tahu info lebih lanjut? 🙏`;
}

// Capitalize type
export function formatType(type: string): string {
  const map: Record<string, string> = { putra: 'Putra', putri: 'Putri', campur: 'Campur' };
  return map[type] ?? type;
}
