<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TaiKhoanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $nhanViens = \App\Models\NhanVien::all();

        foreach ($nhanViens as $nhanVien) {
            \App\Models\TaiKhoan::factory()->create([
                'MANV' => $nhanVien->MANV,
                'TENTK' => 'user' . $nhanVien->MANV,
                'EMAIL' => 'user' . $nhanVien->MANV . '@example.com',
                'MATKHAU' => bcrypt('password123'),
            ]);
        }
    }
}
