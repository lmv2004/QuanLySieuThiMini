<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class GiamGiaSPSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sanPhamIds = \App\Models\SanPham::pluck('MASP')->toArray();

        for ($i = 0; $i < 20; $i++) {
            \App\Models\GiamGiaSP::factory()->create([
                'MASP' => fake()->randomElement($sanPhamIds),
            ]);
        }
    }
}
