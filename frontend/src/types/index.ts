export interface Facility {
  id: number;
  name: string;
  icon?: string;
}

export interface PropertyOwner {
  id: number;
  name: string;
  phone?: string;
}

export interface Property {
  id: number;
  owner_id: number;
  title: string;
  slug: string;
  description: string;
  type: 'putra' | 'putri' | 'campur';
  price_monthly: number;
  price_yearly?: number;
  address: string;
  area: string;
  latitude?: string;
  longitude?: string;
  main_image?: string;
  gallery?: string[];
  is_verified: boolean;
  is_boosted: boolean;
  status: 'active' | 'inactive';
  whatsapp_number: string;
  facilities: Facility[];
  owner: PropertyOwner;
  created_at: string;
  updated_at: string;
}

export interface PaginatedProperties {
  data: Property[];
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'owner' | 'user';
  kyc?: KycRecord;
}

export interface KycRecord {
  id: number;
  owner_id: number;
  ktp_path: string;
  document_path: string;
  status: 'pending' | 'verified' | 'rejected';
  admin_notes?: string;
  owner?: User;
  created_at: string;
}

export interface PropertyStat {
  id: number;
  property_id: number;
  date: string;
  views: number;
  whatsapp_clicks: number;
}

export interface PropertyFilterParams {
  area?: string;
  type?: string;
  min_price?: number;
  max_price?: number;
  page?: number;
  per_page?: number;
}

export const JAMBI_AREAS = [
  'Mendalo',
  'Telanaipura',
  'Sipin',
  'Kota Baru',
  'Alam Barajo',
  'Jambi Selatan',
  'Jambi Timur',
  'Layang',
  'Paal Merah',
  'Thehok',
];

export const FACILITY_ICONS: Record<string, string> = {
  'AC': 'AirVent',
  'WiFi': 'Wifi',
  'Kamar Mandi Dalam': 'ShowerHead',
  'Parkir Motor': 'Bike',
  'Parkir Mobil': 'Car',
  'Dapur': 'ChefHat',
  'Lemari': 'Package',
  'Kasur': 'Bed',
  'TV': 'Tv',
  'Listrik': 'Zap',
  'Air': 'Droplets',
  'Laundry': 'WashingMachine',
  'CCTV': 'Camera',
  'Penjaga': 'Shield',
};
