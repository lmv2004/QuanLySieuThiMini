import React, { useState, useEffect } from 'react';
import { initials, CURRENT_USER } from '../../components/Manage/Shared';
import { DashboardKpi } from './DashboardKpi';
import { DashboardCharts, CategoryBreakdown } from './DashboardCharts';
import { DashboardOperations, ModuleHub, DashboardAlerts, TopProducts } from './DashboardOperations';
import './Dashboard.css';

/* ── Static Data ──────────────────────── */
const DATA = {
    Day: {
        kpis: [
            { id: 'rev',   label: 'Doanh thu hôm nay',  val: '24,150,000 ₫', trend: '+12.5%', icon: '💰', bg: '#6366f1', up: true  },
            { id: 'inv',   label: 'Hóa đơn mới',          val: '184',           trend: '+15',    icon: '🧾', bg: '#0ea5e9', up: true  },
            { id: 'alert', label: 'Cảnh báo tồn kho',     val: '12 mặt hàng',   trend: 'Cần nhập', icon: '📦', bg: '#ef4444', up: false },
        ],
        chartData: [
            { l: '08h', v: 1.2 }, { l: '10h', v: 4.5 }, { l: '12h', v: 12.8, hi: true },
            { l: '14h', v: 8.4 }, { l: '16h', v: 10.2 }, { l: '18h', v: 15.6 }, { l: '20h', v: 9.5 },
        ],
        categories: [
            { label: 'Thực phẩm & Đồ uống', perc: 48, color: '#6366f1' },
            { label: 'Hóa phẩm & Gia dụng', perc: 29, color: '#f59e0b' },
            { label: 'Chăm sóc sức khỏe',   perc: 23, color: '#10b981' },
        ],
    },
    Month: {
        kpis: [
            { id: 'rev',   label: 'Doanh thu tháng này', val: '1,250,000,000 ₫', trend: '+5.2%', icon: '💰', bg: '#6366f1', up: true },
            { id: 'inv',   label: 'Tổng hóa đơn',         val: '4,520',            trend: '+450',   icon: '🧾', bg: '#0ea5e9', up: true },
            { id: 'cust',  label: 'Khách hàng mới',        val: '520 người',        trend: '+120',   icon: '💎', bg: '#10b981', up: true },
        ],
        chartData: [
            { l: 'T1', v: 250 }, { l: 'T2', v: 320 }, { l: 'T3', v: 450, hi: true }, { l: 'T4', v: 230 },
        ],
        categories: [
            { label: 'Thực phẩm & Đồ uống', perc: 40, color: '#6366f1' },
            { label: 'Hóa phẩm & Gia dụng', perc: 35, color: '#f59e0b' },
            { label: 'Chăm sóc sức khỏe',   perc: 25, color: '#10b981' },
        ],
    },
    Year: {
        kpis: [
            { id: 'rev',  label: 'Doanh thu năm nay', val: '15,400,000,000 ₫', trend: '+18%', icon: '💰', bg: '#6366f1', up: true  },
            { id: 'inv',  label: 'Tổng giao dịch',     val: '52,100',            trend: '+22%', icon: '🧾', bg: '#0ea5e9', up: true  },
            { id: 'nv',   label: 'Biến động nhân sự',  val: '22 nghìn viên',     trend: '-2%',  icon: '👤', bg: '#f59e0b', up: false },
        ],
        chartData: [
            { l: 'Q1', v: 3.2 }, { l: 'Q2', v: 4.5 }, { l: 'Q3', v: 5.8, hi: true }, { l: 'Q4', v: 1.9 },
        ],
        categories: [
            { label: 'Thực phẩm & Đồ uống', perc: 52, color: '#6366f1' },
            { label: 'Hóa phẩm & Gia dụng', perc: 30, color: '#f59e0b' },
            { label: 'Chăm sóc sức khỏe',   perc: 18, color: '#10b981' },
        ],
    },
};

const MODULE_STATS = [
    { label: 'Sản phẩm',      count: '1,240', icon: '🛍️', bg: '#6366f1' },
    { label: 'Loại hàng',     count: '45',    icon: '📁',  bg: '#f59e0b' },
    { label: 'Nhà cung cấp',  count: '12',    icon: '🚚',  bg: '#10b981' },
    { label: 'Nhân viên',     count: '22',    icon: '👤',  bg: '#ec4899' },
    { label: 'Voucher',       count: '08',    icon: '🎟️', bg: '#0ea5e9' },
    { label: 'Khách hàng',    count: '5,200', icon: '💎',  bg: '#8b5cf6' },
];

