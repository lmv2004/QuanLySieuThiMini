import React, { useState, useEffect, useMemo } from 'react';
import { Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Topbar } from '../Manage/Topbar';
import { Ico } from '../Manage/Icons';
import { useAuth } from '../../hooks/useAuth';
import { usePermission } from '../../contexts/PermissionContext';
import Loading from '../common/Loading/index.js';
import '../../pages/Manage/Manage.css';

// ── Toàn bộ menu definitions ─────────────────────────────────────
const ALL_MENU = [
    {
        group: 'Tổng quan',
        items: [
            { id: 'dashboard', label: 'Tổng quan', icon: 'dashboard', path: '/dashboard' },
        ]
    },
    {
        group: 'Nhân sự',
        items: [
            { id: 'employees', label: 'Nhân viên',  icon: 'users',     path: '/employees' },
            { id: 'positions', label: 'Chức vụ',    icon: 'userCheck', path: '/positions' },
        ]
    },
    {
        group: 'Hàng hóa',
        items: [
            { id: 'products',   label: 'Sản phẩm',        icon: 'box',   path: '/products' },
            { id: 'categories', label: 'Loại sản phẩm',   icon: 'tag',   path: '/categories' },
            { id: 'suppliers',  label: 'Nhà cung cấp',    icon: 'truck', path: '/suppliers' },
            { id: 'imports',    label: 'Phiếu nhập',      icon: 'file',  path: '/imports' },
            { id: 'disposals',  label: 'Phiếu xuất hủy', icon: 'trash', path: '/disposals' },
        ]
    },
    {
        group: 'Bán hàng',
        items: [
            { id: 'invoices',   label: 'Hóa đơn / Bán hàng',    icon: 'receipt',   path: '/invoices' },
            { id: 'customers',  label: 'Khách hàng',             icon: 'userGroup', path: '/customers' },
            { id: 'vouchers',   label: 'Voucher',                icon: 'ticket',    path: '/vouchers' },
            { id: 'promotions', label: 'Khuyến mãi / Giảm giá', icon: 'percent',   path: '/promotions' },
        ]
    },
    {
        group: 'Hệ thống',
        items: [
            { id: 'accounts',    label: 'Tài khoản',         icon: 'account',   path: '/accounts' },
            { id: 'permissions', label: 'Phân quyền',        icon: 'userCheck', path: '/permissions' },
            { id: 'store-info',  label: 'Thông tin cửa hàng', icon: 'store',     path: '/store-info' },
            { id: 'reports',     label: 'Báo cáo doanh thu', icon: 'chart',     path: '/reports' },
        ]
    },
];

export const ManageLayout = () => {
    const navigate   = useNavigate();
    const location   = useLocation();
    const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
    const { canSeeModule, loading: permLoading } = usePermission();

    const [dark, setDark]           = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    // Theme effect — hooks phải ở trên cùng, trước mọi early return
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    }, [dark]);

    // Filter menu theo permission — dùng useMemo (hooks trước early return)
    const MENU = useMemo(() => {
        return ALL_MENU.map(group => ({
            ...group,
            items: group.items.filter(item => canSeeModule(item.id)),
        })).filter(group => group.items.length > 0);
    }, [canSeeModule]);

    // Active menu item
    const page = useMemo(() => {
        for (const group of MENU) {
            for (const item of group.items) {
                if (location.pathname === item.path || location.pathname.startsWith(item.path + '/')) {
                    return item.id;
                }
            }
        }
        return 'dashboard';
    }, [location.pathname, MENU]);

    // ── Early returns SAU tất cả hooks ───────────────────────────
    if (authLoading || permLoading) {
        return <Loading size="large" text="Đang tải..." />;
    }
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="manage-app">
            <Topbar page={page} user={user} onLogout={handleLogout} collapsed={collapsed} setCollapsed={setCollapsed} />

            <div className="manage-layout">
                {/* ── SIDEBAR ── */}
                <aside className={`manage-sidebar ${collapsed ? 'collapsed' : ''}`}>
                    <button className="sidebar-toggle" onClick={() => setCollapsed(!collapsed)}>
                        {Ico.chevronLeft}
                    </button>
                    <nav className="sidebar-nav">
                        {MENU.map((group, gi) => (
                            <React.Fragment key={gi}>
                                {gi > 0 && <div className="sidebar-divider" />}
                                <div className="sidebar-section-label">{group.group}</div>
                                {group.items.map(item => (
                                    <button
                                        key={item.id}
                                        className={`nav-item ${page === item.id ? 'active' : ''}`}
                                        onClick={() => navigate(item.path)}
                                        data-label={item.label}
                                    >
                                        <span className="nav-icon">{Ico[item.icon]}</span>
                                        <span className="nav-label" data-label={item.label}>{item.label}</span>
                                    </button>
                                ))}
                            </React.Fragment>
                        ))}
                    </nav>

                    {/* Theme toggle */}
                    <div className="sidebar-footer">
                        <button className="theme-toggle" onClick={() => setDark(d => !d)}>
                            <span className="theme-icon">{dark ? Ico.sun : Ico.moon}</span>
                            <span className="theme-label">{dark ? 'Chế độ sáng' : 'Chế độ tối'}</span>
                            <div className={`toggle-track ${dark ? 'on' : ''}`}>
                                <div className="toggle-thumb" />
                            </div>
                        </button>
                    </div>
                </aside>

                {/* ── MAIN ── */}
                <div className="manage-main">
                    <main className="manage-content">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
};
