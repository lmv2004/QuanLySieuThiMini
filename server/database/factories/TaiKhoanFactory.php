<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TaiKhoan>
 */
class TaiKhoanFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'TENTK' => fake()->unique()->userName(),
            'EMAIL' => fake()->unique()->safeEmail(),
            'MATKHAU' => bcrypt('password'),
            'MANV' => \App\Models\NhanVien::factory(),
            'SOLANSAI' => 0,
            'KHOA_TK' => 0,
            'IS_DELETED' => 0,
        ];
    }
}
