import React, { useState, useEffect, useRef } from 'react';
import { Ico } from './Icons';
import { initials } from './Shared';

const PAGE_LABELS = {
    dashboard: 'Tổng quan', employees: 'Nhân viên', positions: 'Chức vụ',
    suppliers: 'Nhà cung cấp', products: 'Sản phẩm', categories: 'Loại sản phẩm',
    sales: 'Bán hàng', invoices: 'Hóa đơn', vouchers: 'Phiếu nhập / Hủy',
    customers: 'Khách hàng', voucher_promo: 'Voucher', promotions: 'Khuyến mãi / Giảm giá',
    accounts: 'Tài khoản', reports: 'Báo cáo doanh thu',
};

export const Topbar = ({ page, user, onLogout, collapsed, setCollapsed }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);
    return (
        <header className="manage-topbar">
            <div className="topbar-logo">
                <div className="topbar-logo-icon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M2 6h12M2 9h8M2 12h11" stroke="#111" strokeWidth="1.7" strokeLinecap="round" />
                    </svg>
                </div>
                <span className="topbar-logo-name">MiniMart</span>
            </div>
            <div className="topbar-divider" />
            <span className="topbar-page-title">{PAGE_LABELS[page] || ''}</span>
            <div className="topbar-spacer" />
            <div ref={ref} className={`topbar-admin ${open ? 'open' : ''}`} onClick={() => setOpen(o => !o)}>
                <div className="topbar-avatar">{initials(user?.TENNV || '')}</div>
                <span className="topbar-admin-name">{user?.TENNV || ''}</span>
                <span className="topbar-admin-caret">{Ico.caret}</span>
                {open && (
                    <div className="admin-dropdown" onClick={e => e.stopPropagation()}>
                        <div className="admin-dd-header">
                            <div className="admin-dd-avatar">{initials(user?.TENNV || '')}</div>
                            <div>
                                <div className="admin-dd-name">{user?.TENNV || ''}</div>
                                <div className="admin-dd-role">{user?.chucVu?.TENCHUCVU}</div>
                                <div className="admin-dd-online">Đang hoạt động</div>
                            </div>
                        </div>
                        <div className="admin-dd-body">
                            <div className="admin-dd-row"><span style={{ color: 'var(--text-muted)' }}>{Ico.userIco}</span><span>{user?.EMAIL || ''}</span></div>
                            <div className="admin-dd-row"><span style={{ color: 'var(--text-muted)' }}>{Ico.key}</span><span>Đổi mật khẩu</span></div>
                            <div className="admin-dd-sep" />
                            <div className="admin-dd-row danger" onClick={onLogout} style={{ cursor: 'pointer' }}><span>{Ico.logout}</span><span>Đăng xuất</span></div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};
