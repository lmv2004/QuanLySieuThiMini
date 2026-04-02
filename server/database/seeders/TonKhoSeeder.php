<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TonKhoSeeder extends Seeder
{
    /**
     * TonKho được tạo tự động khi approve phiếu nhập.
     * Seeder này chỉ chạy nếu bảng đang trống.
     */
    public function run(): void
    {
        if (DB::table('ton_khos')->count() > 0) {
            $this->command->info('⏭  TonKhoSeeder: đã có dữ liệu từ phiếu nhập đã duyệt, bỏ qua.');
            return;
        }

        // Nếu chưa có tồn kho, tạo thủ công từ các phiếu nhập APPROVED
        $phieuNhaps = DB::table('phieu_nhaps')
            ->where('TRANGTHAI', 'APPROVED')
            ->where('IS_DELETED', 0)
            ->get();

        if ($phieuNhaps->isEmpty()) {
            $this->command->warn('⚠  TonKhoSeeder: không có phiếu nhập APPROVED nào để tạo tồn kho.');
            return;
        }

        $now = now();
        $rows = [];

        foreach ($phieuNhaps as $phieu) {
            $chiTiets = DB::table('c_t_phieu_nhaps')->where('MAPHIEU', $phieu->MAPHIEU)->get();
            foreach ($chiTiets as $ct) {
                $rows[] = [
                    'MASP'           => $ct->MASP,
                    'MAPHIEUNHAP'    => $phieu->MAPHIEU,
                    'SOLUONG_CON_LAI'=> $ct->SOLUONG,
                    'GIANHAP'        => $ct->DONGIANHAP,
                    'HANSUDUNG'      => $ct->HANSUDUNG,
                    'NGAYNHAP'       => $phieu->NGAYLAP,
                    'IS_ACTIVE'      => 1,
                    'created_at'     => $now,
                    'updated_at'     => $now,
                ];
            }
        }

        if (!empty($rows)) {
            DB::table('ton_khos')->insert($rows);
            $this->command->info('✓ TonKhoSeeder: tạo ' . count($rows) . ' lô hàng từ ' . $phieuNhaps->count() . ' phiếu nhập APPROVED');
        }
    }
}
