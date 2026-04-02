<?php

namespace Database\Seeders;

use App\Models\LoaiSanPham;
use Illuminate\Database\Seeder;

class LoaiSanPhamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            ['TENLOAI' => 'Thực phẩm khô', 'MOTA' => 'Các sản phẩm thực phẩm khô', 'IS_DELETED' => false],
            ['TENLOAI' => 'Đồ uống', 'MOTA' => 'Nước giải khát, nước lọc', 'IS_DELETED' => false],
            ['TENLOAI' => 'Sữa & Sản phẩm từ sữa', 'MOTA' => 'Sữa, sữa chua, phô mai', 'IS_DELETED' => false],
            ['TENLOAI' => 'Bánh kẹo', 'MOTA' => 'Bánh, kẹo, chocolate', 'IS_DELETED' => false],
            ['TENLOAI' => 'Vệ sinh & Mỹ phẩm', 'MOTA' => 'Các sản phẩm vệ sinh cá nhân', 'IS_DELETED' => false],
        ];

        foreach ($data as $loai) {
            LoaiSanPham::create($loai);
        }
    }
}
