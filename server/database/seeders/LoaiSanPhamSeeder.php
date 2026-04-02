<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LoaiSanPhamSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        DB::table('loai_san_phams')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        $now = now();
        DB::table('loai_san_phams')->insert([
            ['TENLOAI' => 'Thực phẩm tươi sống',    'MOTA' => 'Rau củ quả, thịt heo, thịt bò, cá tươi, hải sản',          'IS_DELETED' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['TENLOAI' => 'Thực phẩm đông lạnh',     'MOTA' => 'Thịt đông lạnh, hải sản đông lạnh, thực phẩm chế biến sẵn', 'IS_DELETED' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['TENLOAI' => 'Đồ uống có cồn',          'MOTA' => 'Bia, rượu vang, rượu mạnh các loại',                        'IS_DELETED' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['TENLOAI' => 'Đồ uống không cồn',       'MOTA' => 'Nước ngọt, nước ép, trà, cà phê đóng chai, nước suối',      'IS_DELETED' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['TENLOAI' => 'Sữa & Sản phẩm từ sữa',  'MOTA' => 'Sữa tươi, sữa hộp, sữa chua, phô mai, bơ',                 'IS_DELETED' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['TENLOAI' => 'Mì - Cháo - Bún ăn liền', 'MOTA' => 'Mì gói, cháo ăn liền, bún khô, phở ăn liền',               'IS_DELETED' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['TENLOAI' => 'Bánh kẹo & Snack',        'MOTA' => 'Bánh quy, kẹo, snack, bắp rang, bánh gạo',                  'IS_DELETED' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['TENLOAI' => 'Gia vị & Dầu ăn',         'MOTA' => 'Nước mắm, tương ớt, dầu ăn, muối, đường, bột ngọt',        'IS_DELETED' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['TENLOAI' => 'Gạo & Ngũ cốc',           'MOTA' => 'Gạo tẻ, gạo nếp, yến mạch, đậu các loại',                  'IS_DELETED' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['TENLOAI' => 'Chăm sóc cá nhân',        'MOTA' => 'Dầu gội, sữa tắm, kem đánh răng, xà phòng, băng vệ sinh',  'IS_DELETED' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['TENLOAI' => 'Đồ dùng gia đình',        'MOTA' => 'Nước rửa chén, nước lau sàn, giấy vệ sinh, túi rác',        'IS_DELETED' => 0, 'created_at' => $now, 'updated_at' => $now],
            ['TENLOAI' => 'Đồ dùng em bé',           'MOTA' => 'Tã giấy, sữa bột trẻ em, khăn ướt, đồ chơi nhỏ',           'IS_DELETED' => 0, 'created_at' => $now, 'updated_at' => $now],
        ]);

        $this->command->info('✓ LoaiSanPhamSeeder: 12 loại sản phẩm');
    }
}
