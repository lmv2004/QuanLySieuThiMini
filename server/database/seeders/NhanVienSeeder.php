<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NhanVienSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        DB::table('nhan_viens')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        $chucVus = DB::table('chuc_vus')->pluck('MACHUCVU', 'CODE');
        $manager   = $chucVus['manager']   ?? 1;
        $cashier   = $chucVus['cashier']   ?? 2;
        $warehouse = $chucVus['warehouse'] ?? 3;

        $now = now();
        DB::table('nhan_viens')->insert([
            // Quản lý
            ['TENNV' => 'Nguyễn Thị Hồng Nhung', 'GIOITINH' => 0, 'CCCD' => '079201012345', 'NGAYSINH' => '1985-03-08', 'SODIENTHOAI' => '0901234501', 'EMAIL' => 'hongnhung@minimart.vn',  'DIACHI' => '12 Lê Lợi, Phường Bến Nghé, Quận 1, TP.HCM',          'NGAYTHAMGIA' => '2018-01-15', 'MACHUCVU' => $manager,   'IS_DELETED' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['TENNV' => 'Trần Văn Đức',           'GIOITINH' => 1, 'CCCD' => '079201023456', 'NGAYSINH' => '1982-07-20', 'SODIENTHOAI' => '0901234502', 'EMAIL' => 'vanduc@minimart.vn',     'DIACHI' => '45 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM',      'NGAYTHAMGIA' => '2019-03-01', 'MACHUCVU' => $manager,   'IS_DELETED' => 0, 'created_at' => $now, 'updated_at' => $now],
            // Thu ngân
            ['TENNV' => 'Lê Thị Mỹ Linh',        'GIOITINH' => 0, 'CCCD' => '079201034567', 'NGAYSINH' => '1998-11-15', 'SODIENTHOAI' => '0901234503', 'EMAIL' => 'mylinh@minimart.vn',     'DIACHI' => '78 Trần Hưng Đạo, Phường Cầu Kho, Quận 1, TP.HCM',    'NGAYTHAMGIA' => '2021-06-01', 'MACHUCVU' => $cashier,   'IS_DELETED' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['TENNV' => 'Phạm Thị Thu Hà',        'GIOITINH' => 0, 'CCCD' => '079201045678', 'NGAYSINH' => '1999-04-22', 'SODIENTHOAI' => '0901234504', 'EMAIL' => 'thuha@minimart.vn',      'DIACHI' => '23 Võ Văn Tần, Phường 6, Quận 3, TP.HCM',             'NGAYTHAMGIA' => '2021-09-15', 'MACHUCVU' => $cashier,   'IS_DELETED' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['TENNV' => 'Hoàng Thị Lan Anh',      'GIOITINH' => 0, 'CCCD' => '079201056789', 'NGAYSINH' => '2000-08-30', 'SODIENTHOAI' => '0901234505', 'EMAIL' => 'lananh@minimart.vn',     'DIACHI' => '56 Cách Mạng Tháng 8, Phường 5, Quận Tân Bình, TP.HCM','NGAYTHAMGIA' => '2022-02-01', 'MACHUCVU' => $cashier,   'IS_DELETED' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['TENNV' => 'Vũ Thị Ngọc Ánh',        'GIOITINH' => 0, 'CCCD' => '079201067890', 'NGAYSINH' => '1997-12-05', 'SODIENTHOAI' => '0901234506', 'EMAIL' => 'ngochanh@minimart.vn',   'DIACHI' => '89 Lý Thường Kiệt, Phường 7, Quận 10, TP.HCM',        'NGAYTHAMGIA' => '2022-07-10', 'MACHUCVU' => $cashier,   'IS_DELETED' => 0, 'created_at' => $now, 'updated_at' => $now],
            // Nhân viên kho
            ['TENNV' => 'Đặng Văn Khoa',          'GIOITINH' => 1, 'CCCD' => '079201078901', 'NGAYSINH' => '1990-05-18', 'SODIENTHOAI' => '0901234507', 'EMAIL' => 'vankhoa@minimart.vn',    'DIACHI' => '34 Điện Biên Phủ, Phường 15, Bình Thạnh, TP.HCM',     'NGAYTHAMGIA' => '2020-04-01', 'MACHUCVU' => $warehouse, 'IS_DELETED' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['TENNV' => 'Bùi Văn Tùng',           'GIOITINH' => 1, 'CCCD' => '079201089012', 'NGAYSINH' => '1993-09-12', 'SODIENTHOAI' => '0901234508', 'EMAIL' => 'vantung@minimart.vn',    'DIACHI' => '67 Xô Viết Nghệ Tĩnh, Phường 25, Bình Thạnh, TP.HCM', 'NGAYTHAMGIA' => '2020-08-15', 'MACHUCVU' => $warehouse, 'IS_DELETED' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['TENNV' => 'Đinh Quốc Hùng',         'GIOITINH' => 1, 'CCCD' => '079201090123', 'NGAYSINH' => '1995-02-28', 'SODIENTHOAI' => '0901234509', 'EMAIL' => 'quochung@minimart.vn',   'DIACHI' => '101 Nguyễn Văn Cừ, Phường 2, Quận 5, TP.HCM',         'NGAYTHAMGIA' => '2021-01-10', 'MACHUCVU' => $warehouse, 'IS_DELETED' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['TENNV' => 'Ngô Thị Thanh Thảo',     'GIOITINH' => 0, 'CCCD' => '079201001234', 'NGAYSINH' => '1996-06-14', 'SODIENTHOAI' => '0901234510', 'EMAIL' => 'thanhthao@minimart.vn',  'DIACHI' => '15 Ba Tháng Hai, Phường 11, Quận 10, TP.HCM',          'NGAYTHAMGIA' => '2023-03-20', 'MACHUCVU' => $cashier,   'IS_DELETED' => 0, 'created_at' => $now, 'updated_at' => $now],
        ]);

        $this->command->info('✓ NhanVienSeeder: 10 nhân viên (2 QL, 5 thu ngân, 3 kho)');
    }
}
