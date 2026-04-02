<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Seed các permissions từ Frontend MODULE_PERMISSIONS
     */
    public function run(): void
    {
        $permissions = [
            // ========== Nhân sự ==========
            ['CODE' => 'employees.view', 'NAME' => 'Xem nhân viên', 'DESCRIPTION' => 'Xem danh sách nhân viên', 'MODULE' => 'employees', 'ACTION' => 'view'],
            ['CODE' => 'employees.create', 'NAME' => 'Tạo nhân viên', 'DESCRIPTION' => 'Tạo nhân viên mới', 'MODULE' => 'employees', 'ACTION' => 'create'],
            ['CODE' => 'employees.edit', 'NAME' => 'Sửa nhân viên', 'DESCRIPTION' => 'Chỉnh sửa thông tin nhân viên', 'MODULE' => 'employees', 'ACTION' => 'edit'],
            ['CODE' => 'employees.delete', 'NAME' => 'Xóa nhân viên', 'DESCRIPTION' => 'Xóa nhân viên', 'MODULE' => 'employees', 'ACTION' => 'delete'],

            ['CODE' => 'positions.view', 'NAME' => 'Xem chức vụ', 'DESCRIPTION' => 'Xem danh sách chức vụ', 'MODULE' => 'positions', 'ACTION' => 'view'],
            ['CODE' => 'positions.manage', 'NAME' => 'Quản lý chức vụ', 'DESCRIPTION' => 'Quản lý chức vụ và quyền', 'MODULE' => 'positions', 'ACTION' => 'manage'],
            ['CODE' => 'accounts.view', 'NAME' => 'Xem tài khoản', 'DESCRIPTION' => 'Xem danh sách tài khoản', 'MODULE' => 'accounts', 'ACTION' => 'view'],
            ['CODE' => 'accounts.create', 'NAME' => 'Tạo tài khoản', 'DESCRIPTION' => 'Tạo tài khoản mới', 'MODULE' => 'accounts', 'ACTION' => 'create'],
            ['CODE' => 'accounts.edit', 'NAME' => 'Sửa tài khoản', 'DESCRIPTION' => 'Chỉnh sửa tài khoản', 'MODULE' => 'accounts', 'ACTION' => 'edit'],
            ['CODE' => 'accounts.delete', 'NAME' => 'Xóa tài khoản', 'DESCRIPTION' => 'Xóa tài khoản', 'MODULE' => 'accounts', 'ACTION' => 'delete'],

            // ========== Hàng hóa ==========
            ['CODE' => 'products.view', 'NAME' => 'Xem sản phẩm', 'DESCRIPTION' => 'Xem danh sách sản phẩm', 'MODULE' => 'products', 'ACTION' => 'view'],
            ['CODE' => 'products.create', 'NAME' => 'Tạo sản phẩm', 'DESCRIPTION' => 'Tạo sản phẩm mới', 'MODULE' => 'products', 'ACTION' => 'create'],
            ['CODE' => 'products.edit', 'NAME' => 'Sửa sản phẩm', 'DESCRIPTION' => 'Chỉnh sửa sản phẩm', 'MODULE' => 'products', 'ACTION' => 'edit'],
            ['CODE' => 'products.delete', 'NAME' => 'Xóa sản phẩm', 'DESCRIPTION' => 'Xóa sản phẩm', 'MODULE' => 'products', 'ACTION' => 'delete'],

            ['CODE' => 'categories.view', 'NAME' => 'Xem loại sản phẩm', 'DESCRIPTION' => 'Xem danh sách loại sản phẩm', 'MODULE' => 'categories', 'ACTION' => 'view'],
            ['CODE' => 'categories.manage', 'NAME' => 'Quản lý loại sản phẩm', 'DESCRIPTION' => 'Quản lý loại sản phẩm', 'MODULE' => 'categories', 'ACTION' => 'manage'],

            ['CODE' => 'suppliers.view', 'NAME' => 'Xem nhà cung cấp', 'DESCRIPTION' => 'Xem danh sách nhà cung cấp', 'MODULE' => 'suppliers', 'ACTION' => 'view'],
            ['CODE' => 'suppliers.manage', 'NAME' => 'Quản lý nhà cung cấp', 'DESCRIPTION' => 'Quản lý nhà cung cấp', 'MODULE' => 'suppliers', 'ACTION' => 'manage'],

            // ========== Phiếu nhập + Hủy ==========
            ['CODE' => 'purchase-orders.view', 'NAME' => 'Xem phiếu nhập', 'DESCRIPTION' => 'Xem danh sách phiếu nhập', 'MODULE' => 'imports', 'ACTION' => 'view'],
            ['CODE' => 'purchase-orders.create', 'NAME' => 'Tạo phiếu nhập', 'DESCRIPTION' => 'Tạo phiếu nhập mới', 'MODULE' => 'imports', 'ACTION' => 'create'],
            ['CODE' => 'purchase-orders.approve', 'NAME' => 'Duyệt phiếu nhập', 'DESCRIPTION' => 'Duyệt phiếu nhập', 'MODULE' => 'imports', 'ACTION' => 'approve'],
            ['CODE' => 'purchase-orders.delete', 'NAME' => 'Xóa phiếu nhập', 'DESCRIPTION' => 'Xóa phiếu nhập', 'MODULE' => 'imports', 'ACTION' => 'delete'],

            ['CODE' => 'disposal-slips.view', 'NAME' => 'Xem phiếu hủy', 'DESCRIPTION' => 'Xem danh sách phiếu hủy', 'MODULE' => 'disposals', 'ACTION' => 'view'],
            ['CODE' => 'disposal-slips.create', 'NAME' => 'Tạo phiếu hủy', 'DESCRIPTION' => 'Tạo phiếu hủy mới', 'MODULE' => 'disposals', 'ACTION' => 'create'],
            ['CODE' => 'disposal-slips.approve', 'NAME' => 'Duyệt phiếu hủy', 'DESCRIPTION' => 'Duyệt phiếu hủy', 'MODULE' => 'disposals', 'ACTION' => 'approve'],

            // ========== Bán hàng ==========
            ['CODE' => 'invoices.view', 'NAME' => 'Xem hóa đơn', 'DESCRIPTION' => 'Xem danh sách hóa đơn', 'MODULE' => 'invoices', 'ACTION' => 'view'],
            ['CODE' => 'invoices.create', 'NAME' => 'Tạo hóa đơn', 'DESCRIPTION' => 'Tạo hóa đơn bán hàng', 'MODULE' => 'sales', 'ACTION' => 'create'],
            ['CODE' => 'invoices.edit', 'NAME' => 'Sửa hóa đơn', 'DESCRIPTION' => 'Chỉnh sửa hóa đơn', 'MODULE' => 'invoices', 'ACTION' => 'edit'],
            ['CODE' => 'invoices.delete', 'NAME' => 'Xóa hóa đơn', 'DESCRIPTION' => 'Xóa hóa đơn', 'MODULE' => 'invoices', 'ACTION' => 'delete'],

            ['CODE' => 'customers.view', 'NAME' => 'Xem khách hàng', 'DESCRIPTION' => 'Xem danh sách khách hàng', 'MODULE' => 'customers', 'ACTION' => 'view'],
            ['CODE' => 'customers.manage', 'NAME' => 'Quản lý khách hàng', 'DESCRIPTION' => 'Quản lý khách hàng', 'MODULE' => 'customers', 'ACTION' => 'manage'],

            // ========== Voucher/Khuyến mãi ==========
            ['CODE' => 'vouchers.view', 'NAME' => 'Xem voucher', 'DESCRIPTION' => 'Xem danh sách voucher', 'MODULE' => 'vouchers', 'ACTION' => 'view'],
            ['CODE' => 'vouchers.manage', 'NAME' => 'Quản lý voucher', 'DESCRIPTION' => 'Quản lý voucher', 'MODULE' => 'vouchers', 'ACTION' => 'manage'],

            ['CODE' => 'discounts.view', 'NAME' => 'Xem khuyến mãi', 'DESCRIPTION' => 'Xem danh sách khuyến mãi', 'MODULE' => 'promotions', 'ACTION' => 'view'],
            ['CODE' => 'discounts.manage', 'NAME' => 'Quản lý khuyến mãi', 'DESCRIPTION' => 'Quản lý khuyến mãi sản phẩm', 'MODULE' => 'promotions', 'ACTION' => 'manage'],

            // ========== Hệ thống ==========
            ['CODE' => 'reports.view', 'NAME' => 'Xem báo cáo', 'DESCRIPTION' => 'Xem báo cáo tồn kho', 'MODULE' => 'reports', 'ACTION' => 'view'],
            ['CODE' => 'dashboard.view', 'NAME' => 'Xem dashboard', 'DESCRIPTION' => 'Xem thống kê tổng quan', 'MODULE' => 'dashboard', 'ACTION' => 'view'],
        ];

        foreach ($permissions as $perm) {
            Permission::firstOrCreate(
                ['CODE' => $perm['CODE']],
                $perm
            );
        }
    }
}
