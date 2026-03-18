<?php

namespace App\Constants;

class PermissionConstants
{
    // Manager Permissions
    const MANAGE_EMPLOYEES = 'manage_employees';
    const MANAGE_SUPPLIERS = 'manage_suppliers';
    const MANAGE_PRODUCTS = 'manage_products';
    const MANAGE_PURCHASE_ORDERS = 'manage_purchase_orders';
    const VIEW_REPORTS = 'view_reports';

    // Cashier Permissions
    const CREATE_INVOICE = 'create_invoice';
    const VIEW_INVENTORY = 'view_inventory';
    const CANCEL_INVOICE = 'cancel_invoice';
    const PROCESS_PAYMENT = 'process_payment';
    const EXPORT_INVOICE = 'export_invoice';

    // Warehouse Permissions
    const VIEW_WAREHOUSE_INVENTORY = 'view_warehouse_inventory';
    const CREATE_PURCHASE_ORDER = 'create_purchase_order';
    const CREATE_DISPOSAL_SLIP = 'create_disposal_slip';

    /**
     * Get permissions by role
     */
    public static function getPermissionsByRole(string $role): array
    {
        return match($role) {
            'manager' => [
                self::MANAGE_EMPLOYEES,
                self::MANAGE_SUPPLIERS,
                self::MANAGE_PRODUCTS,
                self::MANAGE_PURCHASE_ORDERS,
                self::VIEW_REPORTS,
                self::VIEW_INVENTORY,
                self::CREATE_INVOICE,
                self::CANCEL_INVOICE,
                self::PROCESS_PAYMENT,
                self::EXPORT_INVOICE,
                self::VIEW_WAREHOUSE_INVENTORY,
                self::CREATE_PURCHASE_ORDER,
                self::CREATE_DISPOSAL_SLIP,
            ],
            'cashier' => [
                self::CREATE_INVOICE,
                self::VIEW_INVENTORY,
                self::CANCEL_INVOICE,
                self::PROCESS_PAYMENT,
                self::EXPORT_INVOICE,
            ],
            'warehouse' => [
                self::VIEW_WAREHOUSE_INVENTORY,
                self::CREATE_PURCHASE_ORDER,
                self::CREATE_DISPOSAL_SLIP,
            ],
            default => [],
        };
    }

    /**
     * Check if role has permission
     */
    public static function hasPermission(string $role, string $permission): bool
    {
        return in_array($permission, self::getPermissionsByRole($role));
    }
}
