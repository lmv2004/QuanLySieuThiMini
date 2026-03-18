<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ChucVu;
use App\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Gán quyền cho từng vai trò
     */
    public function run(): void
    {
        echo "\n[RolePermissionSeeder] Gán quyền cho các vai trò\n";

        // ========== MANAGER - Toàn bộ quyền ==========
        $manager = ChucVu::where('CODE', 'manager')->first();
        if ($manager) {
            $managerPermissions = Permission::active()
                ->whereIn('CODE', [
                    // Employees
                    'employees.view', 'employees.create', 'employees.edit', 'employees.delete',
                    // Suppliers
                    'suppliers.view', 'suppliers.create', 'suppliers.edit', 'suppliers.delete',
                    // Products
                    'products.view', 'products.create', 'products.edit', 'products.delete',
                    // Categories
                    'categories.view', 'categories.manage',
                    // Inventories
                    'inventories.view', 'inventories.edit',
                    // Invoices
                    'invoices.view', 'invoices.create', 'invoices.edit', 'invoices.delete', 'invoices.payment',
                    // Purchase Orders
                    'purchase-orders.view', 'purchase-orders.create', 'purchase-orders.approve', 'purchase-orders.delete',
                    // Disposal Slips
                    'disposal-slips.view', 'disposal-slips.create', 'disposal-slips.approve',
                    // Vouchers
                    'vouchers.view', 'vouchers.create', 'vouchers.edit', 'vouchers.delete',
                    // Discounts
                    'discounts.view', 'discounts.manage',
                    // Customers
                    'customers.view', 'customers.create', 'customers.edit',
                    // Accounts
                    'accounts.view', 'accounts.create', 'accounts.edit', 'accounts.delete',
                    // Positions
                    'positions.view', 'positions.manage',
                    // Reports
                    'reports.view', 'reports.export',
                ])
                ->pluck('MAPERMISSION')
                ->toArray();

            $manager->permissions()->sync($managerPermissions);
            echo "  ✓ Manager: " . count($managerPermissions) . " quyền\n";
        }

        // ========== CASHIER - Quyền xử lý giao dịch ==========
        $cashier = ChucVu::where('CODE', 'cashier')->first();
        if ($cashier) {
            $cashierPermissions = Permission::active()
                ->whereIn('CODE', [
                    // Invoices
                    'invoices.view', 'invoices.create', 'invoices.edit', 'invoices.delete', 'invoices.payment',
                    // Inventories
                    'inventories.view',
                    // Vouchers
                    'vouchers.view',
                    // Customers
                    'customers.view', 'customers.create', 'customers.edit',
                    // Reports
                    'reports.view',
                ])
                ->pluck('MAPERMISSION')
                ->toArray();

            $cashier->permissions()->sync($cashierPermissions);
            echo "  ✓ Cashier: " . count($cashierPermissions) . " quyền\n";
        }

        // ========== WAREHOUSE - Quyền quản lý kho ==========
        $warehouse = ChucVu::where('CODE', 'warehouse')->first();
        if ($warehouse) {
            $warehousePermissions = Permission::active()
                ->whereIn('CODE', [
                    // Inventories
                    'inventories.view', 'inventories.edit',
                    // Purchase Orders
                    'purchase-orders.view', 'purchase-orders.create', 'purchase-orders.approve', 'purchase-orders.delete',
                    // Disposal Slips
                    'disposal-slips.view', 'disposal-slips.create', 'disposal-slips.approve',
                    // Products
                    'products.view',
                    // Reports
                    'reports.view',
                ])
                ->pluck('MAPERMISSION')
                ->toArray();

            $warehouse->permissions()->sync($warehousePermissions);
            echo "  ✓ Warehouse: " . count($warehousePermissions) . " quyền\n";
        }

        echo "[RolePermissionSeeder] ✓ Hoàn thành gán quyền\n";
    }
}
