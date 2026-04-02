<?php

namespace Database\Seeders;

use App\Models\SanPham;
use App\Models\LoaiSanPham;
use App\Models\NhaCungCap;
use Illuminate\Database\Seeder;

class SanPhamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $loaiThucPhamKho = LoaiSanPham::where('TENLOAI', 'Thực phẩm khô')->first();
        $loaiDoUong = LoaiSanPham::where('TENLOAI', 'Đồ uống')->first();
        $loaiSua = LoaiSanPham::where('TENLOAI', 'Sữa & Sản phẩm từ sữa')->first();
        $loaiBanhKeo = LoaiSanPham::where('TENLOAI', 'Bánh kẹo')->first();
        $loaiVeSinh = LoaiSanPham::where('TENLOAI', 'Vệ sinh & Mỹ phẩm')->first();

        $nestle = NhaCungCap::where('TENNCC', 'Công ty Nestlé Việt Nam')->first();
        $unilever = NhaCungCap::where('TENNCC', 'Công ty Unilever Việt Nam')->first();
        $pg = NhaCungCap::where('TENNCC', 'Công ty Procter & Gamble Việt Nam')->first();
        $vinamilk = NhaCungCap::where('TENNCC', 'Công ty Vinamilk')->first();

        $data = [
            [
                'BARCODE' => '8934567800001',
                'TENSP' => 'Mì Hảo Hảo (30g)',
                'MOTA' => 'Mì ăn liền Hảo Hảo vị tôm cua',
                'DVT' => 'Gói',
                'GIABAN' => 2500,
                'MALOAI' => $loaiThucPhamKho->MALOAI,
                'MANCC' => $nestle->MANCC,
                'IS_DELETED' => false,
            ],
            [
                'BARCODE' => '8934567800002',
                'TENSP' => 'Nước Coca Cola (1.5L)',
                'MOTA' => 'Nước ngọt Coca Cola chai 1.5 lít',
                'DVT' => 'Chai',
                'GIABAN' => 28000,
                'MALOAI' => $loaiDoUong->MALOAI,
                'MANCC' => $nestle->MANCC,
                'IS_DELETED' => false,
            ],
            [
                'BARCODE' => '8934567800003',
                'TENSP' => 'Sữa Vinamilk (180ml)',
                'MOTA' => 'Sữa tươi Vinamilk hộp 180ml',
                'DVT' => 'Hộp',
                'GIABAN' => 7500,
                'MALOAI' => $loaiSua->MALOAI,
                'MANCC' => $vinamilk->MANCC,
                'IS_DELETED' => false,
            ],
            [
                'BARCODE' => '8934567800004',
                'TENSP' => 'Bánh Oreo (140g)',
                'MOTA' => 'Bánh quy Oreo túi 140 grams',
                'DVT' => 'Túi',
                'GIABAN' => 15000,
                'MALOAI' => $loaiBanhKeo->MALOAI,
                'MANCC' => $unilever->MANCC,
                'IS_DELETED' => false,
            ],
            [
                'BARCODE' => '8934567800005',
                'TENSP' => 'Dầu gội Sunsilk (200ml)',
                'MOTA' => 'Dầu gội đầu Sunsilk 200 ml',
                'DVT' => 'Chai',
                'GIABAN' => 18000,
                'MALOAI' => $loaiVeSinh->MALOAI,
                'MANCC' => $unilever->MANCC,
                'IS_DELETED' => false,
            ],
            [
                'BARCODE' => '8934567800006',
                'TENSP' => 'Cà phê Nescafé (200g)',
                'MOTA' => 'Cà phê hòa tan Nescafé 200g',
                'DVT' => 'Lọ',
                'GIABAN' => 45000,
                'MALOAI' => $loaiThucPhamKho->MALOAI,
                'MANCC' => $nestle->MANCC,
                'IS_DELETED' => false,
            ],
            [
                'BARCODE' => '8934567800007',
                'TENSP' => 'Sữa Chua Vinamilk (100g)',
                'MOTA' => 'Sữa chua có đường Vinamilk 100g',
                'DVT' => 'Hộp',
                'GIABAN' => 5000,
                'MALOAI' => $loaiSua->MALOAI,
                'MANCC' => $vinamilk->MANCC,
                'IS_DELETED' => false,
            ],
            [
                'BARCODE' => '8934567800008',
                'TENSP' => 'Xà phòng Lifebuoy (90g)',
                'MOTA' => 'Xà phòng diệt khuẩn Lifebuoy 90g',
                'DVT' => 'Bánh',
                'GIABAN' => 8000,
                'MALOAI' => $loaiVeSinh->MALOAI,
                'MANCC' => $unilever->MANCC,
                'IS_DELETED' => false,
            ],
            [
                'BARCODE' => '8934567800009',
                'TENSP' => 'Kẹo Halls (50g)',
                'MOTA' => 'Kẹo thơm miệng Halls vị bạc hà',
                'DVT' => 'Gói',
                'GIABAN' => 12000,
                'MALOAI' => $loaiBanhKeo->MALOAI,
                'MANCC' => $pg->MANCC,
                'IS_DELETED' => false,
            ],
            [
                'BARCODE' => '8934567800010',
                'TENSP' => 'Nước Suối Aquafina (1.5L)',
                'MOTA' => 'Nước suối tinh khiết Aquafina',
                'DVT' => 'Chai',
                'GIABAN' => 8000,
                'MALOAI' => $loaiDoUong->MALOAI,
                'MANCC' => $pg->MANCC,
                'IS_DELETED' => false,
            ],
        ];

        foreach ($data as $sp) {
            SanPham::create($sp);
        }
    }
}
