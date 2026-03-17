<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ResetPhieuNhapSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Disable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // Truncate tables
        DB::table('c_t_phieu_nhaps')->truncate();
        DB::table('phieu_nhaps')->truncate();

        // Reset AUTO_INCREMENT for phieu_nhaps
        DB::statement('ALTER TABLE phieu_nhaps AUTO_INCREMENT = 1;');

        // Enable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Insert Phiếu Nhập data
        $phieuNhaps = [
            [
                'MAPHIEU' => 1,
                'NGAYLAP' => Carbon::create(2024, 1, 15, 9, 30),
                'MANV' => 1,
                'TONGTIEN' => 15000000,
                'GCHU' => 'Nhập hàng đầu tháng - Thực phẩm tươi sống',
                'IS_DELETED' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'MAPHIEU' => 2,
                'NGAYLAP' => Carbon::create(2024, 1, 20, 14, 15),
                'MANV' => 2,
                'TONGTIEN' => 8500000,
                'GCHU' => 'Nhập hàng bổ sung - Đồ uống các loại',
                'IS_DELETED' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'MAPHIEU' => 3,
                'NGAYLAP' => Carbon::create(2024, 2, 5, 10, 0),
                'MANV' => 1,
                'TONGTIEN' => 12000000,
                'GCHU' => 'Nhập hàng tháng 2 - Thực phẩm khô',
                'IS_DELETED' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'MAPHIEU' => 4,
                'NGAYLAP' => Carbon::create(2024, 2, 12, 15, 45),
                'MANV' => 3,
                'TONGTIEN' => 20000000,
                'GCHU' => 'Nhập hàng lớn - Combo sản phẩm đa dạng',
                'IS_DELETED' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'MAPHIEU' => 5,
                'NGAYLAP' => Carbon::create(2024, 2, 18, 11, 20),
                'MANV' => 2,
                'TONGTIEN' => 6500000,
                'GCHU' => 'Nhập hàng khẩn - Sản phẩm bán chạy',
                'IS_DELETED' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'MAPHIEU' => 6,
                'NGAYLAP' => Carbon::create(2024, 3, 1, 8, 30),
                'MANV' => 1,
                'TONGTIEN' => 18000000,
                'GCHU' => 'Nhập hàng đầu tháng 3 - Thực phẩm tươi sống',
                'IS_DELETED' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'MAPHIEU' => 7,
                'NGAYLAP' => Carbon::create(2024, 3, 10, 13, 0),
                'MANV' => 3,
                'TONGTIEN' => 9500000,
                'GCHU' => 'Nhập hàng bổ sung - Gia vị và đồ khô',
                'IS_DELETED' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'MAPHIEU' => 8,
                'NGAYLAP' => Carbon::create(2024, 3, 15, 16, 30),
                'MANV' => 2,
                'TONGTIEN' => 11000000,
                'GCHU' => 'Nhập hàng giữa tháng - Sản phẩm chăm sóc cá nhân',
                'IS_DELETED' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'MAPHIEU' => 9,
                'NGAYLAP' => Carbon::create(2024, 3, 20, 9, 15),
                'MANV' => 1,
                'TONGTIEN' => 14500000,
                'GCHU' => 'Nhập hàng khuyến mãi - Combo tiết kiệm',
                'IS_DELETED' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'MAPHIEU' => 10,
                'NGAYLAP' => Carbon::create(2024, 3, 25, 14, 45),
                'MANV' => 3,
                'TONGTIEN' => 7800000,
                'GCHU' => 'Nhập hàng cuối tháng - Đồ uống và snack',
                'IS_DELETED' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('phieu_nhaps')->insert($phieuNhaps);

        // Insert Chi Tiết Phiếu Nhập data
        // Giả sử có sản phẩm với MASP từ 1-20
        $ctPhieuNhaps = [
            // Phiếu 1 - 3 sản phẩm
            [
                'MAPHIEU' => 1,
                'MASP' => 1,
                'SOLUONG' => 50,
                'DONGIANHAP' => 150000,
                'HANSUDUNG' => Carbon::create(2024, 4, 15),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'MAPHIEU' => 1,
                'MASP' => 2,
                'SOLUONG' => 30,
                'DONGIANHAP' => 200000,
                'HANSUDUNG' => Carbon::create(2024, 4, 20),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'MAPHIEU' => 1,
                'MASP' => 3,
                'SOLUONG' => 40,
                'DONGIANHAP' => 100000,
                'HANSUDUNG' => Carbon::create(2024, 5, 1),
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Phiếu 2 - 2 sản phẩm
            [
                'MAPHIEU' => 2,
                'MASP' => 4,
                'SOLUONG' => 100,
                'DONGIANHAP' => 50000,
                'HANSUDUNG' => Carbon::create(2024, 7, 20),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'MAPHIEU' => 2,
                'MASP' => 5,
                'SOLUONG' => 60,
                'DONGIANHAP' => 75000,
                'HANSUDUNG' => Carbon::create(2024, 8, 1),
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Phiếu 3 - 3 sản phẩm
            [
                'MAPHIEU' => 3,
                'MASP' => 6,
                'SOLUONG' => 80,
                'DONGIANHAP' => 80000,
                'HANSUDUNG' => Carbon::create(2025, 2, 5),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'MAPHIEU' => 3,
                'MASP' => 7,
                'SOLUONG' => 50,
                'DONGIANHAP' => 120000,
                'HANSUDUNG' => Carbon::create(2025, 1, 15),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'MAPHIEU' => 3,
                'MASP' => 8,
                'SOLUONG' => 40,
                'DONGIANHAP' => 60000,
                'HANSUDUNG' => Carbon::create(2024, 12, 31),
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Phiếu 4 - 4 sản phẩm
            [
                'MAPHIEU' => 4,
                'MASP' => 9,
                'SOLUONG' => 100,
                'DONGIANHAP' => 90000,
                'HANSUDUNG' => Carbon::create(2024, 5, 12),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'MAPHIEU' => 4,
                'MASP' => 10,
                'SOLUONG' => 70,
                'DONGIANHAP' => 110000,
                'HANSUDUNG' => Carbon::create(2024, 6, 1),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'MAPHIEU' => 4,
                'MASP' => 11,
                'SOLUONG' => 50,
                'DONGIANHAP' => 85000,
                'HANSUDUNG' => Carbon::create(2024, 5, 20),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'MAPHIEU' => 4,
                'MASP' => 12,
                'SOLUONG' => 60,
                'DONGIANHAP' => 95000,
                'HANSUDUNG' => Carbon::create(2024, 7, 1),
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Phiếu 5 - 2 sản phẩm
            [
                'MAPHIEU' => 5,
                'MASP' => 13,
                'SOLUONG' => 80,
                'DONGIANHAP' => 45000,
                'HANSUDUNG' => Carbon::create(2024, 4, 18),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'MAPHIEU' => 5,
                'MASP' => 14,
                'SOLUONG' => 90,
                'DONGIANHAP' => 50000,
                'HANSUDUNG' => Carbon::create(2024, 5, 1),
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Phiếu 6 - 3 sản phẩm
            [
                'MAPHIEU' => 6,
                'MASP' => 15,
                'SOLUONG' => 60,
                'DONGIANHAP' => 180000,
                'HANSUDUNG' => Carbon::create(2024, 6, 1),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'MAPHIEU' => 6,
                'MASP' => 16,
                'SOLUONG' => 40,
                'DONGIANHAP' => 220000,
                'HANSUDUNG' => Carbon::create(2024, 5, 15),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'MAPHIEU' => 6,
                'MASP' => 17,
                'SOLUONG' => 50,
                'DONGIANHAP' => 100000,
                'HANSUDUNG' => Carbon::create(2024, 7, 1),
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Phiếu 7 - 3 sản phẩm
            [
                'MAPHIEU' => 7,
                'MASP' => 18,
                'SOLUONG' => 100,
                'DONGIANHAP' => 35000,
                'HANSUDUNG' => Carbon::create(2025, 3, 10),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'MAPHIEU' => 7,
                'MASP' => 19,
                'SOLUONG' => 80,
                'DONGIANHAP' => 55000,
                'HANSUDUNG' => Carbon::create(2025, 2, 1),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'MAPHIEU' => 7,
                'MASP' => 20,
                'SOLUONG' => 60,
                'DONGIANHAP' => 40000,
                'HANSUDUNG' => Carbon::create(2025, 1, 15),
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Phiếu 8 - 2 sản phẩm
            [
                'MAPHIEU' => 8,
                'MASP' => 1,
                'SOLUONG' => 70,
                'DONGIANHAP' => 155000,
                'HANSUDUNG' => Carbon::create(2024, 6, 15),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'MAPHIEU' => 8,
                'MASP' => 3,
                'SOLUONG' => 50,
                'DONGIANHAP' => 105000,
                'HANSUDUNG' => Carbon::create(2024, 7, 1),
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Phiếu 9 - 3 sản phẩm
            [
                'MAPHIEU' => 9,
                'MASP' => 5,
                'SOLUONG' => 120,
                'DONGIANHAP' => 70000,
                'HANSUDUNG' => Carbon::create(2024, 9, 20),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'MAPHIEU' => 9,
                'MASP' => 7,
                'SOLUONG' => 60,
                'DONGIANHAP' => 115000,
                'HANSUDUNG' => Carbon::create(2025, 3, 20),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'MAPHIEU' => 9,
                'MASP' => 9,
                'SOLUONG' => 80,
                'DONGIANHAP' => 88000,
                'HANSUDUNG' => Carbon::create(2024, 6, 20),
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Phiếu 10 - 2 sản phẩm
            [
                'MAPHIEU' => 10,
                'MASP' => 11,
                'SOLUONG' => 90,
                'DONGIANHAP' => 48000,
                'HANSUDUNG' => Carbon::create(2024, 6, 25),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'MAPHIEU' => 10,
                'MASP' => 13,
                'SOLUONG' => 100,
                'DONGIANHAP' => 46000,
                'HANSUDUNG' => Carbon::create(2024, 5, 25),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('c_t_phieu_nhaps')->insert($ctPhieuNhaps);

        $this->command->info('✓ Đã reset dữ liệu Phiếu nhập và Chi tiết phiếu nhập (ID 1-10)');
    }
}
