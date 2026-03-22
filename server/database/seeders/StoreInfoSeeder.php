<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\StoreInfo;

class StoreInfoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Only create if no store info exists
        if (StoreInfo::count() === 0) {
            StoreInfo::create([
                'name' => 'Siêu Thị Mini',
                'address' => '123 Đường ABC, Quận 1, TP.HCM',
                'phone' => 'Hotline: 0123 456 789',
                'tax_code' => '0123456789',
                'note' => 'Cảm ơn quý khách và hẹn gặp lại!'
            ]);
        }
    }
}
