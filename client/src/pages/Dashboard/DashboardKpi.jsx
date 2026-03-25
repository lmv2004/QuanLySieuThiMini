import React from 'react';

export const DashboardKpi = ({ kpis }) => {
    return (
        <div className="dash-kpi-row dash-animate">
            {kpis.map((k, i) => (
                <div className="dash-kpi" key={k.id} style={{ animationDelay: `${i * 0.05}s` }}>
                    <div className="dash-kpi-top">
                        <span className="dash-kpi-label">{k.label}</span>
                        <div className="dash-kpi-icon" style={{ background: k.bg + '18', color: k.bg }}>{k.icon}</div>
                    </div>
                    <div className="dash-kpi-value">{k.val}</div>
                    <div className="dash-kpi-footer">
                        <span className={k.up ? 'dash-badge-up' : 'dash-badge-down'}>
                            {k.up ? '▲' : '▼'} {k.trend}
                        </span>
                        <span>so với kỳ trước</span>
                    </div>
                </div>
            ))}
        </div>
    );
};
