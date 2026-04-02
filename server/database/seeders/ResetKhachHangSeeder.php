<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class ResetKhachHangSeeder extends Seeder
{
    /**
     * Delegate sang KhachHangSeeder (đã có truncate bên trong).
     */
    public function run(): void
    {
        $this->call(KhachHangSeeder::class);
    }
}
