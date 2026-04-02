<?php

namespace Database\Seeders;

use App\Models\TaiKhoan;
use App\Models\NhanVien;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TaiKhoanSeeder extends Seeder
{
    /**
     * Seed tài khoản cho các nhân viên
     * Admin sẽ được gắn tất cả permissions sau đó ở RolePermissionSeeder
     * Pass: admin123 (riêng admin), các account khác: 123456
     */
    public function run(): void
    {
        // Lấy nhân viên đã seed (với email @gmail.com)
        $admin = NhanVien::where('EMAIL', 'admin@gmail.com')->first();
        $quanly = NhanVien::where('EMAIL', 'quanly@gmail.com')->first();
        $thungan = NhanVien::where('EMAIL', 'thungan@gmail.com')->first();
        $nvkho = NhanVien::where('EMAIL', 'nvkho@gmail.com')->first();

        $data = [
            [
                'TENTK' => 'admin',
                'MATKHAU' => Hash::make('admin123'),
                'EMAIL' => 'admin@gmail.com',
                'MANV' => $admin?->MANV,
                'SOLANSAI' => 0,
                'KHOA_TK' => false,
                'IS_DELETED' => false,
            ],
            [
                'TENTK' => 'quanly',
                'MATKHAU' => Hash::make('123456'),
                'EMAIL' => 'quanly@gmail.com',
                'MANV' => $quanly?->MANV,
                'SOLANSAI' => 0,
                'KHOA_TK' => false,
                'IS_DELETED' => false,
            ],
            [
                'TENTK' => 'thungan',
                'MATKHAU' => Hash::make('123456'),
                'EMAIL' => 'thungan@gmail.com',
                'MANV' => $thungan?->MANV,
                'SOLANSAI' => 0,
                'KHOA_TK' => false,
                'IS_DELETED' => false,
            ],
            [
                'TENTK' => 'nvkho',
                'MATKHAU' => Hash::make('123456'),
                'EMAIL' => 'nvkho@gmail.com',
                'MANV' => $nvkho?->MANV,
                'SOLANSAI' => 0,
                'KHOA_TK' => false,
                'IS_DELETED' => false,
            ],
        ];

        foreach ($data as $taiKhoan) {
            if ($taiKhoan['MANV']) {
                TaiKhoan::create($taiKhoan);
            }
        }
    }
}
