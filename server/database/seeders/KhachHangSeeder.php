<?php

namespace Database\Seeders;

use App\Models\KhachHang;
use Illuminate\Database\Seeder;

class KhachHangSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            ['TENKH' => 'Phạm Thị Mộng', 'SODIENTHOAI' => '0911111111', 'DIACHI' => '123 Nguyễn Huệ, TP.HCM', 'DIEMTHUONG' => 0, 'IS_DELETED' => false],
            ['TENKH' => 'Trương Văn A', 'SODIENTHOAI' => '0922222222', 'DIACHI' => '456 Lê Lợi, TP.HCM', 'DIEMTHUONG' => 0, 'IS_DELETED' => false],
            ['TENKH' => 'Võ Thị Ngân', 'SODIENTHOAI' => '0933333333', 'DIACHI' => '789 Trần Hưng Đạo, TP.HCM', 'DIEMTHUONG' => 0, 'IS_DELETED' => false],
            ['TENKH' => 'Dương Văn B', 'SODIENTHOAI' => '0944444444', 'DIACHI' => '321 Võ Văn Kiệt, TP.HCM', 'DIEMTHUONG' => 0, 'IS_DELETED' => false],
            ['TENKH' => 'Hoàng Thị C', 'SODIENTHOAI' => '0955555555', 'DIACHI' => '654 Nguyễn Thái Sơn, TP.HCM', 'DIEMTHUONG' => 0, 'IS_DELETED' => false],
            ['TENKH' => 'Lý Văn D', 'SODIENTHOAI' => '0966666666', 'DIACHI' => '987 Cộng Hòa, TP.HCM', 'DIEMTHUONG' => 0, 'IS_DELETED' => false],
            ['TENKH' => 'Đặng Thị E', 'SODIENTHOAI' => '0977777777', 'DIACHI' => '111 Phan Bội Châu, TP.HCM', 'DIEMTHUONG' => 0, 'IS_DELETED' => false],
            ['TENKH' => 'Cao Văn F', 'SODIENTHOAI' => '0988888888', 'DIACHI' => '222 Bạch Đằng, TP.HCM', 'DIEMTHUONG' => 0, 'IS_DELETED' => false],
            ['TENKH' => 'Bùi Thị G', 'SODIENTHOAI' => '0999999999', 'DIACHI' => '333 Điện Biên Phủ, TP.HCM', 'DIEMTHUONG' => 0, 'IS_DELETED' => false],
            ['TENKH' => 'Vũ Văn H', 'SODIENTHOAI' => '0900000000', 'DIACHI' => '444 La Thành, TP.HCM', 'DIEMTHUONG' => 0, 'IS_DELETED' => false],
        ];

        foreach ($data as $kh) {
            KhachHang::create($kh);
        }
    }
}
