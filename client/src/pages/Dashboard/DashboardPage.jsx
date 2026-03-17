import React, { useState } from 'react';
import { Ico } from '../../components/Manage/Icons';
import { initials, CURRENT_USER } from '../../components/Manage/Shared';

const CHART_DATA = {
    week: [{ l: 'T2', v: 4.2 }, { l: 'T3', v: 5.8 }, { l: 'T4', v: 3.9 }, { l: 'T5', v: 7.1 }, { l: 'T6', v: 8.4 }, { l: 'T7', v: 9.2 }, { l: 'CN', v: 6.5, hi: true }],
    month: [{ l: 'T1', v: 28 }, { l: 'T2', v: 32 }, { l: 'T3', v: 27 }, { l: 'T4', v: 35 }, { l: 'T5', v: 42 }, { l: 'T6', v: 38, hi: true }],
    year: [{ l: 'Q1', v: 82 }, { l: 'Q2', v: 95 }, { l: 'Q3', v: 88 }, { l: 'Q4', v: 110, hi: true }],
};

const ACTIVITIES = [
    { id: 1, icon: '💰', bg: '#dcfce7', text: <>Hóa đơn <strong>#HD-4521</strong> — <strong>342.000 ₫</strong> thanh toán</>, time: '2 phút trước' },
    { id: 2, icon: '📦', bg: '#e0f2fe', text: <>Phiếu nhập <strong>#IMP-088</strong> từ Vinamilk đã duyệt</>, time: '18 phút trước' },
    { id: 3, icon: '👤', bg: '#ede9fe', text: <>Nhân viên <strong>Trần Thị Hoa</strong> đã đăng nhập</>, time: '1 giờ trước' },
    { id: 4, icon: '⚠️', bg: '#fef3c7', text: <>Sản phẩm <strong>Xà bông Lifebuoy</strong> sắp hết hàng</>, time: '2 giờ trước' },
    { id: 5, icon: '🗑️', bg: '#fee2e2', text: <>Phiếu hủy <strong>#DSP-012</strong> — 5 sp hết hạn</>, time: '3 giờ trước' },
];

export const DashboardPage = () => {
    const user = CURRENT_USER;
    const [period, setPeriod] = useState('week');
    const bars = CHART_DATA[period];
    const maxV = Math.max(...bars.map(b => b.v));
    const kpis = [
        { label: 'Doanh thu hôm nay', value: '9.2M ₫', sub: 'so với hôm qua', badge: '+12%', up: true, icon: '💰', bg: '#fef9c3' },
        { label: 'Đơn hàng', value: '84', sub: 'hóa đơn hôm nay', badge: '+8%', up: true, icon: '🧾', bg: '#e0f2fe' },
        { label: 'Nhân viên', value: '0', sub: 'chưa có dữ liệu', badge: '—', up: true, icon: '👥', bg: '#ede9fe' },
        { label: 'Sản phẩm', value: '0', sub: 'chưa có dữ liệu', badge: '—', up: true, icon: '📦', bg: '#dcfce7' },
    ];

    return (
        <>
            <div className="dash-welcome">
                <div className="dash-avatar-lg">{initials(user.TENNV)}</div>
                <div>
                    <div className="dash-welcome-name">Xin chào, {user.TENNV.split(' ').pop()}!</div>
                    <div className="dash-welcome-sub">{user.chucVu?.TENCHUCVU} · {user.EMAIL}</div>
                    <div className="dash-welcome-chip">Đang hoạt động</div>
                </div>
            </div>
            <div className="kpi-grid">
                {kpis.map((k, i) => (
                    <div className="kpi-card" key={i}>
                        <div className="kpi-top">
                            <div className="kpi-icon" style={{ background: k.bg, fontSize: 16 }}>{k.icon}</div>
                            <span className={`kpi-badge ${k.up ? 'up' : 'down'}`}>{Ico.trendUp}{k.badge}</span>
                        </div>
                        <div>
                            <div className="kpi-label">{k.label}</div>
                            <div className="kpi-value">{k.value}</div>
                            <div className="kpi-sub">{k.sub}</div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="dash-bottom">
                <div className="chart-card">
                    <div className="chart-header">
                        <div className="chart-title">Doanh thu</div>
                        <div className="chart-tabs">
                            {['week', 'month', 'year'].map(p => (
                                <button key={p} className={`chart-tab ${period === p ? 'active' : ''}`} onClick={() => setPeriod(p)}>
                                    {p === 'week' ? 'Tuần' : p === 'month' ? 'Tháng' : 'Năm'}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="chart-bars">
                        {bars.map((b, i) => (
                            <div className="chart-bar-wrap" key={i}>
                                <div className={`chart-bar ${b.hi ? 'hi' : ''}`} style={{ height: `${Math.round((b.v / maxV) * 112)}px` }} title={`${b.v}M ₫`} />
                                <div className="chart-bar-label">{b.l}</div>
                            </div>
                        ))}
                    </div>
                    <div className="chart-legend">
                        <div className="chart-legend-item"><div className="chart-legend-dot" style={{ background: '#c8fb4b' }} /> Cao nhất</div>
                        <div className="chart-legend-item"><div className="chart-legend-dot" style={{ background: 'var(--accent2)' }} /> Các ngày còn lại</div>
                    </div>
                </div>
                <div className="activity-card">
                    <div className="activity-title">Hoạt động gần đây</div>
                    <div className="activity-list">
                        {ACTIVITIES.map(a => (
                            <div className="activity-item" key={a.id}>
                                <div className="activity-dot" style={{ background: a.bg }}>{a.icon}</div>
                                <div><div className="activity-text">{a.text}</div><div className="activity-time">{a.time}</div></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};