import React from 'react';

// ── Module Hub ─────────────────────────────────
export const ModuleHub = ({ stats }) => (
    <div className="dash-card dash-animate" style={{ animationDelay: '0.15s', marginBottom: 20 }}>
        <div className="dash-card-header">
            <div className="dash-card-header-title">Tổng quan Hệ thống</div>
        </div>
        <div className="dash-module-grid">
            {stats.map((s, i) => (
                <div className="dash-module-item" key={i}>
                    <div className="dash-module-icon" style={{ background: s.bg + '15', color: s.bg }}>{s.icon}</div>
                    <div>
                        <div className="dash-module-count">{s.count}</div>
                        <div className="dash-module-label">{s.label}</div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// ── Alerts ─────────────────────────────────────
export const DashboardAlerts = ({ alerts }) => (
    <div className="dash-card dash-animate" style={{ animationDelay: '0.2s', marginBottom: 20 }}>
        <div className="dash-card-header">
            <div className="dash-card-header-title">⚠ Cảnh báo Cần xử lý</div>
        </div>
        <div className="dash-card-body">
            {alerts.map((a, i) => (
                <div className={`dash-alert ${a.type}`} key={i}>
                    <span>{a.icon}</span>
                    <span>{a.msg}</span>
                </div>
            ))}
        </div>
    </div>
);

// ── Recent Transactions ─────────────────────────
export const DashboardOperations = ({ recentInvoices }) => (
    <div className="dash-card dash-animate" style={{ animationDelay: '0.2s' }}>
        <div className="dash-card-header">
            <div className="dash-card-header-title">Giao dịch Gần đây</div>
        </div>
        <table className="dash-table">
            <thead>
                <tr>
                    <th>Mã hóa đơn</th>
                    <th>Thời gian</th>
                    <th>Tổng tiền</th>
                    <th style={{ textAlign: 'center' }}>Trạng thái</th>
                </tr>
            </thead>
            <tbody>
                {recentInvoices.map(inv => (
                    <tr key={inv.id}>
                        <td><strong style={{ color: 'var(--d-accent)' }}>{inv.id}</strong></td>
                        <td style={{ color: 'var(--d-text-muted)' }}>{inv.time}</td>
                        <td style={{ fontWeight: 700 }}>{inv.total}</td>
                        <td style={{ textAlign: 'center' }}>
                            <span className={`dash-status ${inv.status === 'Xong' ? 'ok' : 'pending'}`}>
                                {inv.status === 'Xong' ? '✓' : '⏳'} {inv.status}
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

// ── Top Products ───────────────────────────────
export const TopProducts = ({ products }) => (
    <div className="dash-card dash-animate" style={{ animationDelay: '0.25s' }}>
        <div className="dash-card-header">
            <div className="dash-card-header-title">Sản phẩm Bán chạy</div>
        </div>
        <table className="dash-table">
            <thead>
                <tr>
                    <th>Sản phẩm</th>
                    <th style={{ textAlign: 'right' }}>Đã bán</th>
                    <th style={{ textAlign: 'right' }}>Đơn giá</th>
                </tr>
            </thead>
            <tbody>
                {products.map((p, i) => (
                    <tr key={i}>
                        <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ width: 32, height: 32, background: '#f1f5f9', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{p.icon}</div>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</div>
                                    <div style={{ fontSize: 11, color: 'var(--d-text-muted)' }}>{p.cat}</div>
                                </div>
                            </div>
                        </td>
                        <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--d-accent)' }}>{p.sold}</td>
                        <td style={{ textAlign: 'right', color: 'var(--d-text-sub)', fontSize: 12 }}>{p.price}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);
