<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CTHoaDon>
 */
class CTHoaDonFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $giagoc = fake()->numberBetween(10000, 500000);
        $giathucte = $giagoc - fake()->numberBetween(0, $giagoc * 0.2);
        $soluong = fake()->numberBetween(1, 10);

        return [
            'MAHD' => \App\Models\HoaDon::factory(),
            'MASP' => \App\Models\SanPham::factory(),
            'ID_TONKHO' => \App\Models\TonKho::factory(),
            'SOLUONG' => $soluong,
            'GIABAN_GOC' => $giagoc,
            'GIABAN_THUCTE' => $giathucte,
            'THANHTIEN' => $giathucte * $soluong,
        ];
    }
}
