<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\LoaiSanPham>
 */
class LoaiSanPhamFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'TENLOAI' => fake()->randomElement(['Thực phẩm tươi sống', 'Thực phẩm đông lạnh', 'Đồ uống', 'Bánh kẹo', 'Đồ dùng cá nhân', 'Đồ gia dụng', 'Sữa & Sản phẩm sữa', 'Gia vị nấu ăn']),
            'MOTA' => fake()->sentence(),
            'IS_DELETED' => 0,
        ];
    }
}
