<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Trình tự seed: ChucVu → Permission → NhanVien → TaiKhoan → RolePermission → Khách hàng → Sản phẩm & liên quan

        // 1. Seed Chức vụ
        $this->call(ChucVuSeeder::class);

        // 2. Seed Permissions (tất cả quyền)
        $this->call(PermissionSeeder::class);

        // 3. Seed Nhân viên (gắn với Chức vụ)
        $this->call(NhanVienSeeder::class);

        // 4. Seed Tài khoản (gắn với Nhân viên)
        $this->call(TaiKhoanSeeder::class);

        // 5. Seed phân quyền (gắn permissions vào chức vụ, Admin được tất cả)
        $this->call(RolePermissionSeeder::class);

        // 6. Seed Khách hàng
        $this->call(KhachHangSeeder::class);

        // 7. Seed danh mục sản phẩm
        $this->call(LoaiSanPhamSeeder::class);

        // 8. Seed Nhà cung cấp
        $this->call(NhaCungCapSeeder::class);

        // 9. Seed Sản phẩm (gắn với Loại & NCC)
        $this->call(SanPhamSeeder::class);

        // 10. Seed Giảm giá
        $this->call(GiamGiaSPSeeder::class);

        // 11. Seed Voucher
        $this->call(VoucherSeeder::class);

        // 12. Seed thông tin cửa hàng
        $this->call(StoreInfoSeeder::class);

        // ❌ KHÔNG seed: Phiếu nhập, Hóa đơn, Phiếu hủy (cần nhất quán dữ liệu)
    }
}
