<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PhieuNhap>
 */
class PhieuNhapFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'NGAYLAP' => fake()->dateTimeBetween('-6 months', 'now'),
            'MANV' => \App\Models\NhanVien::factory(),
            'TONGTIEN' => fake()->numberBetween(1000000, 50000000),
            'GCHU' => fake()->optional()->sentence(),
            'IS_DELETED' => 0,
        ];
    }
}
