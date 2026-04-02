<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class KhachHangSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        DB::table('khach_hangs')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        $now = now();
        DB::table('khach_hangs')->insert([
            ['TENKH' => 'Nguyễn Văn An',       'SODIENTHOAI' => '0901111101', 'DIACHI' => '12 Lê Lợi, Phường Bến Nghé, Quận 1, TP.HCM',              'DIEMTHUONG' => 1250, 'IS_DELETED' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['TENKH' => 'Trần Thị Bích Ngọc',  'SODIENTHOAI' => '0901111102', 'DIACHI' => '45 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM',          'DIEMTHUONG' => 3400, 'IS_DELETED' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['TENKH' => 'Lê Văn Cường',         'SODIENTHOAI' => '0901111103', 'DIACHI' => '78 Trần Hưng Đạo, Phường Cầu Kho, Quận 1, TP.HCM',        'DIEMTHUONG' => 580,  'IS_DELETED' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['TENKH' => 'Phạm Thị Dung',        'SODIENTHOAI' => '0901111104', 'DIACHI' => '23 Võ Văn Tần, Phường 5, Quận 3, TP.HCM',                 'DIEMTHUONG' => 2100, 'IS_DELETED' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['TENKH' => 'Hoàng Minh Tuấn',      'SODIENTHOAI' => '0901111105', 'DIACHI' => '56 Cách Mạng Tháng 8, Phường 5, Quận Tân Bình, TP.HCM',   'DIEMTHUONG' => 760,  'IS_DELETED' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['TENKH' => 'Vũ Thị Phương Linh',   'SODIENTHOAI' => '0901111106', 'DIACHI' => '89 Lý Thường Kiệt, Phường 7, Quận 10, TP.HCM',            'DIEMTHUONG' => 4800, 'IS_DELETED' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['TENKH' => 'Đặng Quốc Bảo',        'SODIENTHOAI' => '0901111107', 'DIACHI' => '34 Điện Biên Phủ, Phường 15, Bình Thạnh, TP.HCM',         'DIEMTHUONG' => 0,    'IS_DELETED' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['TENKH' => 'Bùi Thị Hoa',          'SODIENTHOAI' => '0901111108', 'DIACHI' => '67 Xô Viết Nghệ Tĩnh, Phường 25, Bình Thạnh, TP.HCM',    'DIEMTHUONG' => 1900, 'IS_DELETED' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['TENKH' => 'Đinh Thị Kim Oanh',    'SODIENTHOAI' => '0901111109', 'DIACHI' => '101 Nguyễn Văn Cừ, Phường 2, Quận 5, TP.HCM',             'DIEMTHUONG' => 3200, 'IS_DELETED' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['TENKH' => 'Mai Xuân Trường',       'SODIENTHOAI' => '0901111110', 'DIACHI' => '15 Ba Tháng Hai, Phường 11, Quận 10, TP.HCM',             'DIEMTHUONG' => 650,  'IS_DELETED' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['TENKH' => 'Ngô Thị Thanh Hương',  'SODIENTHOAI' => '0901111111', 'DIACHI' => '22 Phan Đình Phùng, Phường 2, Phú Nhuận, TP.HCM',         'DIEMTHUONG' => 5500, 'IS_DELETED' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['TENKH' => 'Lý Văn Hải',           'SODIENTHOAI' => '0901111112', 'DIACHI' => '88 Hoàng Văn Thụ, Phường 9, Phú Nhuận, TP.HCM',           'DIEMTHUONG' => 420,  'IS_DELETED' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['TENKH' => 'Phan Thị Ngọc Hà',     'SODIENTHOAI' => '0901111113', 'DIACHI' => '33 Quang Trung, Phường 10, Gò Vấp, TP.HCM',               'DIEMTHUONG' => 1100, 'IS_DELETED' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['TENKH' => 'Dương Văn Khải',        'SODIENTHOAI' => '0901111114', 'DIACHI' => '55 Nguyễn Oanh, Phường 17, Gò Vấp, TP.HCM',              'DIEMTHUONG' => 0,    'IS_DELETED' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['TENKH' => 'Tô Thị Mỹ Duyên',      'SODIENTHOAI' => '0901111115', 'DIACHI' => '77 Lê Văn Việt, Phường Hiệp Phú, Quận 9, TP.HCM',        'DIEMTHUONG' => 2750, 'IS_DELETED' => 0, 'created_at' => $now, 'updated_at' => $now],
        ]);

        $this->command->info('✓ KhachHangSeeder: 15 khách hàng');
    }
}
