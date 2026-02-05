<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\HoaDon>
 */
class HoaDonFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $tongtien = fake()->numberBetween(50000, 5000000);
        $tiengiam = fake()->numberBetween(0, $tongtien * 0.3);

        return [
            'NGAYHD' => fake()->dateTimeBetween('-1 month', 'now'),
            'HINHTHUC' => fake()->randomElement(['Tiền mặt', 'Chuyển khoản', 'QR Code', 'Thẻ']),
            'TONGTIEN_HANG' => $tongtien,
            'TIEN_GIAM_VOUCHER' => $tiengiam,
            'TONG_THANHTOAN' => $tongtien - $tiengiam,
            'MANV' => \App\Models\NhanVien::factory(),
            'MAKH' => \App\Models\KhachHang::factory(),
            'SOVOUCHER' => fake()->optional()->randomElement([\App\Models\Voucher::factory(), null]),
            'IS_DELETED' => 0,
        ];
    }
}