const ALERTS = [
    { type: 'err',  icon: '📦', msg: '12 sản phẩm sắp hết hàng, cần liên hệ nhà cung cấp.' },
    { type: 'warn', icon: '🎟️', msg: '03 voucher sẽ hết hạn trong 2 ngày tới.' },
];

const INVOICES = [
    { id: '#HD-4524', time: '12:50', total: '450,000 ₫',   status: 'Xong'  },
    { id: '#HD-4523', time: '12:42', total: '85,000 ₫',    status: 'Chờ'   },
    { id: '#HD-4522', time: '12:35', total: '1,250,000 ₫', status: 'Xong'  },
    { id: '#HD-4521', time: '12:30', total: '342,000 ₫',   status: 'Xong'  },
];

const TOP_PRODUCTS = [
    { name: 'Sữa tươi Vinamilk 1L',    cat: 'Đồ uống',   sold: 124, price: '32,000 ₫', icon: '🥛' },
    { name: 'Bánh mì sandwich',          cat: 'Thực phẩm', sold: 98,  price: '15,000 ₫', icon: '🍞' },
    { name: 'Nước rửa chén Sunlight',   cat: 'Hóa phẩm',  sold: 76,  price: '28,000 ₫', icon: '🧼' },
    { name: 'Mì Hảo Hảo tôm chua cay', cat: 'Thực phẩm', sold: 64,  price: '5,000 ₫',  icon: '🍜' },
];

/* ── Component ────────────────────────── */
export const DashboardPage = () => {
    const user = CURRENT_USER;
    const [activeTab, setActiveTab] = useState('Day');
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setLoaded(false);
        const t = setTimeout(() => setLoaded(true), 200);
        return () => clearTimeout(t);
    }, [activeTab]);

    const d = DATA[activeTab];
    const maxV = Math.max(...d.chartData.map(x => x.v));
    const now = new Date();
    const timeStr = now.toLocaleString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    return (
        <div className="dash-root">
            {/* ── Topbar ── */}
            <div className="dash-topbar">
                <div className="dash-topbar-left">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="dash-avatar">{initials(user.TENNV)}</div>
                        <div>
                            <div className="dash-topbar-title">Xin chào, {user.TENNV} 👋</div>
                            <div className="dash-topbar-time">{timeStr}</div>
                        </div>
                    </div>
                </div>
                <div className="dash-time-tabs">
                    {[['Day','Hôm nay'], ['Month','Tháng này'], ['Year','Năm nay']].map(([k, lbl]) => (
                        <button
                            key={k}
                            className={`dash-time-tab ${activeTab === k ? 'active' : ''}`}
                            onClick={() => setActiveTab(k)}
                        >{lbl}</button>
                    ))}
                </div>
            </div>

            {/* ── Body ── */}
            <div className="dash-body">
                {!loaded ? (
                    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'60vh', gap: 12 }}>
                        <div className="dash-spinner" />
                        <span style={{ fontSize: 14, color: 'var(--d-text-muted)', fontWeight: 600 }}>Đang tải dữ liệu...</span>
                    </div>
                ) : (
                    <>
                        {/* ── KPI Row (3 thẻ chính) ── */}
                        <div className="dash-section-title">Chỉ số chính</div>
                        <DashboardKpi kpis={d.kpis} />

                        {/* ── Main content + Sidebar ── */}
                        <div className="dash-main-grid">
                            {/* Cột chính */}
                            <div>
                                <DashboardCharts chartData={d.chartData} maxChartV={maxV} />
                                <DashboardOperations recentInvoices={INVOICES} />
                            </div>

                            {/* Sidebar */}
                            <div>
                                <ModuleHub stats={MODULE_STATS} />
                                <CategoryBreakdown categoryData={d.categories} />
                            </div>
                        </div>

                        {/* ── Bottom: Alerts + TopProducts ── */}
                        <div className="dash-bottom-row">
                            <TopProducts products={TOP_PRODUCTS} />
                            <DashboardAlerts alerts={ALERTS} />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};