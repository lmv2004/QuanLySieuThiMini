<?php

namespace Database\Seeders;

use App\Models\Voucher;
use Illuminate\Database\Seeder;

class VoucherSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'MAVOUCHER' => 'GIAM10K',
                'MOTA' => 'Giảm 10.000đ cho đơn từ 50.000đ',
                'NGAYBD' => '2024-01-01',
                'NGAYKT' => '2024-12-31',
                'GIATRITOITHIEU' => 50000,
                'KMTOITHIEU' => 10000,
                'KMTOIDA' => 10000,
                'PTGIAM' => 0,
                'SOLUOTSD' => 100,
                'SOLUOTSD_DADUNG' => 0,
                'TRANGTHAI' => 1,
                'IS_DELETED' => false,
            ],
            [
                'MAVOUCHER' => 'GIAM15',
                'MOTA' => 'Giảm 15% cho đơn từ 100.000đ',
                'NGAYBD' => '2024-02-01',
                'NGAYKT' => '2024-12-31',
                'GIATRITOITHIEU' => 100000,
                'KMTOITHIEU' => 0,
                'KMTOIDA' => 500000,
                'PTGIAM' => 15,
                'SOLUOTSD' => 50,
                'SOLUOTSD_DADUNG' => 0,
                'TRANGTHAI' => 1,
                'IS_DELETED' => false,
            ],
            [
                'MAVOUCHER' => 'LUCKY50K',
                'MOTA' => 'Giảm 50.000đ cho đơn từ 200.000đ',
                'NGAYBD' => '2024-03-01',
                'NGAYKT' => '2024-12-31',
                'GIATRITOITHIEU' => 200000,
                'KMTOITHIEU' => 50000,
                'KMTOIDA' => 50000,
                'PTGIAM' => 0,
                'SOLUOTSD' => 30,
                'SOLUOTSD_DADUNG' => 0,
                'TRANGTHAI' => 1,
                'IS_DELETED' => false,
            ],
        ];

        foreach ($data as $voucher) {
            Voucher::create($voucher);
        }
    }
}
