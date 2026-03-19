import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { STORAGE_KEYS } from '../config/constants';

/**
 * PermissionContext — cung cấp role + permissions cho toàn bộ app.
 *
 * permissions: mảng string, vd ['manage_employees', 'view_reports', ...]
 * role: string, vd 'manager' | 'cashier' | 'warehouse'
 *
 * Sử dụng: const { can, role, loading } = usePermission();
 * can('manage_employees') → true/false
 */

const PermissionContext = createContext(null);

// ── Map module → permission code cần có để hiện menu ───────────────
// Dựa theo PermissionConstants.php:
//   manager:   manage_employees, manage_products, manage_suppliers,
//              manage_purchase_orders, manage_vouchers, view_reports,
//              view_inventory, create_invoice, create_disposal_slip, ...
//   cashier:   create_invoice, view_inventory, cancel_invoice, process_payment, export_invoice
//   warehouse: view_warehouse_inventory, create_purchase_order, create_disposal_slip
export const MODULE_PERMISSIONS = {
    dashboard:   null,                          // luôn hiển thị

    // Nhân sự — chỉ manager
    employees:   'manage_employees',
    positions:   'manage_employees',
    permissions: 'manage_employees',
    accounts:    'manage_employees',

    // Hàng hóa — xem: cashier + warehouse (view_inventory); sửa/xóa: manager (manage_products)
    // → hiện menu với ai có view_inventory (cashier, warehouse, manager đều có)
    products:    'view_inventory',
    categories:  'view_inventory',
    suppliers:   'view_inventory',

    // Phiếu nhập: manager + warehouse
    imports:     'create_purchase_order',
    // Phiếu hủy: manager + warehouse
    disposals:   'create_disposal_slip',

    // Bán hàng — cashier + manager
    invoices:    'create_invoice',
    customers:   'create_invoice',

    // Voucher/Khuyến mãi — chỉ manager
    vouchers:    'manage_vouchers',
    promotions:  'manage_vouchers',

    // Hệ thống — chỉ manager
    reports:     'view_reports',
};

export const PermissionProvider = ({ children }) => {
    const [role, setRole] = useState(null);
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadPermissions = useCallback(async () => {
        // Thử localStorage trước (đã fetch khi login)
        const cached = localStorage.getItem(STORAGE_KEYS.PERMISSIONS);
        if (cached) {
            try {
                const parsed = JSON.parse(cached);
                setRole(parsed.role ?? null);
                setPermissions(parsed.permissions ?? []);
                setLoading(false);
                return;
            } catch { /* ignore parse error */ }
        }

        // Nếu không có cache → gọi API
        try {
            const res = await api.get('/auth/permissions');
            const data = res.data ?? res;
            setRole(data.role ?? null);
            setPermissions(data.permissions ?? []);
            // Lưu lại cache
            localStorage.setItem(STORAGE_KEYS.PERMISSIONS, JSON.stringify(data));
        } catch (err) {
            console.warn('Cannot load permissions:', err?.message);
            setRole(null);
            setPermissions([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        if (token) loadPermissions();
        else setLoading(false);
    }, [loadPermissions]);

    // Helper: kiểm tra permission
    const can = useCallback(
        (permCode) => !permCode || permissions.includes(permCode),
        [permissions]
    );

    // Helper: kiểm tra module có được hiển thị không
    const canSeeModule = useCallback(
        (moduleId) => can(MODULE_PERMISSIONS[moduleId] ?? null),
        [can]
    );

    // Refresh permissions từ API (dùng sau khi login)
    const refreshPermissions = useCallback(async () => {
        localStorage.removeItem(STORAGE_KEYS.PERMISSIONS);
        setLoading(true);
        await loadPermissions();
    }, [loadPermissions]);

    return (
        <PermissionContext.Provider value={{ role, permissions, loading, can, canSeeModule, refreshPermissions }}>
            {children}
        </PermissionContext.Provider>
    );
};

export const usePermission = () => {
    const ctx = useContext(PermissionContext);
    if (!ctx) throw new Error('usePermission must be used inside <PermissionProvider>');
    return ctx;
};
