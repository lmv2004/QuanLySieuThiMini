<?php

namespace Database\Seeders;

use App\Models\ChucVu;
use Illuminate\Database\Seeder;

class ChucVuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'CODE' => 'ADMIN',
                'TENCHUCVU' => 'Quản trị viên',
                'MOTA' => 'Toàn quyền hệ thống',
                'IS_DELETED' => false,
            ],
            [
                'CODE' => 'QUANLY',
                'TENCHUCVU' => 'Quản lý cửa hàng',
                'MOTA' => 'Quản lý sản phẩm, khách hàng, nhập xuất',
                'IS_DELETED' => false,
            ],
            [
                'CODE' => 'THUNGAN',
                'TENCHUCVU' => 'Thu ngân',
                'MOTA' => 'Bán hàng, thanh toán',
                'IS_DELETED' => false,
            ],
            [
                'CODE' => 'NVKHO',
                'TENCHUCVU' => 'Nhân viên kho',
                'MOTA' => 'Quản lý kho hàng, nhập xuất',
                'IS_DELETED' => false,
            ],
        ];

        foreach ($data as $chucVu) {
            ChucVu::create($chucVu);
        }
    }
}
