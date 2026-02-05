<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\GiamGiaSP>
 */
class GiamGiaSPFactory extends Factory
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
            'TEN_CHUONG_TRINH' => fake()->sentence(3),
            'LOAI_GIAM' => fake()->numberBetween(0, 1),
            'GIATRI_GIAM' => fake()->numberBetween(5000, 50000),
            'NGAYBD' => fake()->dateTimeBetween('now', '+1 week'),
            'NGAYKT' => fake()->dateTimeBetween('+1 week', '+1 month'),
            'TRANGTHAI' => 1,
            'IS_DELETED' => 0,
        ];
    }
}
