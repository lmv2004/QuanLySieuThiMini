<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TonKho>
 */
class TonKhoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'MASP' => \App\Models\SanPham::factory(),
            'SOLUONG_CON_LAI' => fake()->numberBetween(0, 1000),
            'GIANHAP' => fake()->numberBetween(5000, 400000),
            'HANSUDUNG' => fake()->optional()->dateTimeBetween('now', '+2 years'),
            'NGAYNHAP' => fake()->dateTimeBetween('-6 months', 'now'),
            'MAPHIEUNHAP' => \App\Models\PhieuNhap::factory(),
            'IS_ACTIVE' => 1,
        ];
    }
}
