import React, { useState, useMemo } from 'react';
import { SimplePage } from '../../components/Manage/SimplePage';
import { Ico } from '../../components/Manage/Icons';
import { EmptyState } from '../../components/Manage/EmptyState';
import { Modal } from '../../components/Manage/Modal';
import { fmtDate, STATUS_MAP } from '../../components/Manage/Shared';

export const DisposalsPage = () => <SimplePage
    title="Phiếu xuất hủy" icon={Ico.trash}
    subtitle={(l) => `${l.length} phiếu hủy`}
    emptyTitle="Chưa có phiếu hủy" emptyDesc="Nhấn + Tạo phiếu hủy để bắt đầu"
    cols={['Mã phiếu', 'Ngày lập', 'Nhân viên', 'Lý do', 'Trạng thái', 'Thao tác']}
    emptyForm={{ NGAYLAP: '', LYDO: '' }}
    tabs={[
        { id: 'all', label: 'Tất cả' },
        { id: 'pending', label: 'Chờ duyệt', filter: (x) => x.TRANGTHAI === 'PENDING' },
        { id: 'approved', label: 'Đã duyệt', filter: (x) => x.TRANGTHAI === 'APPROVED' },
    ]}
    renderRow={(p, i, list, setList) => {
        const st = STATUS_MAP[p.TRANGTHAI] || { label: p.TRANGTHAI, cls: 'badge' };
        const app = (id) => setList(prev => prev.map(x => x.MAPHIEU === id ? { ...x, TRANGTHAI: 'APPROVED' } : x));
        const can = (id) => { if (window.confirm('Hủy phiếu xuất hủy này?')) setList(prev => prev.filter(x => x.MAPHIEU !== id)); };
        return [
            <td key="1"><span className="code-link">DSP-{String(p.MAPHIEU).slice(-3).padStart(3, '0')}</span></td>,
            <td key="2" style={{ color: 'var(--text-muted)' }}>{fmtDate(p.NGAYLAP)}</td>,
            <td key="3">—</td>,
            <td key="4" style={{ color: 'var(--text-muted)', fontSize: 12 }}>{p.LYDO || '—'}</td>,
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
        const can = (id) => { if (window.confirm('Hủy phiếu xuất hủy này?')) setList(prev => prev.filter(x => x.MAPHIEU !== id)); };
        return (
            <div key={p.MAPHIEU} className="voucher-card">
                <div className="voucher-card-top">
                    <div className="voucher-icon-box" style={{ background: 'var(--bg-hover)', border: '1px solid var(--border)' }}>{Ico.trash}</div>
                    <span className={st.cls}>{st.label}</span>
                </div>
                <div className="voucher-card-mid" style={{ flex: 1 }}>
                    <div className="voucher-code" style={{ fontFamily: 'var(--mono)', fontSize: 16 }}>DSP-{String(p.MAPHIEU).slice(-3).padStart(3, '0')}</div>
                    <div className="voucher-label">{p.LYDO || 'Kế hoạch hủy hàng'}</div>
                    <div className="voucher-label" style={{ marginTop: 4 }}>{fmtDate(p.NGAYLAP)}</div>
                </div>
                <div className="ticket-divider" />
                <div className="voucher-card-bottom">
                    {p.TRANGTHAI === 'PENDING' ? (
                        <div style={{ display: 'flex', gap: 8, width: '100%' }}>
                            <button className="btn-approve" style={{ flex: 1, padding: '8px' }} onClick={() => app(p.MAPHIEU)}>Duyệt</button>
                            <button className="btn-cancel-action" style={{ flex: 1, padding: '8px' }} onClick={() => can(p.MAPHIEU)}>Hủy</button>
                        </div>
                    ) : (
                        <div className="voucher-label" style={{ textAlign: 'center', width: '100%' }}>Phiếu đã xử lý</div>
                    )}
                </div>
            </div>
        );
    }}
    renderForm={(form, hc) => <>
        <div className="form-group"><label className="form-label">Ngày lập</label><input className="form-input" type="date" name="NGAYLAP" value={form.NGAYLAP} onChange={hc} /></div>
        <div className="form-group"><label className="form-label">Lý do hủy</label><input className="form-input" name="LYDO" value={form.LYDO} onChange={hc} placeholder="Hàng hết hạn..." /></div>
    </>}
/>;
