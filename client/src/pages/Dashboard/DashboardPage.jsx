import React, { useState, useEffect } from 'react';
import { initials } from '../../components/Manage/Shared';
import { useAuth } from '../../hooks/useAuth';
import { DashboardKpi } from './DashboardKpi';
import { DashboardCharts, CategoryBreakdown } from './DashboardCharts';
import { DashboardOperations, ModuleHub, DashboardAlerts, TopProducts } from './DashboardOperations';
import './Dashboard.css';
import api from '../../services/api';

/* ── Component ────────────────────────── */
export const DashboardPage = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('day');
    const [loaded, setLoaded] = useState(false);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch dashboard data from API
    useEffect(() => {
        fetchDashboardData();
    }, [activeTab]);

    const fetchDashboardData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/dashboard/stats', {
                params: { period: activeTab }
            });
            setData(response);
            setLoaded(false);
            const t = setTimeout(() => setLoaded(true), 200);
            return () => clearTimeout(t);
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError('Không thể tải dữ liệu dashboard');
            // Set fallback data if API fails
            setData(getFallbackData());
        } finally {
            setLoading(false);
        }
    };

    // Fallback data if API fails
    const getFallbackData = () => ({
        kpis: [
            { id: 'rev',   label: 'Doanh thu',    val: '0 ₫',      trend: '+0%',    icon: '💰', bg: '#6366f1', up: true  },
            { id: 'inv',   label: 'Hóa đơn',      val: '0',        trend: '+0',     icon: '🧾', bg: '#0ea5e9', up: true  },
            { id: 'alert', label: 'Cảnh báo',    val: '0 mặt hàng', trend: 'Cần nhập', icon: '📦', bg: '#ef4444', up: false },
        ],
        chartData: [
            { l: '08h', v: 0 }, { l: '10h', v: 0 }, { l: '12h', v: 0 },
            { l: '14h', v: 0 }, { l: '16h', v: 0 }, { l: '18h', v: 0 },
        ],
        categories: [
            { label: 'Đang tải...', perc: 100, color: '#6366f1' },
        ],
        topProducts: [],
        alerts: [],
        operations: {},
    });

    const now = new Date();
    
    // Calculate max chart value for scaling
    const maxV = data?.chartData ? Math.max(...data.chartData.map(d => d.v || 0), 100) : 100;

    return (
        <div className="dash-root">
            {/* ── Topbar ── */}
            <div className="dash-topbar">
                <div className="dash-topbar-left">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="dash-avatar">{initials(user?.TENNV || '')}</div>
                        <div>
                            <div className="dash-topbar-title">Xin chào, {user?.TENNV || 'Người dùng'} 👋</div>
                            <div className="dash-topbar-time">{now.toLocaleString('vi-VN')}</div>
                        </div>
                    </div>
                </div>
                <div className="dash-time-tabs">
                    {[['day','Hôm nay'], ['month','Tháng này'], ['year','Năm nay']].map(([k, lbl]) => (
                        <button
                            key={k}
                            className={`dash-time-tab ${activeTab === k ? 'active' : ''}`}
                            onClick={() => setActiveTab(k)}
                            disabled={loading}
                        >{lbl}</button>
                    ))}
                </div>
            </div>

            {/* ── Body ── */}
            <div className="dash-body">
                {loading || !data ? (
                    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'60vh', gap: 12 }}>
                        <div className="dash-spinner" />
                        <span style={{ fontSize: 14, color: 'var(--d-text-muted)', fontWeight: 600 }}>Đang tải dữ liệu...</span>
                    </div>
                ) : error ? (
                    <div style={{ color: '#ef4444', textAlign: 'center', padding: 20 }}>
                        ⚠️ {error}
                    </div>
                ) : (
                    <>
                        {/* ── KPI Row (3 thẻ chính) ── */}
                        <div className="dash-section-title">Chỉ số chính</div>
                        <DashboardKpi kpis={data.kpis} />

                        {/* ── Main content + Sidebar ── */}
                        <div className="dash-main-grid">
                            {/* Cột chính */}
                            <div>
                                <DashboardCharts chartData={data.chartData} maxChartV={maxV} />
                                <DashboardOperations recentInvoices={data.topProducts?.slice(0, 4) || []} />
                            </div>

                            {/* Sidebar */}
                            <div>
                                <ModuleHub stats={data.operations || {}} />
                                <CategoryBreakdown categoryData={data.categories} />
                            </div>
                        </div>

                        {/* ── Bottom: Alerts + TopProducts ── */}
                        <div className="dash-bottom-row">
                            <TopProducts products={data.topProducts || []} />
                            <DashboardAlerts alerts={data.alerts || []} />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};