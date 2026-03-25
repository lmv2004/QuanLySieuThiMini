<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ChucVuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $chucVus = [
            [
                'CODE' => 'manager',
                'TENCHUCVU' => 'Quản lý cửa hàng',
                'MOTA' => 'Người quản lý cửa hàng có quyền quản lý toàn bộ hệ thống'
            ],
            [
                'CODE' => 'cashier',
                'TENCHUCVU' => 'Nhân viên thu ngân',
                'MOTA' => 'Nhân viên thu ngân xử lý các giao dịch bán hàng'
            ],
            [
                'CODE' => 'warehouse',
                'TENCHUCVU' => 'Nhân viên kho',
                'MOTA' => 'Nhân viên kho quản lý hàng tồn kho'
            ],
        ];

        foreach ($chucVus as $cv) {
            \App\Models\ChucVu::updateOrCreate(
                ['CODE' => $cv['CODE']],
                $cv
            );
        }
    }
}
