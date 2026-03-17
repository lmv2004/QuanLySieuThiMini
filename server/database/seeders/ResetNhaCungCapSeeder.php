<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ResetNhaCungCapSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();

        // Tắt foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        
        // Xóa tất cả dữ liệu nhà cung cấp
        DB::table('nha_cung_caps')->truncate();
        
        // Bật lại foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        // Thêm nhà cung cấp
        $nhaCungCaps = [
            [
                'TENNCC' => 'Công ty TNHH Thực phẩm Việt Nam',
                'DIACHI' => '123 Đường Nguyễn Văn Linh, Quận 7, TP.HCM',
                'SDT' => '0281234567',
                'EMAIL' => 'contact@thucphamvn.com',
                'IS_DELETED' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'TENNCC' => 'Công ty Cổ phần Nước giải khát Sài Gòn',
                'DIACHI' => '456 Đường Cách Mạng Tháng 8, Quận 10, TP.HCM',
                'SDT' => '0282345678',
                'EMAIL' => 'info@nuocgiaikhat-sg.com.vn',
                'IS_DELETED' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'TENNCC' => 'Công ty TNHH Bánh kẹo Hải Hà',
                'DIACHI' => '789 Đường Lê Văn Việt, Quận 9, TP.HCM',
                'SDT' => '0283456789',
                'EMAIL' => 'sales@banhkeo-haiha.vn',
                'IS_DELETED' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'TENNCC' => 'Công ty Cổ phần Sữa Việt Nam (Vinamilk)',
                'DIACHI' => '321 Đường Nguyễn Hữu Cảnh, Bình Thạnh, TP.HCM',
                'SDT' => '0284567890',
                'EMAIL' => 'contact@vinamilk.com.vn',
                'IS_DELETED' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'TENNCC' => 'Công ty TNHH Mì ăn liền Acecook Việt Nam',
                'DIACHI' => '654 Đường Võ Văn Kiệt, Quận 5, TP.HCM',
                'SDT' => '0285678901',
                'EMAIL' => 'info@acecookvietnam.vn',
                'IS_DELETED' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'TENNCC' => 'Công ty TNHH Gia vị Cholimex',
                'DIACHI' => '987 Đường Lý Thường Kiệt, Quận 11, TP.HCM',
                'SDT' => '0286789012',
                'EMAIL' => 'sales@cholimex.com.vn',
                'IS_DELETED' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'TENNCC' => 'Công ty Cổ phần Dầu thực vật Tường An',
                'DIACHI' => '147 Đường Điện Biên Phủ, Bình Thạnh, TP.HCM',
                'SDT' => '0287890123',
                'EMAIL' => 'contact@tuongan.com.vn',
                'IS_DELETED' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'TENNCC' => 'Công ty TNHH Nước mắm Nam Ngư',
                'DIACHI' => '258 Đường Trần Hưng Đạo, Quận 1, TP.HCM',
                'SDT' => '0288901234',
                'EMAIL' => 'info@namngu.com.vn',
                'IS_DELETED' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'TENNCC' => 'Công ty Cổ phần Kinh Đô',
                'DIACHI' => '369 Đường Hoàng Văn Thụ, Tân Bình, TP.HCM',
                'SDT' => '0289012345',
                'EMAIL' => 'contact@kinhdo.com.vn',
                'IS_DELETED' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'TENNCC' => 'Công ty TNHH Trà Dr Thanh',
                'DIACHI' => '741 Đường Xô Viết Nghệ Tĩnh, Bình Thạnh, TP.HCM',
                'SDT' => '0280123456',
                'EMAIL' => 'sales@drthanh.com.vn',
                'IS_DELETED' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];

        DB::table('nha_cung_caps')->insert($nhaCungCaps);
    }
}
