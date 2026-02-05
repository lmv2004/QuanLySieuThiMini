<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PhieuNhapSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $nhanVienIds = \App\Models\NhanVien::pluck('MANV')->toArray();

        \App\Models\PhieuNhap::factory(30)->create([
            'MANV' => fake()->randomElement($nhanVienIds),
        ]);
    }
}
