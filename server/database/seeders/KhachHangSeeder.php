<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class KhachHangSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();

        $khachHangs = [
            [
                'TENKH' => 'Nguyễn Văn An',
                'SODIENTHOAI' => '0901234567',
                'DIACHI' => '123 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP.HCM',
                'DIEMTHUONG' => 150,
                'IS_DELETED' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'TENKH' => 'Trần Thị Bình',
                'SODIENTHOAI' => '0912345678',
                'DIACHI' => '456 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM',
                'DIEMTHUONG' => 200,
                'IS_DELETED' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'TENKH' => 'Lê Văn Cường',
                'SODIENTHOAI' => '0923456789',
                'DIACHI' => '789 Đường Trần Hưng Đạo, Phường Cầu Kho, Quận 1, TP.HCM',
                'DIEMTHUONG' => 50,
                'IS_DELETED' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'TENKH' => 'Phạm Thị Dung',
                'SODIENTHOAI' => '0934567890',
                'DIACHI' => '321 Đường Võ Văn Tần, Phường 5, Quận 3, TP.HCM',
                'DIEMTHUONG' => 300,
                'IS_DELETED' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'TENKH' => 'Hoàng Văn Em',
                'SODIENTHOAI' => '0945678901',
                'DIACHI' => '654 Đường Cách Mạng Tháng 8, Phường 5, Quận Tân Bình, TP.HCM',
                'DIEMTHUONG' => 100,
                'IS_DELETED' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'TENKH' => 'Vũ Thị Phương',
                'SODIENTHOAI' => '0956789012',
                'DIACHI' => '987 Đường Lý Thường Kiệt, Phường 7, Quận 10, TP.HCM',
                'DIEMTHUONG' => 250,
                'IS_DELETED' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'TENKH' => 'Đặng Văn Giang',
                'SODIENTHOAI' => '0967890123',
                'DIACHI' => '147 Đường Hai Bà Trưng, Phường Bến Nghé, Quận 1, TP.HCM',
                'DIEMTHUONG' => 0,
                'IS_DELETED' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'TENKH' => 'Bùi Thị Hoa',
                'SODIENTHOAI' => '0978901234',
                'DIACHI' => '258 Đường Pasteur, Phường 6, Quận 3, TP.HCM',
                'DIEMTHUONG' => 180,
                'IS_DELETED' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'TENKH' => 'Đinh Văn Ích',
                'SODIENTHOAI' => '0989012345',
                'DIACHI' => '369 Đường Điện Biên Phủ, Phường 15, Quận Bình Thạnh, TP.HCM',
                'DIEMTHUONG' => 120,
                'IS_DELETED' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'TENKH' => 'Mai Thị Kim',
                'SODIENTHOAI' => '0990123456',
                'DIACHI' => '741 Đường Xô Viết Nghệ Tĩnh, Phường 25, Quận Bình Thạnh, TP.HCM',
                'DIEMTHUONG' => 400,
                'IS_DELETED' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];

        DB::table('khach_hangs')->insert($khachHangs);
    }
}
