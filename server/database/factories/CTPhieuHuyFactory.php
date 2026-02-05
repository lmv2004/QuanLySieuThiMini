<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CTPhieuHuy>
 */
class CTPhieuHuyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'MAPHIEU' => \App\Models\PhieuHuy::factory(),
            'MASP' => \App\Models\SanPham::factory(),
            'ID_TONKHO' => \App\Models\TonKho::factory(),
            'SOLUONG' => fake()->numberBetween(1, 50),
        ];
    }
}
