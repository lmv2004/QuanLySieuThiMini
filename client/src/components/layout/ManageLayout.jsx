import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Topbar } from '../Manage/Topbar';
import { Ico } from '../Manage/Icons';
import { useAuth } from '../../hooks/useAuth';
import '../../pages/Manage/Manage.css';

const MENU = [
    { group: 'Tổng quan', items: [{ id: 'dashboard', label: 'Tổng quan', icon: 'dashboard', path: '/manage/dashboard' }] },
    {
        group: 'Nhân sự', items: [
            { id: 'employees', label: 'Nhân viên', icon: 'users', path: '/manage/employees' },
            { id: 'positions', label: 'Chức vụ', icon: 'userCheck', path: '/manage/positions' },
        ]
    },
    {
        group: 'Hàng hóa', items: [
            { id: 'products', label: 'Sản phẩm', icon: 'box', path: '/manage/products' },
            { id: 'categories', label: 'Loại sản phẩm', icon: 'tag', path: '/manage/categories' },
            { id: 'suppliers', label: 'Nhà cung cấp', icon: 'truck', path: '/manage/suppliers' },
            { id: 'imports', label: 'Phiếu nhập', icon: 'file', path: '/manage/imports' },
            { id: 'disposals', label: 'Phiếu xuất hủy', icon: 'trash', path: '/manage/disposals' },
        ]
    },
    {
        group: 'Bán hàng', items: [
            { id: 'invoices', label: 'Hóa đơn / Bán hàng', icon: 'receipt', path: '/manage/invoices' },
            { id: 'customers', label: 'Khách hàng', icon: 'userGroup', path: '/manage/customers' },
            { id: 'vouchers', label: 'Voucher', icon: 'ticket', path: '/manage/vouchers' },
            { id: 'promotions', label: 'Khuyến mãi / Giảm giá', icon: 'percent', path: '/manage/promotions' },
        ]
    },
    {
        group: 'Hệ thống', items: [
            { id: 'accounts', label: 'Tài khoản', icon: 'account', path: '/manage/accounts' },
            { id: 'reports', label: 'Báo cáo doanh thu', icon: 'chart', path: '/manage/reports' },
        ]
    },
];

export const ManageLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };
    
    // Xác định active menu dựa trực tiếp vào pathname — không dùng state để tránh re-render sidebar
    const page = React.useMemo(() => {
        for (const group of MENU) {
            for (const item of group.items) {
                if (location.pathname.startsWith(item.path)) return item.id;
            }
        }
        return 'dashboard';
    }, [location.pathname]);

    const [dark, setDark] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    }, [dark]);

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
