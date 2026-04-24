<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Property;
use App\Models\PropertyStat;
use App\Models\Facility;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DummyDataSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Admin
        User::updateOrCreate(
            ['email' => 'admin@swarnatech.com'],
            [
                'name' => 'Admin Manokos',
                'phone' => '081234567890',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]
        );

        // 2. Create Owners
        $owner1 = User::updateOrCreate(
            ['email' => 'owner1@gmail.com'],
            [
                'name' => 'Haji Lukman',
                'phone' => '085266778899',
                'password' => Hash::make('password'),
                'role' => 'owner',
            ]
        );

        $owner2 = User::updateOrCreate(
            ['email' => 'owner2@gmail.com'],
            [
                'name' => 'Ibu Sari',
                'phone' => '081399001122',
                'password' => Hash::make('password'),
                'role' => 'owner',
            ]
        );

        // 2.1 Create Seeker Users (Role: user)
        $seekers = [
            ['name' => 'Budi Santoso', 'email' => 'budi@gmail.com'],
            ['name' => 'Siti Aminah', 'email' => 'siti@gmail.com'],
            ['name' => 'Rian Hidayat', 'email' => 'rian@gmail.com'],
            ['name' => 'Dewi Lestari', 'email' => 'dewi@gmail.com'],
            ['name' => 'Andi Wijaya', 'email' => 'andi@gmail.com'],
        ];

        foreach ($seekers as $s) {
            User::updateOrCreate(
                ['email' => $s['email']],
                [
                    'name' => $s['name'],
                    'phone' => '0812' . rand(11111111, 99999999),
                    'password' => Hash::make('password'),
                    'role' => 'user',
                ]
            );
        }

        // 3. Get All Facilities
        $facilities = Facility::all();

        // 4. Dummy Properties Data
        $propertiesData = [
            [
                'owner_id' => $owner1->id,
                'title' => 'Kos Mendalo Asri – Dekat UNJA',
                'type' => 'campur',
                'price_monthly' => 850000,
                'price_yearly' => 9000000,
                'area' => 'Mendalo',
                'address' => 'Jl. Jambi-Ma. Bulian KM. 15, Mendalo Indah',
                'lat' => -1.6212,
                'lng' => 103.5222,
                'is_verified' => true,
                'is_boosted' => true,
            ],
            [
                'owner_id' => $owner2->id,
                'title' => 'Kos Putri Melati Sipin',
                'type' => 'putri',
                'price_monthly' => 1200000,
                'price_yearly' => 13000000,
                'area' => 'Sipin',
                'address' => 'Jl. Kolonel Abunjani, Sipin, Kota Jambi',
                'lat' => -1.6055,
                'lng' => 103.5899,
                'is_verified' => true,
                'is_boosted' => false,
            ],
            [
                'owner_id' => $owner1->id,
                'title' => 'Kontrakan Exclusive Telanaipura',
                'type' => 'campur',
                'price_monthly' => 2500000,
                'price_yearly' => 28000000,
                'area' => 'Telanaipura',
                'address' => 'Kawasan Perkantoran Gubernur Jambi',
                'lat' => -1.6122,
                'lng' => 103.5788,
                'is_verified' => true,
                'is_boosted' => true,
            ],
            [
                'owner_id' => $owner2->id,
                'title' => 'Kos Putra Graha Mendalo',
                'type' => 'putra',
                'price_monthly' => 600000,
                'price_yearly' => 6500000,
                'area' => 'Mendalo',
                'address' => 'Belakang Kampus UNJA Mendalo',
                'lat' => -1.6255,
                'lng' => 103.5244,
                'is_verified' => true,
                'is_boosted' => false,
            ],
            [
                'owner_id' => $owner1->id,
                'title' => 'D’Green Residence Kota Baru',
                'type' => 'campur',
                'price_monthly' => 1500000,
                'price_yearly' => 16500000,
                'area' => 'Kota Baru',
                'address' => 'Dekat Tugu Keris Siginjai',
                'lat' => -1.6322,
                'lng' => 103.6011,
                'is_verified' => true,
                'is_boosted' => false,
            ],
            [
                'owner_id' => $owner2->id,
                'title' => 'Kos Murah Mayang Mangurai',
                'type' => 'putra',
                'price_monthly' => 500000,
                'price_yearly' => 5500000,
                'area' => 'Sipin',
                'address' => 'Jl. Ir. H. Juanda, Mayang Mangurai',
                'lat' => -1.6188,
                'lng' => 103.5722,
                'is_verified' => true,
                'is_boosted' => false,
            ],
            [
                'owner_id' => $owner1->id,
                'title' => 'Exclusive Room Pasir Putih',
                'type' => 'campur',
                'price_monthly' => 1800000,
                'price_yearly' => 20000000,
                'area' => 'Jambi Selatan',
                'address' => 'Dekat Bandara Sultan Thaha',
                'lat' => -1.6411,
                'lng' => 103.6322,
                'is_verified' => true,
                'is_boosted' => true,
            ],
            [
                'owner_id' => $owner2->id,
                'title' => 'Kos Syariah Jelutung',
                'type' => 'putri',
                'price_monthly' => 950000,
                'price_yearly' => 10500000,
                'area' => 'Sipin',
                'address' => 'Kawasan Jelutung, Kota Jambi',
                'lat' => -1.6099,
                'lng' => 103.6088,
                'is_verified' => true,
                'is_boosted' => false,
            ],
            [
                'owner_id' => $owner1->id,
                'title' => 'Kost Vira Mendalo',
                'type' => 'putri',
                'price_monthly' => 750000,
                'price_yearly' => 8000000,
                'area' => 'Mendalo',
                'address' => 'Samping Gerbang Utama UNJA',
                'lat' => -1.6200,
                'lng' => 103.5200,
                'is_verified' => true,
                'is_boosted' => false,
            ],
            [
                'owner_id' => $owner2->id,
                'title' => 'Grand Jambi Housing',
                'type' => 'campur',
                'price_monthly' => 3000000,
                'price_yearly' => 35000000,
                'area' => 'Kota Baru',
                'address' => 'Blok A, Perumahan Grand Jambi',
                'lat' => -1.6400,
                'lng' => 103.6100,
                'is_verified' => true,
                'is_boosted' => false,
            ],
        ];

        foreach ($propertiesData as $data) {
            $slug = Str::slug($data['title']);
            $property = Property::updateOrCreate(
                ['slug' => $slug],
                [
                    'owner_id' => $data['owner_id'],
                    'title' => $data['title'],
                    'description' => "Kos dengan lingkungan nyaman dan aman di wilayah " . $data['area'] . ". Fasilitas lengkap, akses mudah ke pusat kota dan kampus. Cocok untuk mahasiswa dan pekerja.",
                    'type' => $data['type'],
                    'price_monthly' => $data['price_monthly'],
                    'price_yearly' => $data['price_yearly'],
                    'address' => $data['address'],
                    'area' => $data['area'],
                    'latitude' => $data['lat'],
                    'longitude' => $data['lng'],
                    'is_verified' => $data['is_verified'],
                    'is_boosted' => $data['is_boosted'],
                    'status' => 'active',
                    'whatsapp_number' => '628123456789',
                    'main_image' => 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=400',
                    'gallery' => [
                        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800',
                        'https://images.unsplash.com/photo-1502672260266-1c1de2d93688?auto=format&fit=crop&q=80&w=800'
                    ],
                ]
            );

            // Sync mapping facilities randomly (3-6 facilities each)
            $property->facilities()->sync(
                $facilities->random(rand(3, 6))->pluck('id')->toArray()
            );

            // 5. Create Dummy Stats for the last 7 days
            for ($i = 0; $i < 7; $i++) {
                PropertyStat::create([
                    'property_id' => $property->id,
                    'date' => now()->subDays($i)->format('Y-m-d'),
                    'views' => rand(10, 50),
                    'whatsapp_clicks' => rand(1, 10),
                ]);
            }
        }
    }
}
