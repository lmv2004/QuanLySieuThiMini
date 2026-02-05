<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SanPhamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $loaiIds = \App\Models\LoaiSanPham::pluck('MALOAI')->toArray();
        $nccIds = \App\Models\NhaCungCap::pluck('MANCC')->toArray();

        \App\Models\SanPham::factory(100)->create([
            'MALOAI' => fake()->randomElement($loaiIds),
            'MANCC' => fake()->randomElement($nccIds),
        ]);
    }
}
