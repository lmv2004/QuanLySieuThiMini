import React from 'react';

// ── Chart ──────────────────────────────────────
export const DashboardCharts = ({ chartData, maxChartV }) => (
    <div className="dash-card dash-animate" style={{ animationDelay: '0.1s', marginBottom: 20 }}>
        <div className="dash-card-header">
            <div>
                <div className="dash-card-header-title">Doanh thu theo khung giờ</div>
                <div className="dash-card-header-sub">Theo dõi hiệu suất bán hàng trong ngày</div>
            </div>
        </div>
        <div className="dash-card-body">
            <div className="dash-chart-wrap">
                {chartData.map((d, i) => (
                    <div className="dash-chart-col" key={i}>
                        <div
                            className={`dash-chart-bar ${d.hi ? 'active' : ''}`}
                            style={{ height: `${(d.v / maxChartV) * 100}%` }}
                            data-tip={`${d.v}M`}
                        />
                        <span className="dash-chart-label">{d.l}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// ── Category Progress ──────────────────────────
export const CategoryBreakdown = ({ categoryData }) => (
    <div className="dash-card" style={{ marginBottom: 0 }}>
        <div className="dash-card-header">
            <div className="dash-card-header-title">Tỉ trọng Danh mục</div>
        </div>
        <div className="dash-card-body">
            <div className="dash-progress-list">
                {categoryData.map((c, i) => (
                    <div className="dash-progress-item" key={i}>
                        <div className="dash-progress-meta">
                            <span>{c.label}</span>
                            <span className="dash-progress-pct">{c.perc}%</span>
                        </div>
                        <div className="dash-progress-bar">
                            <div className="dash-progress-fill" style={{ width: `${c.perc}%`, background: c.color }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);
