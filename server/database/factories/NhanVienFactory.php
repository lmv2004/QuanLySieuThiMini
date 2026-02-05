<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\NhanVien>
 */
class NhanVienFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'TENNV' => fake()->name(),
            'GIOITINH' => fake()->numberBetween(0, 1),
            'CCCD' => fake()->numerify('############'),
            'NGAYSINH' => fake()->dateTimeBetween('-50 years', '-18 years'),
            'SODIENTHOAI' => fake()->numerify('0##########'),
            'EMAIL' => fake()->unique()->safeEmail(),
            'DIACHI' => fake()->address(),
            'NGAYTHAMGIA' => fake()->dateTimeBetween('-5 years', 'now'),
            'MACHUCVU' => \App\Models\ChucVu::factory(),
            'IS_DELETED' => 0,
        ];
    }
}
