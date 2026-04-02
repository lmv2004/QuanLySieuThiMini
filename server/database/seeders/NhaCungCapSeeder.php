<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NhaCungCapSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        DB::table('nha_cung_caps')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        $now = now();
        DB::table('nha_cung_caps')->insert([
            // Thực phẩm & đồ uống
            ['TENNCC' => 'Công ty CP Sữa Việt Nam (Vinamilk)',         'DIACHI' => '10 Tân Trào, Tân Phú, Quận 7, TP.HCM',              'SDT' => '02838299999', 'EMAIL' => 'contact@vinamilk.com.vn',       'IS_DELETED' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['TENNCC' => 'Công ty TNHH Acecook Việt Nam',              'DIACHI' => 'Lô II-3, Đường số 11, KCN Tân Bình, TP.HCM',        'SDT' => '02838161016', 'EMAIL' => 'info@acecookvietnam.vn',        'IS_DELETED' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['TENNCC' => 'Công ty CP Nước giải khát Sài Gòn (Sabeco)', 'DIACHI' => '187 Nguyễn Chí Thanh, Phường 12, Quận 5, TP.HCM',  'SDT' => '02838554161', 'EMAIL' => 'info@sabeco.com.vn',            'IS_DELETED' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['TENNCC' => 'Công ty CP Kinh Đô (Kido)',                  'DIACHI' => '138-142 Hai Bà Trưng, Đa Kao, Quận 1, TP.HCM',     'SDT' => '02838220216', 'EMAIL' => 'contact@kido.com.vn',           'IS_DELETED' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['TENNCC' => 'Công ty TNHH Gia vị Cholimex',               'DIACHI' => '808/1 Hưng Phú, Phường 10, Quận 8, TP.HCM',        'SDT' => '02838504186', 'EMAIL' => 'sales@cholimex.com.vn',         'IS_DELETED' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['TENNCC' => 'Công ty CP Dầu thực vật Tường An',           'DIACHI' => '48 Đường số 4, KCN Việt Nam - Singapore, Bình Dương','SDT' => '02743756789', 'EMAIL' => 'contact@tuongan.com.vn',        'IS_DELETED' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['TENNCC' => 'Công ty TNHH Nước mắm Phú Quốc Khải Hoàn',  'DIACHI' => '12 Trần Hưng Đạo, Dương Đông, Phú Quốc, Kiên Giang','SDT' => '02973846789', 'EMAIL' => 'info@khaihoan.com.vn',          'IS_DELETED' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['TENNCC' => 'Công ty CP Thực phẩm Masan',                 'DIACHI' => 'Tầng 12, Tòa nhà MPlaza, 39 Lê Duẩn, Quận 1, TP.HCM','SDT' => '02839400888', 'EMAIL' => 'contact@masangroup.com',       'IS_DELETED' => 0, 'created_at' => $now, 'updated_at' => $now],
            // Hàng tiêu dùng
            ['TENNCC' => 'Công ty TNHH Unilever Việt Nam',             'DIACHI' => '156 Nguyễn Lương Bằng, KCN Sóng Thần, Bình Dương', 'SDT' => '02743756000', 'EMAIL' => 'info@unilever.com.vn',          'IS_DELETED' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['TENNCC' => 'Công ty CP Hàng tiêu dùng Masan (Omachi)',   'DIACHI' => '39 Lê Duẩn, Bến Nghé, Quận 1, TP.HCM',            'SDT' => '02839400999', 'EMAIL' => 'omachi@masanconsumer.com.vn',   'IS_DELETED' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['TENNCC' => 'Công ty CP Sữa TH True Milk',                'DIACHI' => 'Nghĩa Đàn, Nghệ An',                               'SDT' => '02383654321', 'EMAIL' => 'contact@thmilk.vn',             'IS_DELETED' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['TENNCC' => 'Công ty TNHH Tân Hiệp Phát',                 'DIACHI' => '219 Bình Dương, Thuận An, Bình Dương',              'SDT' => '02743756111', 'EMAIL' => 'info@thp.com.vn',               'IS_DELETED' => 0, 'created_at' => $now, 'updated_at' => $now],
        ]);

        $this->command->info('✓ NhaCungCapSeeder: 12 nhà cung cấp');
    }
}
