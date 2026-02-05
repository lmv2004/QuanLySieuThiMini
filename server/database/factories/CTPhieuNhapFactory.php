<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CTPhieuNhap>
 */
class CTPhieuNhapFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'MAPHIEU' => \App\Models\PhieuNhap::factory(),
            'MASP' => \App\Models\SanPham::factory(),
            'SOLUONG' => fake()->numberBetween(10, 500),
            'DONGIANHAP' => fake()->numberBetween(5000, 400000),
            'HANSUDUNG' => fake()->optional()->dateTimeBetween('now', '+2 years'),
        ];
    }
}
