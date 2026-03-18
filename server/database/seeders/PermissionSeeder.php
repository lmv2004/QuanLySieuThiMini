<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Tạo danh sách tất cả permissions cho hệ thống
     */
    public function run(): void
    {
        $permissions = [
            // ========== EMPLOYEES (Nhân viên) ==========
            [
                'CODE' => 'employees.view',
                'NAME' => 'Xem danh sách nhân viên',
                'DESCRIPTION' => 'Có quyền xem danh sách tất cả nhân viên',
                'MODULE' => 'employees',
                'ACTION' => 'view',
            ],
            [
                'CODE' => 'employees.create',
                'NAME' => 'Tạo nhân viên',
                'DESCRIPTION' => 'Có quyền tạo mới nhân viên',
                'MODULE' => 'employees',
                'ACTION' => 'create',
            ],
            [
                'CODE' => 'employees.edit',
                'NAME' => 'Sửa thông tin nhân viên',
                'DESCRIPTION' => 'Có quyền chỉnh sửa thông tin nhân viên',
                'MODULE' => 'employees',
                'ACTION' => 'edit',
            ],
            [
                'CODE' => 'employees.delete',
                'NAME' => 'Xóa nhân viên',
                'DESCRIPTION' => 'Có quyền xóa nhân viên',
                'MODULE' => 'employees',
                'ACTION' => 'delete',
            ],

            // ========== SUPPLIERS (Nhà cung cấp) ==========
            [
                'CODE' => 'suppliers.view',
                'NAME' => 'Xem nhà cung cấp',
                'DESCRIPTION' => 'Có quyền xem danh sách nhà cung cấp',
                'MODULE' => 'suppliers',
                'ACTION' => 'view',
            ],
            [
                'CODE' => 'suppliers.create',
                'NAME' => 'Tạo nhà cung cấp',
                'DESCRIPTION' => 'Có quyền tạo nhà cung cấp mới',
                'MODULE' => 'suppliers',
                'ACTION' => 'create',
            ],
            [
                'CODE' => 'suppliers.edit',
                'NAME' => 'Sửa nhà cung cấp',
                'DESCRIPTION' => 'Có quyền chỉnh sửa thông tin nhà cung cấp',
                'MODULE' => 'suppliers',
                'ACTION' => 'edit',
            ],
            [
                'CODE' => 'suppliers.delete',
                'NAME' => 'Xóa nhà cung cấp',
                'DESCRIPTION' => 'Có quyền xóa nhà cung cấp',
                'MODULE' => 'suppliers',
                'ACTION' => 'delete',
            ],

            // ========== PRODUCTS (Sản phẩm) ==========
            [
                'CODE' => 'products.view',
                'NAME' => 'Xem sản phẩm',
                'DESCRIPTION' => 'Có quyền xem danh sách sản phẩm',
                'MODULE' => 'products',
                'ACTION' => 'view',
            ],
            [
                'CODE' => 'products.create',
                'NAME' => 'Tạo sản phẩm',
                'DESCRIPTION' => 'Có quyền tạo sản phẩm mới',
                'MODULE' => 'products',
                'ACTION' => 'create',
            ],
            [
                'CODE' => 'products.edit',
                'NAME' => 'Sửa sản phẩm',
                'DESCRIPTION' => 'Có quyền chỉnh sửa sản phẩm',
                'MODULE' => 'products',
                'ACTION' => 'edit',
            ],
            [
                'CODE' => 'products.delete',
                'NAME' => 'Xóa sản phẩm',
                'DESCRIPTION' => 'Có quyền xóa sản phẩm',
                'MODULE' => 'products',
                'ACTION' => 'delete',
            ],

            // ========== CATEGORIES (Loại sản phẩm) ==========
            [
                'CODE' => 'categories.view',
                'NAME' => 'Xem loại sản phẩm',
                'DESCRIPTION' => 'Có quyền xem danh sách loại sản phẩm',
                'MODULE' => 'categories',
                'ACTION' => 'view',
            ],
            [
                'CODE' => 'categories.manage',
                'NAME' => 'Quản lý loại sản phẩm',
                'DESCRIPTION' => 'Có quyền tạo, sửa, xóa loại sản phẩm',
                'MODULE' => 'categories',
                'ACTION' => 'manage',
            ],

            // ========== INVENTORIES (Tồn kho) ==========
            [
                'CODE' => 'inventories.view',
                'NAME' => 'Xem tồn kho',
                'DESCRIPTION' => 'Có quyền xem thông tin tồn kho sản phẩm',
                'MODULE' => 'inventories',
                'ACTION' => 'view',
            ],
            [
                'CODE' => 'inventories.edit',
                'NAME' => 'Cập nhật tồn kho',
                'DESCRIPTION' => 'Có quyền cập nhật số lượng tồn kho',
                'MODULE' => 'inventories',
                'ACTION' => 'edit',
            ],

            // ========== INVOICES (Hóa đơn) ==========
            [
                'CODE' => 'invoices.view',
                'NAME' => 'Xem hóa đơn',
                'DESCRIPTION' => 'Có quyền xem danh sách hóa đơn',
                'MODULE' => 'invoices',
                'ACTION' => 'view',
            ],
            [
                'CODE' => 'invoices.create',
                'NAME' => 'Tạo hóa đơn',
                'DESCRIPTION' => 'Có quyền tạo hóa đơn mới',
                'MODULE' => 'invoices',
                'ACTION' => 'create',
            ],
            [
                'CODE' => 'invoices.edit',
                'NAME' => 'Sửa hóa đơn',
                'DESCRIPTION' => 'Có quyền chỉnh sửa hóa đơn',
                'MODULE' => 'invoices',
                'ACTION' => 'edit',
            ],
            [
                'CODE' => 'invoices.delete',
                'NAME' => 'Xóa hóa đơn',
                'DESCRIPTION' => 'Có quyền xóa hóa đơn',
                'MODULE' => 'invoices',
                'ACTION' => 'delete',
            ],
            [
                'CODE' => 'invoices.payment',
                'NAME' => 'Xử lý thanh toán',
                'DESCRIPTION' => 'Có quyền xử lý thanh toán hóa đơn',
                'MODULE' => 'invoices',
                'ACTION' => 'payment',
            ],

            // ========== PURCHASE_ORDERS (Phiếu nhập) ==========
            [
                'CODE' => 'purchase-orders.view',
                'NAME' => 'Xem phiếu nhập',
                'DESCRIPTION' => 'Có quyền xem danh sách phiếu nhập',
                'MODULE' => 'purchase-orders',
                'ACTION' => 'view',
            ],
            [
                'CODE' => 'purchase-orders.create',
                'NAME' => 'Tạo phiếu nhập',
                'DESCRIPTION' => 'Có quyền tạo phiếu nhập mới',
                'MODULE' => 'purchase-orders',
                'ACTION' => 'create',
            ],
            [
                'CODE' => 'purchase-orders.approve',
                'NAME' => 'Duyệt phiếu nhập',
                'DESCRIPTION' => 'Có quyền duyệt/phê duyệt phiếu nhập',
                'MODULE' => 'purchase-orders',
                'ACTION' => 'approve',
            ],
            [
                'CODE' => 'purchase-orders.delete',
                'NAME' => 'Hủy phiếu nhập',
                'DESCRIPTION' => 'Có quyền hủy phiếu nhập',
                'MODULE' => 'purchase-orders',
                'ACTION' => 'delete',
            ],

            // ========== DISPOSAL_SLIPS (Phiếu hủy) ==========
            [
                'CODE' => 'disposal-slips.view',
                'NAME' => 'Xem phiếu hủy',
                'DESCRIPTION' => 'Có quyền xem danh sách phiếu hủy hàng',
                'MODULE' => 'disposal-slips',
                'ACTION' => 'view',
            ],
            [
                'CODE' => 'disposal-slips.create',
                'NAME' => 'Tạo phiếu hủy',
                'DESCRIPTION' => 'Có quyền tạo phiếu hủy mới',
                'MODULE' => 'disposal-slips',
                'ACTION' => 'create',
            ],
            [
                'CODE' => 'disposal-slips.approve',
                'NAME' => 'Duyệt phiếu hủy',
                'DESCRIPTION' => 'Có quyền duyệt phiếu hủy',
                'MODULE' => 'disposal-slips',
                'ACTION' => 'approve',
            ],

            // ========== VOUCHERS (Mã giảm giá) ==========
            [
                'CODE' => 'vouchers.view',
                'NAME' => 'Xem voucher',
                'DESCRIPTION' => 'Có quyền xem danh sách voucher',
                'MODULE' => 'vouchers',
                'ACTION' => 'view',
            ],
            [
                'CODE' => 'vouchers.create',
                'NAME' => 'Tạo voucher',
                'DESCRIPTION' => 'Có quyền tạo voucher mới',
                'MODULE' => 'vouchers',
                'ACTION' => 'create',
            ],
            [
                'CODE' => 'vouchers.edit',
                'NAME' => 'Sửa voucher',
                'DESCRIPTION' => 'Có quyền chỉnh sửa voucher',
                'MODULE' => 'vouchers',
                'ACTION' => 'edit',
            ],
            [
                'CODE' => 'vouchers.delete',
                'NAME' => 'Xóa voucher',
                'DESCRIPTION' => 'Có quyền xóa voucher',
                'MODULE' => 'vouchers',
                'ACTION' => 'delete',
            ],

            // ========== DISCOUNTS (Khuyến mại) ==========
            [
                'CODE' => 'discounts.view',
                'NAME' => 'Xem khuyến mại',
                'DESCRIPTION' => 'Có quyền xem danh sách khuyến mại',
                'MODULE' => 'discounts',
                'ACTION' => 'view',
            ],
            [
                'CODE' => 'discounts.manage',
                'NAME' => 'Quản lý khuyến mại',
                'DESCRIPTION' => 'Có quyền tạo, sửa, xóa khuyến mại',
                'MODULE' => 'discounts',
                'ACTION' => 'manage',
            ],

            // ========== CUSTOMERS (Khách hàng) ==========
            [
                'CODE' => 'customers.view',
                'NAME' => 'Xem khách hàng',
                'DESCRIPTION' => 'Có quyền xem danh sách khách hàng',
                'MODULE' => 'customers',
                'ACTION' => 'view',
            ],
            [
                'CODE' => 'customers.create',
                'NAME' => 'Tạo khách hàng',
                'DESCRIPTION' => 'Có quyền tạo khách hàng mới',
                'MODULE' => 'customers',
                'ACTION' => 'create',
            ],
            [
                'CODE' => 'customers.edit',
                'NAME' => 'Sửa khách hàng',
                'DESCRIPTION' => 'Có quyền chỉnh sửa thông tin khách hàng',
                'MODULE' => 'customers',
                'ACTION' => 'edit',
            ],

            // ========== ACCOUNTS (Tài khoản) ==========
            [
                'CODE' => 'accounts.view',
                'NAME' => 'Xem tài khoản',
                'DESCRIPTION' => 'Có quyền xem danh sách tài khoản',
                'MODULE' => 'accounts',
                'ACTION' => 'view',
            ],
            [
                'CODE' => 'accounts.create',
                'NAME' => 'Tạo tài khoản',
                'DESCRIPTION' => 'Có quyền tạo tài khoản mới',
                'MODULE' => 'accounts',
                'ACTION' => 'create',
            ],
            [
                'CODE' => 'accounts.edit',
                'NAME' => 'Sửa tài khoản',
                'DESCRIPTION' => 'Có quyền chỉnh sửa tài khoản',
                'MODULE' => 'accounts',
                'ACTION' => 'edit',
            ],
            [
                'CODE' => 'accounts.delete',
                'NAME' => 'Xóa tài khoản',
                'DESCRIPTION' => 'Có quyền xóa tài khoản',
                'MODULE' => 'accounts',
                'ACTION' => 'delete',
            ],

            // ========== POSITIONS (Chức vụ) ==========
            [
                'CODE' => 'positions.view',
                'NAME' => 'Xem chức vụ',
                'DESCRIPTION' => 'Có quyền xem danh sách chức vụ',
                'MODULE' => 'positions',
                'ACTION' => 'view',
            ],
            [
                'CODE' => 'positions.manage',
                'NAME' => 'Quản lý chức vụ',
                'DESCRIPTION' => 'Có quyền tạo, sửa, xóa chức vụ',
                'MODULE' => 'positions',
                'ACTION' => 'manage',
            ],

            // ========== REPORTS (Báo cáo) ==========
            [
                'CODE' => 'reports.view',
                'NAME' => 'Xem báo cáo',
                'DESCRIPTION' => 'Có quyền xem các báo cáo hệ thống',
                'MODULE' => 'reports',
                'ACTION' => 'view',
            ],
            [
                'CODE' => 'reports.export',
                'NAME' => 'Xuất báo cáo',
                'DESCRIPTION' => 'Có quyền xuất dữ liệu báo cáo',
                'MODULE' => 'reports',
                'ACTION' => 'export',
            ],
        ];

        foreach ($permissions as $permission) {
            Permission::updateOrCreate(
                ['CODE' => $permission['CODE']],
                $permission
            );
        }

        echo "[PermissionSeeder] ✓ Tạo " . count($permissions) . " permissions\n";
    }
}
