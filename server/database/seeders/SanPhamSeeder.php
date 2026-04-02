<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SanPhamSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        DB::table('san_phams')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        // Lấy ID loại và NCC theo thứ tự insert
        $loais = DB::table('loai_san_phams')->orderBy('MALOAI')->pluck('MALOAI', 'TENLOAI');
        $nccs  = DB::table('nha_cung_caps')->orderBy('MANCC')->pluck('MANCC', 'TENNCC');

        $l = fn(string $name) => $loais[$name] ?? $loais->first();
        $n = fn(string $name) => $nccs[$name] ?? $nccs->first();

        $now = now();

        // Helper: tạo barcode giả
        $bc = fn(string $prefix, int $num) => $prefix . str_pad($num, 7, '0', STR_PAD_LEFT);

        $sanPhams = [
            // ── Sữa & Sản phẩm từ sữa ──────────────────────────────────────────
            ['BARCODE' => $bc('893', 1),  'TENSP' => 'Sữa tươi tiệt trùng Vinamilk 1L',          'DVT' => 'Hộp',  'GIABAN' => 32000,  'MALOAI' => $l('Sữa & Sản phẩm từ sữa'),  'MANCC' => $n('Công ty CP Sữa Việt Nam (Vinamilk)')],
            ['BARCODE' => $bc('893', 2),  'TENSP' => 'Sữa chua Vinamilk không đường 100g',        'DVT' => 'Hộp',  'GIABAN' => 8000,   'MALOAI' => $l('Sữa & Sản phẩm từ sữa'),  'MANCC' => $n('Công ty CP Sữa Việt Nam (Vinamilk)')],
            ['BARCODE' => $bc('893', 3),  'TENSP' => 'Sữa đặc Ông Thọ 380g',                     'DVT' => 'Lon',  'GIABAN' => 22000,  'MALOAI' => $l('Sữa & Sản phẩm từ sữa'),  'MANCC' => $n('Công ty CP Sữa Việt Nam (Vinamilk)')],
            ['BARCODE' => $bc('893', 4),  'TENSP' => 'Sữa tươi TH True Milk 180ml',              'DVT' => 'Hộp',  'GIABAN' => 9000,   'MALOAI' => $l('Sữa & Sản phẩm từ sữa'),  'MANCC' => $n('Công ty CP Sữa TH True Milk')],
            ['BARCODE' => $bc('893', 5),  'TENSP' => 'Sữa tươi TH True Milk 1L',                 'DVT' => 'Hộp',  'GIABAN' => 38000,  'MALOAI' => $l('Sữa & Sản phẩm từ sữa'),  'MANCC' => $n('Công ty CP Sữa TH True Milk')],

            // ── Mì - Cháo - Bún ăn liền ────────────────────────────────────────
            ['BARCODE' => $bc('893', 6),  'TENSP' => 'Mì Hảo Hảo tôm chua cay 75g',             'DVT' => 'Gói',  'GIABAN' => 5000,   'MALOAI' => $l('Mì - Cháo - Bún ăn liền'), 'MANCC' => $n('Công ty TNHH Acecook Việt Nam')],
            ['BARCODE' => $bc('893', 7),  'TENSP' => 'Mì Hảo Hảo lẩu thái 75g',                 'DVT' => 'Gói',  'GIABAN' => 5000,   'MALOAI' => $l('Mì - Cháo - Bún ăn liền'), 'MANCC' => $n('Công ty TNHH Acecook Việt Nam')],
            ['BARCODE' => $bc('893', 8),  'TENSP' => 'Mì Omachi sốt spaghetti 80g',              'DVT' => 'Gói',  'GIABAN' => 7500,   'MALOAI' => $l('Mì - Cháo - Bún ăn liền'), 'MANCC' => $n('Công ty CP Hàng tiêu dùng Masan (Omachi)')],
            ['BARCODE' => $bc('893', 9),  'TENSP' => 'Mì Omachi khoai tây sườn hầm 80g',         'DVT' => 'Gói',  'GIABAN' => 7500,   'MALOAI' => $l('Mì - Cháo - Bún ăn liền'), 'MANCC' => $n('Công ty CP Hàng tiêu dùng Masan (Omachi)')],
            ['BARCODE' => $bc('893', 10), 'TENSP' => 'Cháo ăn liền Acecook vị thịt bằm 70g',    'DVT' => 'Gói',  'GIABAN' => 6000,   'MALOAI' => $l('Mì - Cháo - Bún ăn liền'), 'MANCC' => $n('Công ty TNHH Acecook Việt Nam')],

            // ── Đồ uống không cồn ──────────────────────────────────────────────
            ['BARCODE' => $bc('893', 11), 'TENSP' => 'Nước ngọt Pepsi 330ml',                    'DVT' => 'Lon',  'GIABAN' => 12000,  'MALOAI' => $l('Đồ uống không cồn'),       'MANCC' => $n('Công ty TNHH Tân Hiệp Phát')],
            ['BARCODE' => $bc('893', 12), 'TENSP' => 'Nước ngọt Coca-Cola 330ml',                'DVT' => 'Lon',  'GIABAN' => 12000,  'MALOAI' => $l('Đồ uống không cồn'),       'MANCC' => $n('Công ty TNHH Tân Hiệp Phát')],
            ['BARCODE' => $bc('893', 13), 'TENSP' => 'Trà xanh không độ 500ml',                  'DVT' => 'Chai', 'GIABAN' => 10000,  'MALOAI' => $l('Đồ uống không cồn'),       'MANCC' => $n('Công ty TNHH Tân Hiệp Phát')],
            ['BARCODE' => $bc('893', 14), 'TENSP' => 'Nước tăng lực Sting dâu 330ml',            'DVT' => 'Lon',  'GIABAN' => 11000,  'MALOAI' => $l('Đồ uống không cồn'),       'MANCC' => $n('Công ty TNHH Tân Hiệp Phát')],
            ['BARCODE' => $bc('893', 15), 'TENSP' => 'Nước suối Aquafina 500ml',                 'DVT' => 'Chai', 'GIABAN' => 7000,   'MALOAI' => $l('Đồ uống không cồn'),       'MANCC' => $n('Công ty TNHH Tân Hiệp Phát')],
            ['BARCODE' => $bc('893', 16), 'TENSP' => 'Nước cam ép Twister 455ml',                'DVT' => 'Chai', 'GIABAN' => 15000,  'MALOAI' => $l('Đồ uống không cồn'),       'MANCC' => $n('Công ty TNHH Tân Hiệp Phát')],

            // ── Đồ uống có cồn ─────────────────────────────────────────────────
            ['BARCODE' => $bc('893', 17), 'TENSP' => 'Bia Sài Gòn Đỏ 330ml',                    'DVT' => 'Lon',  'GIABAN' => 14000,  'MALOAI' => $l('Đồ uống có cồn'),          'MANCC' => $n('Công ty CP Nước giải khát Sài Gòn (Sabeco)')],
            ['BARCODE' => $bc('893', 18), 'TENSP' => 'Bia Sài Gòn Special 330ml',               'DVT' => 'Lon',  'GIABAN' => 16000,  'MALOAI' => $l('Đồ uống có cồn'),          'MANCC' => $n('Công ty CP Nước giải khát Sài Gòn (Sabeco)')],
            ['BARCODE' => $bc('893', 19), 'TENSP' => 'Bia 333 Export 330ml',                    'DVT' => 'Lon',  'GIABAN' => 14000,  'MALOAI' => $l('Đồ uống có cồn'),          'MANCC' => $n('Công ty CP Nước giải khát Sài Gòn (Sabeco)')],

            // ── Bánh kẹo & Snack ───────────────────────────────────────────────
            ['BARCODE' => $bc('893', 20), 'TENSP' => 'Bánh quy Kinh Đô hộp thiếc 454g',         'DVT' => 'Hộp',  'GIABAN' => 85000,  'MALOAI' => $l('Bánh kẹo & Snack'),        'MANCC' => $n('Công ty CP Kinh Đô (Kido)')],
            ['BARCODE' => $bc('893', 21), 'TENSP' => 'Bánh Cosy Marie 200g',                    'DVT' => 'Gói',  'GIABAN' => 22000,  'MALOAI' => $l('Bánh kẹo & Snack'),        'MANCC' => $n('Công ty CP Kinh Đô (Kido)')],
            ['BARCODE' => $bc('893', 22), 'TENSP' => 'Snack Oishi tôm 40g',                     'DVT' => 'Gói',  'GIABAN' => 8000,   'MALOAI' => $l('Bánh kẹo & Snack'),        'MANCC' => $n('Công ty CP Kinh Đô (Kido)')],
            ['BARCODE' => $bc('893', 23), 'TENSP' => 'Kẹo dừa Bến Tre 200g',                   'DVT' => 'Gói',  'GIABAN' => 35000,  'MALOAI' => $l('Bánh kẹo & Snack'),        'MANCC' => $n('Công ty CP Kinh Đô (Kido)')],

            // ── Gia vị & Dầu ăn ───────────────────────────────────────────────
            ['BARCODE' => $bc('893', 24), 'TENSP' => 'Nước mắm Phú Quốc Khải Hoàn 40° 500ml',  'DVT' => 'Chai', 'GIABAN' => 45000,  'MALOAI' => $l('Gia vị & Dầu ăn'),         'MANCC' => $n('Công ty TNHH Nước mắm Phú Quốc Khải Hoàn')],
            ['BARCODE' => $bc('893', 25), 'TENSP' => 'Tương ớt Cholimex 270g',                  'DVT' => 'Chai', 'GIABAN' => 18000,  'MALOAI' => $l('Gia vị & Dầu ăn'),         'MANCC' => $n('Công ty TNHH Gia vị Cholimex')],
            ['BARCODE' => $bc('893', 26), 'TENSP' => 'Tương cà Cholimex 270g',                  'DVT' => 'Chai', 'GIABAN' => 18000,  'MALOAI' => $l('Gia vị & Dầu ăn'),         'MANCC' => $n('Công ty TNHH Gia vị Cholimex')],
            ['BARCODE' => $bc('893', 27), 'TENSP' => 'Dầu ăn Tường An 1L',                     'DVT' => 'Chai', 'GIABAN' => 52000,  'MALOAI' => $l('Gia vị & Dầu ăn'),         'MANCC' => $n('Công ty CP Dầu thực vật Tường An')],
            ['BARCODE' => $bc('893', 28), 'TENSP' => 'Nước tương Maggi 700ml',                  'DVT' => 'Chai', 'GIABAN' => 28000,  'MALOAI' => $l('Gia vị & Dầu ăn'),         'MANCC' => $n('Công ty CP Thực phẩm Masan')],
            ['BARCODE' => $bc('893', 29), 'TENSP' => 'Hạt nêm Knorr thịt thăn xương ống 400g', 'DVT' => 'Gói',  'GIABAN' => 42000,  'MALOAI' => $l('Gia vị & Dầu ăn'),         'MANCC' => $n('Công ty CP Thực phẩm Masan')],
            ['BARCODE' => $bc('893', 30), 'TENSP' => 'Đường Biên Hòa tinh luyện 1kg',           'DVT' => 'Túi',  'GIABAN' => 25000,  'MALOAI' => $l('Gia vị & Dầu ăn'),         'MANCC' => $n('Công ty CP Thực phẩm Masan')],

            // ── Gạo & Ngũ cốc ─────────────────────────────────────────────────
            ['BARCODE' => $bc('893', 31), 'TENSP' => 'Gạo ST25 túi 5kg',                        'DVT' => 'Túi',  'GIABAN' => 125000, 'MALOAI' => $l('Gạo & Ngũ cốc'),           'MANCC' => $n('Công ty CP Thực phẩm Masan')],
            ['BARCODE' => $bc('893', 32), 'TENSP' => 'Gạo Jasmine túi 5kg',                     'DVT' => 'Túi',  'GIABAN' => 95000,  'MALOAI' => $l('Gạo & Ngũ cốc'),           'MANCC' => $n('Công ty CP Thực phẩm Masan')],

            // ── Chăm sóc cá nhân ──────────────────────────────────────────────
            ['BARCODE' => $bc('893', 33), 'TENSP' => 'Dầu gội Clear men mát lạnh 380g',         'DVT' => 'Chai', 'GIABAN' => 68000,  'MALOAI' => $l('Chăm sóc cá nhân'),        'MANCC' => $n('Công ty TNHH Unilever Việt Nam')],
            ['BARCODE' => $bc('893', 34), 'TENSP' => 'Sữa tắm Dove dưỡng ẩm 530g',             'DVT' => 'Chai', 'GIABAN' => 75000,  'MALOAI' => $l('Chăm sóc cá nhân'),        'MANCC' => $n('Công ty TNHH Unilever Việt Nam')],
            ['BARCODE' => $bc('893', 35), 'TENSP' => 'Kem đánh răng P/S bảo vệ 12 giờ 230g',   'DVT' => 'Tuýp', 'GIABAN' => 38000,  'MALOAI' => $l('Chăm sóc cá nhân'),        'MANCC' => $n('Công ty TNHH Unilever Việt Nam')],
            ['BARCODE' => $bc('893', 36), 'TENSP' => 'Xà phòng Lifebuoy kháng khuẩn 90g',      'DVT' => 'Bánh', 'GIABAN' => 12000,  'MALOAI' => $l('Chăm sóc cá nhân'),        'MANCC' => $n('Công ty TNHH Unilever Việt Nam')],

            // ── Đồ dùng gia đình ──────────────────────────────────────────────
            ['BARCODE' => $bc('893', 37), 'TENSP' => 'Nước rửa chén Sunlight chanh 750ml',      'DVT' => 'Chai', 'GIABAN' => 28000,  'MALOAI' => $l('Đồ dùng gia đình'),        'MANCC' => $n('Công ty TNHH Unilever Việt Nam')],
            ['BARCODE' => $bc('893', 38), 'TENSP' => 'Nước lau sàn Vim hương chanh 1L',         'DVT' => 'Chai', 'GIABAN' => 32000,  'MALOAI' => $l('Đồ dùng gia đình'),        'MANCC' => $n('Công ty TNHH Unilever Việt Nam')],
            ['BARCODE' => $bc('893', 39), 'TENSP' => 'Giấy vệ sinh Pulppy 10 cuộn',             'DVT' => 'Gói',  'GIABAN' => 55000,  'MALOAI' => $l('Đồ dùng gia đình'),        'MANCC' => $n('Công ty TNHH Unilever Việt Nam')],
            ['BARCODE' => $bc('893', 40), 'TENSP' => 'Túi rác Sài Gòn xanh 55x65cm (10 cái)',  'DVT' => 'Cuộn', 'GIABAN' => 15000,  'MALOAI' => $l('Đồ dùng gia đình'),        'MANCC' => $n('Công ty TNHH Unilever Việt Nam')],

            // ── Đồ dùng em bé ─────────────────────────────────────────────────
            ['BARCODE' => $bc('893', 41), 'TENSP' => 'Tã giấy Bobby size M 56 miếng',           'DVT' => 'Gói',  'GIABAN' => 185000, 'MALOAI' => $l('Đồ dùng em bé'),           'MANCC' => $n('Công ty TNHH Unilever Việt Nam')],
            ['BARCODE' => $bc('893', 42), 'TENSP' => 'Khăn ướt Bobby 100 tờ',                  'DVT' => 'Gói',  'GIABAN' => 35000,  'MALOAI' => $l('Đồ dùng em bé'),           'MANCC' => $n('Công ty TNHH Unilever Việt Nam')],
        ];

        $rows = array_map(fn($sp) => array_merge($sp, [
            'IS_DELETED' => 0,
            'created_at' => $now,
            'updated_at' => $now,
        ]), $sanPhams);

        DB::table('san_phams')->insert($rows);
        $this->command->info('✓ SanPhamSeeder: ' . count($rows) . ' sản phẩm');
    }
}
