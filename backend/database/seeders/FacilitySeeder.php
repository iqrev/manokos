<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FacilitySeeder extends Seeder
{
    public function run(): void
    {
        $facilities = [
            ['name' => 'AC', 'icon' => 'AirVent'],
            ['name' => 'WiFi', 'icon' => 'Wifi'],
            ['name' => 'Kamar Mandi Dalam', 'icon' => 'ShowerHead'],
            ['name' => 'Parkir Motor', 'icon' => 'Bike'],
            ['name' => 'Parkir Mobil', 'icon' => 'Car'],
            ['name' => 'Dapur', 'icon' => 'ChefHat'],
            ['name' => 'Lemari', 'icon' => 'Package'],
            ['name' => 'Kasur', 'icon' => 'Bed'],
            ['name' => 'TV', 'icon' => 'Tv'],
            ['name' => 'Listrik', 'icon' => 'Zap'],
            ['name' => 'Air', 'icon' => 'Droplets'],
            ['name' => 'Laundry', 'icon' => 'WashingMachine'],
            ['name' => 'CCTV', 'icon' => 'Camera'],
            ['name' => 'Penjaga', 'icon' => 'Shield'],
        ];

        foreach ($facilities as $f) {
            DB::table('facilities')->insertOrIgnore([
                ...$f,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
