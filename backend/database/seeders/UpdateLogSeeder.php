<?php

namespace Database\Seeders;

use App\Models\UpdateLog;
use Illuminate\Database\Seeder;

class UpdateLogSeeder extends Seeder
{
    public function run(): void
    {
        $logs = [
            [
                'version' => '1.2.0',
                'title' => 'Admin Dashboard Overhaul & Analytics',
                'description' => "Pembaruan besar pada panel admin:\n- Dashboard baru dengan grafik interaksi (Views & Clicks).\n- Manajemen User lengkap dengan fitur ganti role & hapus user.\n- Statistik komposisi tipe kos (Putra/Putri/Campur).\n- Perbaikan performa loading data verifikasi.",
                'type' => 'feature',
                'is_published' => true,
                'release_date' => now()->format('Y-m-d'),
            ],
            [
                'version' => '1.1.0',
                'title' => 'Enhanced Map & Visual UI',
                'description' => "Peningkatan pengalaman visual:\n- Peta Leaflet dengan gaya Google Maps (CartoDB Voyager).\n- Marker kustom bergaya droplet dengan harga.\n- Animasi transisi antar halaman.\n- Perbaikan bug pada sistem bookmark.",
                'type' => 'improvement',
                'is_published' => true,
                'release_date' => now()->subDays(3)->format('Y-m-d'),
            ],
            [
                'version' => '1.0.0',
                'title' => 'Manokos MVP Launch',
                'description' => "Peluncuran perdana platform Manokos:\n- Direktori kos wilayah Jambi.\n- Sistem verifikasi KYC Pemilik.\n- Integrasi WhatsApp untuk pemesanan.\n- Mobile-first responsive design.",
                'type' => 'feature',
                'is_published' => true,
                'release_date' => now()->subDays(10)->format('Y-m-d'),
            ],
        ];

        foreach ($logs as $log) {
            UpdateLog::updateOrCreate(
                ['version' => $log['version']],
                $log
            );
        }
    }
}
