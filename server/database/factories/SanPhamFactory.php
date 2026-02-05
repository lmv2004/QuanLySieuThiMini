<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SanPham>
 */
class SanPhamFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'BARCODE' => fake()->ean13(),
            'TENSP' => fake()->words(3, true),
            'MOTA' => fake()->sentence(),
            'DVT' => fake()->randomElement(['Cái', 'Hộp', 'Kg', 'Lốc', 'Chai', 'Gói']),
            'HINHANH' => fake()->imageUrl(640, 480, 'products'),
            'GIABAN' => fake()->numberBetween(10000, 500000),
            'MALOAI' => \App\Models\LoaiSanPham::factory(),
            'MANCC' => \App\Models\NhaCungCap::factory(),
            'IS_DELETED' => 0,
        ];
    }
}
