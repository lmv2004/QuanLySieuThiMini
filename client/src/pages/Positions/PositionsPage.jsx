import React, { useState, useMemo } from 'react';
import { SimplePage } from '../../components/Manage/SimplePage';
import { Ico } from '../../components/Manage/Icons';
import { avatarColor } from '../../components/Manage/Shared';
import { EmptyState } from '../../components/Manage/EmptyState';
import { Modal } from '../../components/Manage/Modal';

const CV_EMPTY = { TENCHUCVU: '', MOTA: '' };

export const PositionsPage = () => <SimplePage
    title="Chức vụ" icon={Ico.userCheck}
    subtitle={(l) => `${l.length} chức vụ`}
    emptyTitle="Chưa có chức vụ" emptyDesc="Nhấn + Thêm để bắt đầu"
    cols={['#', 'Tên chức vụ', 'Mô tả']}
    emptyForm={{ TENCHUCVU: '', MOTA: '' }}
    renderRow={(cv, i) => [
        <td key="1" style={{ color: 'var(--text-muted)', fontFamily: 'var(--mono)', fontSize: 12 }}>{i + 1}</td>,
        <td key="2"><span className="entity-name">{cv.TENCHUCVU}</span></td>,
        <td key="3" style={{ color: 'var(--text-muted)', fontSize: 12.5 }}>{cv.MOTA || '—'}</td>,
    ]}
    renderActions={(cv, openEdit, del) => (
        <>
            <button className="btn-action-ico btn-edit" title="Sửa" onClick={() => openEdit(cv)}>{Ico.edit}</button>
            <button className="btn-action-ico btn-del" title="Xóa" onClick={() => del(cv._id || cv.MACHUCVU)}>{Ico.trash}</button>
        </>
    )}
    renderGridItem={(cv, openEdit, del, i) => (
        <div key={cv._id || cv.MACHUCVU} className="voucher-card">
            <div className="voucher-card-top">
                <div className="voucher-icon-box" style={{ background: avatarColor(i), color: '#fff', fontSize: 16, fontWeight: 800 }}>{(cv.TENCHUCVU[0] || '?').toUpperCase()}</div>
                <span className="badge badge-info">Vai trò</span>
            </div>
            <div className="voucher-card-mid" style={{ flex: 1 }}>
                <div className="voucher-code" style={{ fontFamily: 'var(--font)', fontSize: 15 }}>{cv.TENCHUCVU}</div>
                <div className="voucher-label" style={{ marginTop: 6 }}>
                    {cv.MOTA || 'Chưa có mô tả cho chức vụ này'}
                </div>
            </div>
            <div className="ticket-divider" />
            <div className="voucher-card-bottom">
                <div className="voucher-label">Mã CV: {cv.MACHUCVU || 'AUTO'}</div>
                <div className="voucher-label" style={{ color: 'var(--accent2)' }}>Phân quyền →</div>
            </div>
            <div className="voucher-actions">
                <button className="btn-edit" onClick={() => openEdit(cv)}>{Ico.edit}</button>
                <button className="btn-del" onClick={() => del(cv._id || cv.MACHUCVU)}>{Ico.trash}</button>
            </div>
        </div>
    )}
    renderForm={(form, hc) => <>
        <div className="form-group"><label className="form-label">Tên chức vụ</label><input className="form-input" name="TENCHUCVU" value={form.TENCHUCVU} onChange={hc} placeholder="Thu ngân, Thủ kho..." /></div>
        <div className="form-group"><label className="form-label">Mô tả</label><input className="form-input" name="MOTA" value={form.MOTA} onChange={hc} placeholder="Mô tả ngắn (tùy chọn)" /></div>
    </>}
/>;
