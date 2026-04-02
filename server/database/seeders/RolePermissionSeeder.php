<?php

namespace Database\Seeders;

use App\Models\ChucVu;
use App\Models\Permission;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    /**
     * Seed phân quyền: gắn permissions vào các chức vụ
     */
    public function run(): void
    {
        // ========== ADMIN - TẤT CẢ QUYỀN ==========
        $admin = ChucVu::where('CODE', 'admin')->first();
        if ($admin) {
            $allPermissions = Permission::where('IS_DELETED', 0)->pluck('MAPERMISSION')->toArray();
            $admin->permissions()->sync($allPermissions);
        }

        // ========== QUẢN LÝ - HẦU HẾT QUYỀN (trừ positions.manage, accounts.edit) ==========
        $quanly = ChucVu::where('CODE', 'manager')->first();
        if ($quanly) {
            $permissions = Permission::where('IS_DELETED', 0)
                ->whereNotIn('CODE', ['positions.manage', 'accounts.edit'])
                ->pluck('MAPERMISSION')
                ->toArray();
            $quanly->permissions()->sync($permissions);
        }

        // ========== THU NGÂN - CHỈ QUYỀN BÁN HÀNG ==========
        $thungan = ChucVu::where('CODE', 'cashier')->first();
        if ($thungan) {
            $permissions = Permission::where('IS_DELETED', 0)
                ->whereIn('CODE', [
                    'invoices.create',
                    'invoices.view',
                    'customers.view',
                    'vouchers.view',
                    'products.view',
                    'categories.view',
                    'discounts.view',
                    'dashboard.view',
                ])
                ->pluck('MAPERMISSION')
                ->toArray();
            $thungan->permissions()->sync($permissions);
        }

        // ========== NHÂN VIÊN KHO - QUYỀN NHẬP/HUỶ/SẢN PHẨM ==========
        $nvkho = ChucVu::where('CODE', 'warehouse')->first();
        if ($nvkho) {
            $permissions = Permission::where('IS_DELETED', 0)
                ->whereIn('CODE', [
                    'purchase-orders.view',
                    'purchase-orders.create',
                    'purchase-orders.approve',
                    'disposal-slips.view',
                    'disposal-slips.create',
                    'disposal-slips.approve',
                    'products.view',
                    'categories.view',
                    'suppliers.view',
                    'reports.view',
                    'dashboard.view',
                ])
                ->pluck('MAPERMISSION')
                ->toArray();
            $nvkho->permissions()->sync($permissions);
        }
    }
}
