<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LoaiSanPhamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $loaiSanPhams = [
            ['TENLOAI' => 'Thực phẩm tươi sống', 'MOTA' => 'Rau củ quả, thịt cá tươi'],
            ['TENLOAI' => 'Thực phẩm đông lạnh', 'MOTA' => 'Thực phẩm bảo quản đông lạnh'],
            ['TENLOAI' => 'Đồ uống', 'MOTA' => 'Nước giải khát, nước ngọt'],
            ['TENLOAI' => 'Bánh kẹo', 'MOTA' => 'Snack, bánh ngọt'],
            ['TENLOAI' => 'Đồ dùng cá nhân', 'MOTA' => 'Vệ sinh cá nhân'],
            ['TENLOAI' => 'Đồ gia dụng', 'MOTA' => 'Dụng cụ nhà bếp, vệ sinh'],
            ['TENLOAI' => 'Sữa & Sản phẩm sữa', 'MOTA' => 'Sữa, sữa chua, phô mai'],
            ['TENLOAI' => 'Gia vị nấu ăn', 'MOTA' => 'Muối, đường, dầu ăn'],
        ];

        foreach ($loaiSanPhams as $loai) {
            \App\Models\LoaiSanPham::create($loai);
        }
    }
}
