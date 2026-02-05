<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TonKhoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sanPhamIds = \App\Models\SanPham::pluck('MASP')->toArray();
        $phieuNhapIds = \App\Models\PhieuNhap::pluck('MAPHIEU')->toArray();

        foreach ($phieuNhapIds as $phieuId) {
            // Mỗi phiếu nhập có 3-7 sản phẩm
            $numProducts = rand(3, 7);
            for ($i = 0; $i < $numProducts; $i++) {
                \App\Models\TonKho::factory()->create([
                    'MASP' => fake()->randomElement($sanPhamIds),
                    'MAPHIEUNHAP' => $phieuId,
                ]);
            }
        }
    }
}
