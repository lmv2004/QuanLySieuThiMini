<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class PhieuNhapSeeder extends Seeder
{
    /**
     * Chạy ResetPhieuNhapSeeder để seed dữ liệu phiếu nhập.
     * Yêu cầu: ResetNhaCungCapSeeder và ResetChucVuNhanVienSeeder đã chạy trước.
     */
    public function run(): void
    {
        $this->call(ResetPhieuNhapSeeder::class);
    }
}
