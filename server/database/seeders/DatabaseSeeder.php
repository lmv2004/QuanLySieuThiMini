<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // NHÓM 1: Các bảng cơ bản không phụ thuộc
        $this->call([
            LoaiSanPhamSeeder::class,
            NhaCungCapSeeder::class,
            ChucVuSeeder::class,
            KhachHangSeeder::class,
            VoucherSeeder::class,
            StoreInfoSeeder::class,
        ]);

        // NHÓM 2: Nhân viên và tài khoản
        $this->call([
            NhanVienSeeder::class,
            TaiKhoanSeeder::class,
        ]);

        // NHÓM 3: Sản phẩm và giảm giá
        $this->call([
            SanPhamSeeder::class,
            GiamGiaSPSeeder::class,
        ]);

        // NHÓM 4: Phiếu nhập và tồn kho
        $this->call([
            PhieuNhapSeeder::class,
            CTPhieuNhapSeeder::class,
            TonKhoSeeder::class,
        ]);

        // NHÓM 5: Phiếu hủy
        $this->call([
            PhieuHuySeeder::class,
        ]);

        // NHÓM 6: Hóa đơn
        $this->call([
            HoaDonSeeder::class,
        ]);
    }
}
