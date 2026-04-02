<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CTPhieuNhapSeeder extends Seeder
{
    /**
     * Chi tiết phiếu nhập đã được insert trong ResetPhieuNhapSeeder.
     * Seeder này chỉ chạy nếu bảng đang trống (tránh duplicate).
     */
    public function run(): void
    {
        if (DB::table('c_t_phieu_nhaps')->count() > 0) {
            $this->command->info('⏭  CTPhieuNhapSeeder: đã có dữ liệu, bỏ qua.');
            return;
        }

        $this->command->info('⚠  CTPhieuNhapSeeder: không có dữ liệu, hãy chạy ResetPhieuNhapSeeder trước.');
    }
}
