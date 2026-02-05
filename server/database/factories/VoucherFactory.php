<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Voucher>
 */
class VoucherFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'MAVOUCHER' => strtoupper(fake()->bothify('??###')),
            'MOTA' => fake()->sentence(),
            'NGAYBD' => fake()->dateTimeBetween('now', '+1 month'),
            'NGAYKT' => fake()->dateTimeBetween('+1 month', '+3 months'),
            'GIATRITOITHIEU' => fake()->numberBetween(50000, 500000),
            'KMTOITHIEU' => fake()->numberBetween(5000, 50000),
            'KMTOIDA' => fake()->numberBetween(50000, 200000),
            'PTGIAM' => fake()->numberBetween(5, 30),
            'SOLUOTSD' => fake()->numberBetween(10, 100),
            'SOLUOTSD_DADUNG' => 0,
            'IS_DELETED' => 0,
        ];
    }
}
