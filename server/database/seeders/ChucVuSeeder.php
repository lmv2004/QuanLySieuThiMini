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
            ['TENCHUCVU' => 'Quản lý', 'MOTA' => 'Quản lý siêu thị'],
            ['TENCHUCVU' => 'Thu ngân', 'MOTA' => 'Nhân viên thu ngân'],
            ['TENCHUCVU' => 'Nhân viên kho', 'MOTA' => 'Quản lý kho hàng'],
            ['TENCHUCVU' => 'Bảo vệ', 'MOTA' => 'Bảo vệ an ninh'],
            ['TENCHUCVU' => 'Kế toán', 'MOTA' => 'Kế toán viên'],
        ];

        foreach ($chucVus as $cv) {
            \App\Models\ChucVu::create($cv);
        }
    }
}
