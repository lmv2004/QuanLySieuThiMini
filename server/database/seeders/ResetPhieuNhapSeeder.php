<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ResetPhieuNhapSeeder extends Seeder
{
    /**
     * Mapping nhà cung cấp theo thứ tự insert trong ResetNhaCungCapSeeder:
     * 1 = Thực phẩm Việt Nam
     * 2 = Nước giải khát Sài Gòn
     * 3 = Bánh kẹo Hải Hà
     * 4 = Vinamilk
     * 5 = Acecook
     * 6 = Cholimex (Gia vị)
     * 7 = Tường An (Dầu ăn)
     * 8 = Nam Ngư (Nước mắm)
     * 9 = Kinh Đô
     * 10 = Dr Thanh
     *
     * Mapping nhân viên theo ResetChucVuNhanVienSeeder:
     * 1 = Nguyễn Văn Minh (Quản lý)
     * 2 = Trần Thị Lan (Bán hàng)
     * 3 = Lê Văn Hùng (Nhân viên kho)
     * 7 = Đặng Văn Nam (Nhân viên kho)
     */
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('c_t_phieu_nhaps')->truncate();
        DB::table('phieu_nhaps')->truncate();
        DB::statement('ALTER TABLE phieu_nhaps AUTO_INCREMENT = 1;');
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $now = Carbon::now();

        // ── Phiếu nhập ──────────────────────────────────────────────────────────
        // Đa dạng trạng thái: APPROVED (đã duyệt), PENDING (chờ duyệt), CANCELLED (đã hủy)
        $phieuNhaps = [
            // ── APPROVED: đã duyệt, tồn kho đã được ghi ──
            [
                'MAPHIEU'   => 1,
                'NGAYLAP'   => Carbon::create(2025, 10, 5, 8, 30),
                'MANV'      => 3, // Lê Văn Hùng - NV kho
                'MANCC'     => 1, // Thực phẩm Việt Nam
                'TONGTIEN'  => 17500000,
                'GCHU'      => 'Nhập thực phẩm tươi sống đầu tháng 10',
                'TRANGTHAI' => 'APPROVED',
                'IS_DELETED' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'MAPHIEU'   => 2,
                'NGAYLAP'   => Carbon::create(2025, 10, 12, 14, 0),
                'MANV'      => 3,
                'MANCC'     => 2, // Nước giải khát Sài Gòn
                'TONGTIEN'  => 9000000,
                'GCHU'      => 'Nhập đồ uống bổ sung - Bia, nước ngọt',
                'TRANGTHAI' => 'APPROVED',
                'IS_DELETED' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'MAPHIEU'   => 3,
                'NGAYLAP'   => Carbon::create(2025, 10, 20, 9, 15),
                'MANV'      => 7, // Đặng Văn Nam - NV kho
                'MANCC'     => 4, // Vinamilk
                'TONGTIEN'  => 12600000,
                'GCHU'      => 'Nhập sữa và sản phẩm từ sữa Vinamilk',
                'TRANGTHAI' => 'APPROVED',
                'IS_DELETED' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'MAPHIEU'   => 4,
                'NGAYLAP'   => Carbon::create(2025, 11, 3, 10, 30),
                'MANV'      => 3,
                'MANCC'     => 5, // Acecook
                'TONGTIEN'  => 8400000,
                'GCHU'      => 'Nhập mì ăn liền Hảo Hảo, Lẩu Thái',
                'TRANGTHAI' => 'APPROVED',
                'IS_DELETED' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'MAPHIEU'   => 5,
                'NGAYLAP'   => Carbon::create(2025, 11, 15, 15, 45),
                'MANV'      => 7,
                'MANCC'     => 9, // Kinh Đô
                'TONGTIEN'  => 11200000,
                'GCHU'      => 'Nhập bánh kẹo Kinh Đô chuẩn bị Tết',
                'TRANGTHAI' => 'APPROVED',
                'IS_DELETED' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'MAPHIEU'   => 6,
                'NGAYLAP'   => Carbon::create(2025, 11, 25, 8, 0),
                'MANV'      => 3,
                'MANCC'     => 6, // Cholimex
                'TONGTIEN'  => 6750000,
                'GCHU'      => 'Nhập gia vị: tương ớt, tương cà, nước tương',
                'TRANGTHAI' => 'APPROVED',
                'IS_DELETED' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'MAPHIEU'   => 7,
                'NGAYLAP'   => Carbon::create(2025, 12, 2, 9, 0),
                'MANV'      => 7,
                'MANCC'     => 7, // Tường An
                'TONGTIEN'  => 14400000,
                'GCHU'      => 'Nhập dầu ăn Tường An các loại',
                'TRANGTHAI' => 'APPROVED',
                'IS_DELETED' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],

            // ── PENDING: chờ duyệt ──
            [
                'MAPHIEU'   => 8,
                'NGAYLAP'   => Carbon::create(2026, 3, 28, 10, 0),
                'MANV'      => 3,
                'MANCC'     => 1, // Thực phẩm Việt Nam
                'TONGTIEN'  => 19500000,
                'GCHU'      => 'Nhập thực phẩm tươi sống tháng 4 - chờ kiểm hàng',
                'TRANGTHAI' => 'PENDING',
                'IS_DELETED' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'MAPHIEU'   => 9,
                'NGAYLAP'   => Carbon::create(2026, 3, 30, 14, 30),
                'MANV'      => 7,
                'MANCC'     => 10, // Dr Thanh
                'TONGTIEN'  => 7200000,
                'GCHU'      => 'Nhập trà Dr Thanh, nước ép - chờ duyệt',
                'TRANGTHAI' => 'PENDING',
                'IS_DELETED' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'MAPHIEU'   => 10,
                'NGAYLAP'   => Carbon::create(2026, 4, 1, 9, 0),
                'MANV'      => 3,
                'MANCC'     => 3, // Bánh kẹo Hải Hà
                'TONGTIEN'  => 5600000,
                'GCHU'      => 'Nhập bánh kẹo Hải Hà - đơn mới nhất',
                'TRANGTHAI' => 'PENDING',
                'IS_DELETED' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],

            // ── CANCELLED: đã hủy ──
            [
                'MAPHIEU'   => 11,
                'NGAYLAP'   => Carbon::create(2025, 12, 10, 11, 0),
                'MANV'      => 3,
                'MANCC'     => 8, // Nam Ngư
                'TONGTIEN'  => 4500000,
                'GCHU'      => 'Hủy do nhà cung cấp giao hàng sai quy cách',
                'TRANGTHAI' => 'CANCELLED',
                'IS_DELETED' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];

        DB::table('phieu_nhaps')->insert($phieuNhaps);

        // ── Chi tiết phiếu nhập ─────────────────────────────────────────────────
        // MASP 1-20 theo dữ liệu sản phẩm hiện có
        $ctPhieuNhaps = [
            // Phiếu 1 - Thực phẩm tươi sống (APPROVED)
            ['MAPHIEU' => 1, 'MASP' => 1,  'SOLUONG' => 50, 'DONGIANHAP' => 150000, 'HANSUDUNG' => Carbon::create(2026, 1, 5),  'created_at' => $now, 'updated_at' => $now],
            ['MAPHIEU' => 1, 'MASP' => 2,  'SOLUONG' => 40, 'DONGIANHAP' => 200000, 'HANSUDUNG' => Carbon::create(2026, 1, 10), 'created_at' => $now, 'updated_at' => $now],
            ['MAPHIEU' => 1, 'MASP' => 3,  'SOLUONG' => 30, 'DONGIANHAP' => 100000, 'HANSUDUNG' => Carbon::create(2026, 2, 1),  'created_at' => $now, 'updated_at' => $now],

            // Phiếu 2 - Đồ uống (APPROVED)
            ['MAPHIEU' => 2, 'MASP' => 4,  'SOLUONG' => 120, 'DONGIANHAP' => 45000, 'HANSUDUNG' => Carbon::create(2026, 10, 12), 'created_at' => $now, 'updated_at' => $now],
            ['MAPHIEU' => 2, 'MASP' => 5,  'SOLUONG' => 80,  'DONGIANHAP' => 30000, 'HANSUDUNG' => Carbon::create(2026, 8, 1),  'created_at' => $now, 'updated_at' => $now],

            // Phiếu 3 - Vinamilk (APPROVED)
            ['MAPHIEU' => 3, 'MASP' => 6,  'SOLUONG' => 100, 'DONGIANHAP' => 28000, 'HANSUDUNG' => Carbon::create(2026, 4, 20), 'created_at' => $now, 'updated_at' => $now],
            ['MAPHIEU' => 3, 'MASP' => 7,  'SOLUONG' => 60,  'DONGIANHAP' => 85000, 'HANSUDUNG' => Carbon::create(2026, 5, 1),  'created_at' => $now, 'updated_at' => $now],
            ['MAPHIEU' => 3, 'MASP' => 8,  'SOLUONG' => 80,  'DONGIANHAP' => 55000, 'HANSUDUNG' => Carbon::create(2026, 4, 15), 'created_at' => $now, 'updated_at' => $now],

            // Phiếu 4 - Acecook mì ăn liền (APPROVED)
            ['MAPHIEU' => 4, 'MASP' => 9,  'SOLUONG' => 200, 'DONGIANHAP' => 18000, 'HANSUDUNG' => Carbon::create(2026, 11, 3),  'created_at' => $now, 'updated_at' => $now],
            ['MAPHIEU' => 4, 'MASP' => 10, 'SOLUONG' => 200, 'DONGIANHAP' => 24000, 'HANSUDUNG' => Carbon::create(2026, 11, 3),  'created_at' => $now, 'updated_at' => $now],

            // Phiếu 5 - Bánh kẹo Kinh Đô (APPROVED)
            ['MAPHIEU' => 5, 'MASP' => 11, 'SOLUONG' => 80,  'DONGIANHAP' => 65000, 'HANSUDUNG' => Carbon::create(2026, 5, 15),  'created_at' => $now, 'updated_at' => $now],
            ['MAPHIEU' => 5, 'MASP' => 12, 'SOLUONG' => 60,  'DONGIANHAP' => 90000, 'HANSUDUNG' => Carbon::create(2026, 6, 1),   'created_at' => $now, 'updated_at' => $now],
            ['MAPHIEU' => 5, 'MASP' => 13, 'SOLUONG' => 50,  'DONGIANHAP' => 75000, 'HANSUDUNG' => Carbon::create(2026, 5, 30),  'created_at' => $now, 'updated_at' => $now],

            // Phiếu 6 - Gia vị Cholimex (APPROVED)
            ['MAPHIEU' => 6, 'MASP' => 14, 'SOLUONG' => 150, 'DONGIANHAP' => 25000, 'HANSUDUNG' => Carbon::create(2027, 11, 25), 'created_at' => $now, 'updated_at' => $now],
            ['MAPHIEU' => 6, 'MASP' => 15, 'SOLUONG' => 100, 'DONGIANHAP' => 30000, 'HANSUDUNG' => Carbon::create(2027, 11, 25), 'created_at' => $now, 'updated_at' => $now],

            // Phiếu 7 - Dầu ăn Tường An (APPROVED)
            ['MAPHIEU' => 7, 'MASP' => 16, 'SOLUONG' => 80,  'DONGIANHAP' => 90000, 'HANSUDUNG' => Carbon::create(2027, 12, 2),  'created_at' => $now, 'updated_at' => $now],
            ['MAPHIEU' => 7, 'MASP' => 17, 'SOLUONG' => 80,  'DONGIANHAP' => 90000, 'HANSUDUNG' => Carbon::create(2027, 12, 2),  'created_at' => $now, 'updated_at' => $now],

            // Phiếu 8 - Thực phẩm tươi (PENDING - chưa duyệt, chưa vào kho)
            ['MAPHIEU' => 8, 'MASP' => 1,  'SOLUONG' => 60,  'DONGIANHAP' => 155000, 'HANSUDUNG' => Carbon::create(2026, 5, 1),  'created_at' => $now, 'updated_at' => $now],
            ['MAPHIEU' => 8, 'MASP' => 2,  'SOLUONG' => 50,  'DONGIANHAP' => 205000, 'HANSUDUNG' => Carbon::create(2026, 5, 5),  'created_at' => $now, 'updated_at' => $now],
            ['MAPHIEU' => 8, 'MASP' => 3,  'SOLUONG' => 40,  'DONGIANHAP' => 105000, 'HANSUDUNG' => Carbon::create(2026, 6, 1),  'created_at' => $now, 'updated_at' => $now],

            // Phiếu 9 - Dr Thanh (PENDING)
            ['MAPHIEU' => 9, 'MASP' => 4,  'SOLUONG' => 100, 'DONGIANHAP' => 42000, 'HANSUDUNG' => Carbon::create(2027, 3, 30), 'created_at' => $now, 'updated_at' => $now],
            ['MAPHIEU' => 9, 'MASP' => 5,  'SOLUONG' => 80,  'DONGIANHAP' => 48000, 'HANSUDUNG' => Carbon::create(2027, 3, 30), 'created_at' => $now, 'updated_at' => $now],

            // Phiếu 10 - Bánh kẹo Hải Hà (PENDING)
            ['MAPHIEU' => 10, 'MASP' => 11, 'SOLUONG' => 40, 'DONGIANHAP' => 68000, 'HANSUDUNG' => Carbon::create(2026, 10, 1), 'created_at' => $now, 'updated_at' => $now],
            ['MAPHIEU' => 10, 'MASP' => 12, 'SOLUONG' => 40, 'DONGIANHAP' => 72000, 'HANSUDUNG' => Carbon::create(2026, 10, 1), 'created_at' => $now, 'updated_at' => $now],

            // Phiếu 11 - Nam Ngư (CANCELLED - không có tồn kho)
            ['MAPHIEU' => 11, 'MASP' => 18, 'SOLUONG' => 100, 'DONGIANHAP' => 25000, 'HANSUDUNG' => Carbon::create(2027, 12, 10), 'created_at' => $now, 'updated_at' => $now],
            ['MAPHIEU' => 11, 'MASP' => 19, 'SOLUONG' => 80,  'DONGIANHAP' => 18000, 'HANSUDUNG' => Carbon::create(2027, 12, 10), 'created_at' => $now, 'updated_at' => $now],
        ];

        DB::table('c_t_phieu_nhaps')->insert($ctPhieuNhaps);

        $this->command->info('✓ Reset Phiếu nhập: 7 APPROVED | 3 PENDING | 1 CANCELLED');
        $this->command->info('✓ Đã insert ' . count($ctPhieuNhaps) . ' chi tiết phiếu nhập');
    }
}
