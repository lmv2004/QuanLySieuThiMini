<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PhieuHuy>
 */
class PhieuHuyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'NGAYLAP' => fake()->dateTimeBetween('-3 months', 'now'),
            'MANV' => \App\Models\NhanVien::factory(),
            'LYDO' => fake()->randomElement(['Hàng hết hạn', 'Vỡ hỏng', 'Mất chất lượng', 'Thay đổi bao bì']),
            'IS_DELETED' => 0,
        ];
    }
}
