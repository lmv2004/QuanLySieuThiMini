<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CTPhieuNhapSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $phieuNhaps = \App\Models\PhieuNhap::all();
        $sanPhamIds = \App\Models\SanPham::pluck('MASP')->toArray();

        foreach ($phieuNhaps as $phieu) {
            // Mỗi phiếu nhập có 3-7 sản phẩm
            $numProducts = rand(3, 7);
            $selectedProducts = fake()->randomElements($sanPhamIds, $numProducts);

            foreach ($selectedProducts as $masp) {
                \App\Models\CTPhieuNhap::create([
                    'MAPHIEU' => $phieu->MAPHIEU,
                    'MASP' => $masp,
                    'SOLUONG' => rand(10, 500),
                    'DONGIANHAP' => rand(5000, 400000),
                    'HANSUDUNG' => fake()->optional()->dateTimeBetween('now', '+2 years'),
                ]);
            }
        }
    }
}
