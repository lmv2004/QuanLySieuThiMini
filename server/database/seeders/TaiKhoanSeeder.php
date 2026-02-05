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
        $nhanVienIds = \App\Models\NhanVien::pluck('MANV')->toArray();

        foreach ($nhanVienIds as $manv) {
            \App\Models\TaiKhoan::factory()->create([
                'MANV' => $manv,
                'TENTK' => 'user' . $manv,
            ]);
        }
    }
}
