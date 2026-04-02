<?php

namespace Database\Seeders;

use App\Models\GiamGiaSP;
use App\Models\SanPham;
use Illuminate\Database\Seeder;

class GiamGiaSPSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $miBanhao = SanPham::where('TENSP', 'Mì Hảo Hảo (30g)')->first();
        $cocacola = SanPham::where('TENSP', 'Nước Coca Cola (1.5L)')->first();
        $oreo = SanPham::where('TENSP', 'Bánh Oreo (140g)')->first();

        $data = [
            [
                'MASP' => $miBanhao->MASP,
                'TEN_CHUONG_TRINH' => 'Sale Tết 2024',
                'LOAI_GIAM' => 1, // 1 = Fixed amount, 0 = Percent
                'GIATRI_GIAM' => 10000,
                'NGAYBD' => '2024-01-01',
                'NGAYKT' => '2024-02-01',
                'TRANGTHAI' => 1,
                'IS_DELETED' => false,
            ],
            [
                'MASP' => $cocacola->MASP,
                'TEN_CHUONG_TRINH' => 'Hè mát lạnh',
                'LOAI_GIAM' => 0, // 0 = Percent
                'GIATRI_GIAM' => 15,
                'NGAYBD' => '2024-05-01',
                'NGAYKT' => '2024-08-31',
                'TRANGTHAI' => 1,
                'IS_DELETED' => false,
            ],
            [
                'MASP' => $oreo->MASP,
                'TEN_CHUONG_TRINH' => 'Flash Sale',
                'LOAI_GIAM' => 1,
                'GIATRI_GIAM' => 20000,
                'NGAYBD' => '2024-03-15',
                'NGAYKT' => '2024-03-30',
                'TRANGTHAI' => 1,
                'IS_DELETED' => false,
            ],
        ];

        foreach ($data as $gg) {
            GiamGiaSP::create($gg);
        }
    }
}
