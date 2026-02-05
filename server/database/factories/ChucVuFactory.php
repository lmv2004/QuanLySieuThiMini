<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ChucVu>
 */
class ChucVuFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'TENCHUCVU' => fake()->randomElement(['Quản lý', 'Thu ngân', 'Nhân viên kho', 'Bảo vệ', 'Kế toán']),
            'MOTA' => fake()->sentence(),
            'IS_DELETED' => 0,
        ];
    }
}
