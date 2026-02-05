<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\KhachHang>
 */
class KhachHangFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'TENKH' => fake()->name(),
            'SODIENTHOAI' => fake()->numerify('0##########'),
            'DIACHI' => fake()->address(),
            'DIEMTHUONG' => fake()->numberBetween(0, 10000),
            'IS_DELETED' => 0,
        ];
    }
}
