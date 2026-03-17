<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ResetChucVuNhanVienSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();

        // Tắt foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        
        // Xóa tất cả dữ liệu nhân viên và chức vụ
        DB::table('nhan_viens')->truncate();
        DB::table('chuc_vus')->truncate();
        
        // Bật lại foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        // Thêm chức vụ
        $chucVus = [
            [
                'TENCHUCVU' => 'Quản lý',
                'MOTA' => 'Quản lý cửa hàng',
                'IS_DELETED' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'TENCHUCVU' => 'Nhân viên bán hàng',
                'MOTA' => 'Phụ trách bán hàng và tư vấn khách hàng',
                'IS_DELETED' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'TENCHUCVU' => 'Nhân viên kho',
                'MOTA' => 'Quản lý kho hàng và nhập xuất',
                'IS_DELETED' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'TENCHUCVU' => 'Thu ngân',
                'MOTA' => 'Phụ trách thu ngân và thanh toán',
                'IS_DELETED' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'TENCHUCVU' => 'Bảo vệ',
                'MOTA' => 'Bảo vệ an ninh cửa hàng',
                'IS_DELETED' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];

        DB::table('chuc_vus')->insert($chucVus);

        // Thêm nhân viên
        $nhanViens = [
            [
                'TENNV' => 'Nguyễn Văn Minh',
                'GIOITINH' => 1,
                'CCCD' => '001234567890',
                'NGAYSINH' => '1985-05-15',
                'SODIENTHOAI' => '0901111111',
                'EMAIL' => 'nguyenvanminh@gmail.com',
                'DIACHI' => '123 Đường Lê Văn Việt, Quận 9, TP.HCM',
                'NGAYTHAMGIA' => '2020-01-15',
                'MACHUCVU' => 1,
                'IS_DELETED' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'TENNV' => 'Trần Thị Lan',
                'GIOITINH' => 0,
                'CCCD' => '001234567891',
                'NGAYSINH' => '1992-08-20',
                'SODIENTHOAI' => '0902222222',
                'EMAIL' => 'tranthilan@gmail.com',
                'DIACHI' => '456 Đường Võ Văn Ngân, Thủ Đức, TP.HCM',
                'NGAYTHAMGIA' => '2021-03-10',
                'MACHUCVU' => 2,
                'IS_DELETED' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'TENNV' => 'Lê Văn Hùng',
                'GIOITINH' => 1,
                'CCCD' => '001234567892',
                'NGAYSINH' => '1990-12-05',
                'SODIENTHOAI' => '0903333333',
                'EMAIL' => 'levanhung@gmail.com',
                'DIACHI' => '789 Đường Quang Trung, Gò Vấp, TP.HCM',
                'NGAYTHAMGIA' => '2020-06-20',
                'MACHUCVU' => 3,
                'IS_DELETED' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'TENNV' => 'Phạm Thị Mai',
                'GIOITINH' => 0,
                'CCCD' => '001234567893',
                'NGAYSINH' => '1995-03-25',
                'SODIENTHOAI' => '0904444444',
                'EMAIL' => 'phamthimai@gmail.com',
                'DIACHI' => '321 Đường Phan Văn Trị, Bình Thạnh, TP.HCM',
                'NGAYTHAMGIA' => '2021-09-01',
                'MACHUCVU' => 4,
                'IS_DELETED' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'TENNV' => 'Hoàng Văn Tuấn',
                'GIOITINH' => 1,
                'CCCD' => '001234567894',
                'NGAYSINH' => '1988-07-10',
                'SODIENTHOAI' => '0905555555',
                'EMAIL' => 'hoangvantuan@gmail.com',
                'DIACHI' => '654 Đường Nguyễn Thị Minh Khai, Quận 3, TP.HCM',
                'NGAYTHAMGIA' => '2019-11-15',
                'MACHUCVU' => 2,
                'IS_DELETED' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'TENNV' => 'Vũ Thị Hương',
                'GIOITINH' => 0,
                'CCCD' => '001234567895',
                'NGAYSINH' => '1993-11-30',
                'SODIENTHOAI' => '0906666666',
                'EMAIL' => 'vuthihuong@gmail.com',
                'DIACHI' => '987 Đường Hoàng Văn Thụ, Tân Bình, TP.HCM',
                'NGAYTHAMGIA' => '2022-02-20',
                'MACHUCVU' => 4,
                'IS_DELETED' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'TENNV' => 'Đặng Văn Nam',
                'GIOITINH' => 1,
                'CCCD' => '001234567896',
                'NGAYSINH' => '1987-04-18',
                'SODIENTHOAI' => '0907777777',
                'EMAIL' => 'dangvannam@gmail.com',
                'DIACHI' => '147 Đường Lý Thái Tổ, Quận 10, TP.HCM',
                'NGAYTHAMGIA' => '2020-08-05',
                'MACHUCVU' => 3,
                'IS_DELETED' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'TENNV' => 'Bùi Thị Ngọc',
                'GIOITINH' => 0,
                'CCCD' => '001234567897',
                'NGAYSINH' => '1996-09-12',
                'SODIENTHOAI' => '0908888888',
                'EMAIL' => 'buithingoc@gmail.com',
                'DIACHI' => '258 Đường Cộng Hòa, Tân Bình, TP.HCM',
                'NGAYTHAMGIA' => '2022-05-10',
                'MACHUCVU' => 2,
                'IS_DELETED' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'TENNV' => 'Đinh Văn Khoa',
                'GIOITINH' => 1,
                'CCCD' => '001234567898',
                'NGAYSINH' => '1991-06-22',
                'SODIENTHOAI' => '0909999999',
                'EMAIL' => 'dinhvankhoa@gmail.com',
                'DIACHI' => '369 Đường Ba Tháng Hai, Quận 10, TP.HCM',
                'NGAYTHAMGIA' => '2021-07-15',
                'MACHUCVU' => 5,
                'IS_DELETED' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'TENNV' => 'Mai Thị Thanh',
                'GIOITINH' => 0,
                'CCCD' => '001234567899',
                'NGAYSINH' => '1994-02-28',
                'SODIENTHOAI' => '0910000000',
                'EMAIL' => 'maithithanh@gmail.com',
                'DIACHI' => '741 Đường Nguyễn Văn Cừ, Quận 5, TP.HCM',
                'NGAYTHAMGIA' => '2022-01-20',
                'MACHUCVU' => 2,
                'IS_DELETED' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];

        DB::table('nhan_viens')->insert($nhanViens);
    }
}
