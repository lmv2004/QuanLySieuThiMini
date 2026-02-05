<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class HoaDonSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $nhanVienIds = \App\Models\NhanVien::pluck('MANV')->toArray();
        $khachHangIds = \App\Models\KhachHang::pluck('MAKH')->toArray();
        $voucherIds = \App\Models\Voucher::pluck('SOVOUCHER')->toArray();

        \App\Models\HoaDon::factory(50)->create([
            'MANV' => fake()->randomElement($nhanVienIds),
            'MAKH' => fake()->randomElement($khachHangIds),
            'SOVOUCHER' => fake()->optional(0.3)->randomElement($voucherIds),
        ]);
    }
}
