<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class NhanVienSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $chucVuIds = \App\Models\ChucVu::pluck('MACHUCVU')->toArray();

        \App\Models\NhanVien::factory(20)->create([
            'MACHUCVU' => fake()->randomElement($chucVuIds),
        ]);
    }
}
