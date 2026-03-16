import React, { useState, useMemo } from 'react';
import { SimplePage } from '../../components/Manage/SimplePage';
import { Ico } from '../../components/Manage/Icons';
import { EmptyState } from '../../components/Manage/EmptyState';
import { Modal } from '../../components/Manage/Modal';
import { fmtDate, fmtVND, STATUS_MAP } from '../../components/Manage/Shared';

export const ImportsPage = () => <SimplePage
    title="Phiếu nhập hàng" icon={Ico.file}
    subtitle={(l) => `${l.length} phiếu nhập`}
    emptyTitle="Chưa có phiếu nhập" emptyDesc="Nhấn + Tạo phiếu nhập để bắt đầu"
    cols={['Mã phiếu', 'Ngày lập', 'NCC', 'Tổng tiền', 'Trạng thái', 'Thao tác']}
    emptyForm={{ NGAYLAP: '', TONGTIEN: '', GCHU: '' }}
    tabs={[
        { id: 'all', label: 'Tất cả' },
        { id: 'pending', label: 'Chờ duyệt', filter: (x) => x.TRANGTHAI === 'PENDING' },
        { id: 'approved', label: 'Đã duyệt', filter: (x) => x.TRANGTHAI === 'APPROVED' },
        { id: 'cancelled', label: 'Đã hủy', filter: (x) => x.TRANGTHAI === 'CANCELLED' },
    ]}
    renderRow={(p, i, list, setList) => {
        const st = STATUS_MAP[p.TRANGTHAI] || { label: p.TRANGTHAI, cls: 'badge' };
        const app = (id) => setList(prev => prev.map(x => x.MAPHIEU === id ? { ...x, TRANGTHAI: 'APPROVED' } : x));
        const can = (id) => { if (window.confirm('Hủy phiếu nhập này?')) setList(prev => prev.map(x => x.MAPHIEU === id ? { ...x, TRANGTHAI: 'CANCELLED' } : x)); };
        return [
            <td key="1"><span className="code-link">IMP-{String(p.MAPHIEU).slice(-3).padStart(3, '0')}</span></td>,
            <td key="2" style={{ color: 'var(--text-muted)' }}>{fmtDate(p.NGAYLAP)}</td>,
            <td key="3">—</td>,
            <td key="4" className="price-main">{fmtVND(p.TONGTIEN)}</td>,
            <td key="5"><span className={st.cls}>{st.label}</span></td>,
            <td key="6">
                {p.TRANGTHAI === 'PENDING' ? (
                    <div className="actions-cell">
                        <button className="btn-approve" onClick={() => app(p.MAPHIEU)}>Duyệt</button>
                        <button className="btn-cancel-action" onClick={() => can(p.MAPHIEU)}>Hủy</button>
                    </div>
                ) : <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>—</span>}
            </td>
        ];
    }}
    renderGridItem={(p, openEdit, del, i, list, setList) => {
        const st = STATUS_MAP[p.TRANGTHAI] || { label: p.TRANGTHAI, cls: 'badge' };
        const app = (id) => setList(prev => prev.map(x => x.MAPHIEU === id ? { ...x, TRANGTHAI: 'APPROVED' } : x));
        const can = (id) => { if (window.confirm('Hủy phiếu nhập này?')) setList(prev => prev.map(x => x.MAPHIEU === id ? { ...x, TRANGTHAI: 'CANCELLED' } : x)); };
        return (
            <div key={p.MAPHIEU} className="voucher-card">
                <div className="voucher-card-top">
                    <div className="voucher-icon-box" style={{ background: 'var(--bg-hover)', border: '1px solid var(--border)' }}>{Ico.file}</div>
                    <span className={st.cls}>{st.label}</span>
                </div>
                <div className="voucher-card-mid" style={{ flex: 1 }}>
                    <div className="voucher-code" style={{ fontFamily: 'var(--mono)', fontSize: 16 }}>IMP-{String(p.MAPHIEU).slice(-3).padStart(3, '0')}</div>
                    <div className="voucher-label">{p.GCHU || 'Nhập hàng định kỳ'}</div>
                    <div className="voucher-label" style={{ marginTop: 4 }}>{fmtDate(p.NGAYLAP)}</div>
                </div>
                <div className="ticket-divider" />
                <div className="voucher-card-bottom">
                    <div className="voucher-value" style={{ fontSize: 17 }}>{fmtVND(p.TONGTIEN)}</div>
                    <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                        {p.TRANGTHAI === 'PENDING' && (
                            <>
                                <button className="btn-approve" style={{ flex: 1, padding: '6px' }} onClick={() => app(p.MAPHIEU)}>Duyệt</button>
                                <button className="btn-cancel-action" style={{ flex: 1, padding: '6px' }} onClick={() => can(p.MAPHIEU)}>Hủy</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    }}
    renderForm={(form, hc) => <>
        <div className="form-group"><label className="form-label">Ngày lập</label><input className="form-input" type="date" name="NGAYLAP" value={form.NGAYLAP} onChange={hc} /></div>
        <div className="form-group"><label className="form-label">Tổng tiền (₫)</label><input className="form-input" type="number" name="TONGTIEN" value={form.TONGTIEN} onChange={hc} placeholder="0" /></div>
        <div className="form-group"><label className="form-label">Ghi chú</label><input className="form-input" name="GCHU" value={form.GCHU} onChange={hc} placeholder="Ghi chú..." /></div>
    </>}
/>;
