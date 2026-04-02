<?php

namespace Database\Seeders;

use App\Models\NhaCungCap;
use Illuminate\Database\Seeder;

class NhaCungCapSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'TENNCC' => 'Công ty Nestlé Việt Nam',
                'DIACHI' => '456 Tạ Quang Bửu, TP.HCM',
                'SDT' => '028 3823 5151',
                'EMAIL' => 'contact@nestle.vn',
                'IS_DELETED' => false,
            ],
            [
                'TENNCC' => 'Công ty Unilever Việt Nam',
                'DIACHI' => '789 Nguyễn Hữu Cảnh, TP.HCM',
                'SDT' => '028 3825 5353',
                'EMAIL' => 'info@unilever.vn',
                'IS_DELETED' => false,
            ],
            [
                'TENNCC' => 'Công ty Procter & Gamble Việt Nam',
                'DIACHI' => '123 Lê Duẩn, TP.HCM',
                'SDT' => '028 3829 8888',
                'EMAIL' => 'contact@pg.vn',
                'IS_DELETED' => false,
            ],
            [
                'TENNCC' => 'Công ty Vinamilk',
                'DIACHI' => '321 Hoàng Quốc Việt, Hà Nội',
                'SDT' => '024 3768 1111',
                'EMAIL' => 'info@vinamilk.vn',
                'IS_DELETED' => false,
            ],
        ];

        foreach ($data as $ncc) {
            NhaCungCap::create($ncc);
        }
    }
}
