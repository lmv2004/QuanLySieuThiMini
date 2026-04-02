<?php

namespace Database\Seeders;

use App\Models\StoreInfo;
use Illuminate\Database\Seeder;

class StoreInfoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        StoreInfo::updateOrCreate(
            ['id' => 1],
            [
                'name' => 'Siêu Thị Mini - Quản Lý Hàng',
                'address' => '999 Đường Lê Lợi, Quận 1, TP.HCM',
                'phone' => '0283825555',
                'tax_code' => '0123456789',
                'note' => 'Cửa hàng siêu thị mini quản lý hàng hóa, bán hàng và tồn kho',
            ]
        );
    }
}
