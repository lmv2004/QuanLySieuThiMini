import React, { useState, useEffect, useRef } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { fmtVND, fmtDate } from '../../components/Manage/Shared';
import api from '../../services/api';
import './ReportsPage.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend, Filler);

// Chart color scheme
const chartColors = {
    primary: '#3c64d8',
    secondary: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b',
    info: '#06b6d4',
};

const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
        legend: {
            position: 'bottom',
            labels: {
                font: { size: 12, weight: 'bold' },
                padding: 15,
                usePointStyle: true,
            },
        },
    },
    scales: {
        y: {
            beginAtZero: true,
            ticks: { font: { size: 11 } },
        },
        x: {
            ticks: { font: { size: 11 } },
        },
    },
};

export const ReportsPage = () => {
    const [tab, setTab] = useState('revenue');
    const [year, setYear] =  useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const [summaryData, setSummaryData] = useState(null);
    const [hourlyData, setHourlyData] = useState(null);
    const [trendsData, setTrendsData] = useState(null);
    const [loading, setLoading] = useState(false);

    const reportRef = useRef(null);

    // Fetch Summary Report
    const fetchSummary = async () => {
        setLoading(true);
        try {
            const res = await api.get('/reports/revenue/summary', { params: { year } });
            setSummaryData(res?.data || res);
        } catch (err) {
            console.error('Lỗi:', err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch Hourly Report
    const fetchHourly = async () => {
        setLoading(true);
        try {
            const res = await api.get('/reports/revenue/hourly', { params: { date } });
            setHourlyData(res?.data || res);
        } catch (err) {
            console.error('Lỗi:', err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch Trends
    const fetchTrends = async () => {
        setLoading(true);
        try {
            const res = await api.get('/reports/revenue/trends');
            setTrendsData(res?.data || res);
        } catch (err) {
            console.error('Lỗi:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (tab === 'revenue') fetchSummary();
        else if (tab === 'hourly') fetchHourly();
        else if (tab === 'trends') fetchTrends();
    }, [tab, year, month, date]);

    // PDF Export
    const exportPDF = async () => {
        if (!reportRef.current) return;

        try {
            setLoading(true);
            const canvas = await html2canvas(reportRef.current, { scale: 2, logging: false });
            const imgData = canvas.toDataURL('image/png');

            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4',
            });

            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = pageWidth - 20;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);

            // Add footer
            pdf.setFontSize(10);
            pdf.text(`Báo cáo doanh thu - Tab: ${tab}`, 10, pageHeight - 10);
            pdf.text(new Date().toLocaleString('vi-VN'), pageWidth - 60, pageHeight - 10);

            pdf.save(`report-${tab}-${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (err) {
            console.error('Lỗi xuất PDF:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reports-page">
            <div className="reports-header">
                <h1>📊 Báo Cáo Doanh Thu Hoàn Chỉnh</h1>
                <p className="reports-subtitle">Phân tích chi tiết doanh thu, xu hướng, phân loại sản phẩm</p>
            </div>

            {/* Tabs */}
            <div className="reports-tabs">
                {[
                    { id: 'revenue', label: '📈 Doanh Thu Cột' },
                    { id: 'hourly', label: '⏰ Giờ Cao Điểm 24h' },
                    { id: 'trends', label: '📊 Xu Hướng' },
                ].map(t => (
                    <button
                        key={t.id}
                        className={`report-tab ${tab === t.id ? 'active' : ''}`}
                        onClick={() => setTab(t.id)}
                    >
                        {t.label}
                    </button>
                ))}
                <button className="report-export-btn" onClick={exportPDF} disabled={loading}>
                    📄 Xuất PDF
                </button>
            </div>

            {/* Report Content */}
            <div ref={reportRef} className="reports-content">
                {loading && <p className="report-loading">⏳ Đang tải dữ liệu...</p>}

                {/* Revenue Chart (Bar) */}
                {tab === 'revenue' && summaryData && (
                    <div className="report-section">
                        <div className="report-filters">
                            <label>Năm:</label>
                            <input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} />
                            <button onClick={fetchSummary} disabled={loading}>🔄 Tải</button>
                        </div>

                        <div className="stats-grid">
                            <div className="stat-box">
                                <div className="stat-icon">💰</div>
                                <div className="stat-label">Tổng Doanh Thu</div>
                                <div className="stat-value">{fmtVND(summaryData.yearlyTotal)}</div>
                            </div>
                            <div className="stat-box">
                                <div className="stat-icon">📋</div>
                                <div className="stat-label">Số Hóa Đơn</div>
                                <div className="stat-value">{summaryData.invoiceCount}</div>
                            </div>
                            <div className="stat-box">
                                <div className="stat-icon">📊</div>
                                <div className="stat-label">TB/Hóa Đơn</div>
                                <div className="stat-value">{fmtVND(summaryData.avgRevenue)}</div>
                            </div>
                            <div className="stat-box">
                                <div className="stat-icon">📈</div>
                                <div className="stat-label">Tháng Tốt Nhất</div>
                                <div className="stat-value">
                                    {fmtVND(Math.max(...summaryData.monthlyRevenue.map(m => m.total)))}
                                </div>
                            </div>
                        </div>

                        <div className="chart-container">
                            <h3>📊 Doanh Thu Từng Tháng - Biểu Đồ Cột</h3>
                            <Bar
                                data={{
                                    labels: summaryData.monthlyRevenue.map(m => `T${m.month}`),
                                    datasets: [
                                        {
                                            label: 'Doanh Thu (VND)',
                                            data: summaryData.monthlyRevenue.map(m => m.total),
                                            backgroundColor: chartColors.primary,
                                            borderColor: chartColors.primary,
                                            borderWidth: 2,
                                            hoverBackgroundColor: chartColors.info,
                                        },
                                    ],
                                }}
                                options={chartOptions}
                            />
                        </div>

                        <div className="table-card">
                            <h3>📋 Chi Tiết Doanh Thu Theo Tháng</h3>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Tháng</th>
                                        <th>Doanh Thu</th>
                                        <th>% Năm</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {summaryData.monthlyRevenue.map(m => (
                                        <tr key={m.month}>
                                            <td>Tháng {m.month}</td>
                                            <td className="price">{fmtVND(m.total)}</td>
                                            <td className="percent">
                                                {((m.total / summaryData.yearlyTotal) * 100).toFixed(1)}%
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Hourly Chart (Line) */}
                {tab === 'hourly' && hourlyData && (
                    <div className="report-section">
                        <div className="report-filters">
                            <label>Ngày:</label>
                            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                            <button onClick={fetchHourly} disabled={loading}>🔄 Tải</button>
                        </div>

                        <div className="stats-grid">
                            <div className="stat-box">
                                <div className="stat-icon">📊</div>
                                <div className="stat-label">Tổng Ngày</div>
                                <div className="stat-value">{fmtVND(hourlyData.totalDay)}</div>
                            </div>
                            <div className="stat-box">
                                <div className="stat-icon">⏰</div>
                                <div className="stat-label">Giờ Cao Điểm</div>
                                <div className="stat-value">{hourlyData.busiestHour?.label}</div>
                            </div>
                            <div className="stat-box">
                                <div className="stat-icon">💰</div>
                                <div className="stat-label">Doanh Thu Cao Điểm</div>
                                <div className="stat-value">{fmtVND(hourlyData.busiestHour?.total)}</div>
                            </div>
                            <div className="stat-box">
                                <div className="stat-icon">📋</div>
                                <div className="stat-label">HĐ Cao Điểm</div>
                                <div className="stat-value">{hourlyData.busiestHour?.count}</div>
                            </div>
                        </div>

                        <div className="chart-container">
                            <h3>📈 Doanh Thu theo Giờ trong Ngày - Biểu Đồ Đường</h3>
                            <Line
                                data={{
                                    labels: hourlyData.hourlyRevenue.map(h => h.label),
                                    datasets: [
                                        {
                                            label: 'Doanh Thu (VND)',
                                            data: hourlyData.hourlyRevenue.map(h => h.total),
                                            borderColor: chartColors.primary,
                                            backgroundColor: `${chartColors.primary}20`,
                                            fill: true,
                                            tension: 0.4,
                                            pointBackgroundColor: chartColors.primary,
                                            pointBorderColor: '#fff',
                                            pointBorderWidth: 2,
                                            pointRadius: 4,
                                            pointHoverRadius: 6,
                                        },
                                    ],
                                }}
                                options={chartOptions}
                            />
                        </div>

                        <div className="table-card">
                            <h3>📋 Chi Tiết Doanh Thu Từng Giờ</h3>
                            <div className="table-scroll">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Giờ</th>
                                            <th>Doanh Thu</th>
                                            <th>Số HĐ</th>
                                            <th>TB/HĐ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {hourlyData.hourlyRevenue.map(h => (
                                            <tr key={h.hour}>
                                                <td>{h.label}</td>
                                                <td className="price">{fmtVND(h.total)}</td>
                                                <td>{h.count}</td>
                                                <td className="price">
                                                    {h.count > 0 ? fmtVND(h.total / h.count) : '0'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Trends Chart */}
                {tab === 'trends' && trendsData && (
                    <div className="report-section">
                        <div className="report-filters">
                            <button onClick={fetchTrends} disabled={loading}>🔄 Tải Dữ Liệu Mới</button>
                        </div>

                        <div className="trends-stats">
                            <div className="trend-card positive">
                                <div className="trend-label">Tăng Hôm Nay</div>
                                <div className="trend-value">{trendsData.trends.dayGrowth.toFixed(1)}%</div>
                                <div className="trend-period">So với hôm qua</div>
                            </div>
                            <div className={`trend-card ${trendsData.trends.weekGrowth >= 0 ? 'positive' : 'negative'}`}>
                                <div className="trend-label">Tuần Này</div>
                                <div className="trend-value">{trendsData.trends.weekGrowth.toFixed(1)}%</div>
                                <div className="trend-period">So với tuần trước</div>
                            </div>
                            <div className={`trend-card ${trendsData.trends.monthGrowth >= 0 ? 'positive' : 'negative'}`}>
                                <div className="trend-label">Tháng Này</div>
                                <div className="trend-value">{trendsData.trends.monthGrowth.toFixed(1)}%</div>
                                <div className="trend-period">Tính từ đầu tháng</div>
                            </div>
                            <div className="trend-card info">
                                <div className="trend-label">Hôm Nay</div>
                                <div className="trend-value">{fmtVND(trendsData.trends.today)}</div>
                                <div className="trend-period">Doanh thu thực tế</div>
                            </div>
                        </div>

                        <div className="chart-container">
                            <h3>📊 Xu Hướng 30 Ngày Gần Đây</h3>
                            <Line
                                data={{
                                    labels: trendsData.last30Days.map(d => d.label),
                                    datasets: [
                                        {
                                            label: 'Doanh Thu (VND)',
                                            data: trendsData.last30Days.map(d => d.revenue),
                                            borderColor: chartColors.secondary,
                                            backgroundColor: `${chartColors.secondary}20`,
                                            fill: true,
                                            tension: 0.4,
                                            pointBackgroundColor: chartColors.secondary,
                                            pointBorderColor: '#fff',
                                            pointBorderWidth: 2,
                                        },
                                    ],
                                }}
                                options={chartOptions}
                            />
                        </div>

                        <div className="table-card">
                            <h3>📋 Chi Tiết 30 Ngày</h3>
                            <div className="table-scroll">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Ngày</th>
                                            <th>Doanh Thu</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {trendsData.last30Days.map(d => (
                                            <tr key={d.date}>
                                                <td>{d.date}</td>
                                                <td className="price">{fmtVND(d.revenue)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

