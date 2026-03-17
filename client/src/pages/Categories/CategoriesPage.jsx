import React, { useState, useMemo } from 'react';
import { SimplePage } from '../../components/Manage/SimplePage';
import { Ico } from '../../components/Manage/Icons';
import { avatarColor } from '../../components/Manage/Shared';
import { EmptyState } from '../../components/Manage/EmptyState';
import { Modal } from '../../components/Manage/Modal';

export const CategoriesPage = () => <SimplePage
    title="Loại sản phẩm" icon={Ico.tag}
    subtitle={(l) => `${l.length} loại`}
    emptyTitle="Chưa có loại sản phẩm" emptyDesc="Nhấn + Thêm để bắt đầu"
    cols={['#', 'Tên loại', 'Mô tả']}
    emptyForm={{ TENLOAI: '', MOTA: '' }}
    renderRow={(l, i) => [
        <td key="1" style={{ color: 'var(--text-muted)', fontFamily: 'var(--mono)', fontSize: 12 }}>{i + 1}</td>,
        <td key="2"><span className="badge badge-info">{l.TENLOAI}</span></td>,
        <td key="3" style={{ color: 'var(--text-muted)', fontSize: 12.5 }}>{l.MOTA || '—'}</td>,
    ]}
    renderActions={(l, openEdit, del) => (
        <>
            <button className="btn-action-ico btn-edit" title="Sửa" onClick={() => openEdit(l)}>{Ico.edit}</button>
            <button className="btn-action-ico btn-del" title="Xóa" onClick={() => del(l._id || l.MALOAI)}>{Ico.trash}</button>
        </>
    )}
    renderGridItem={(l, openEdit, del, i) => (
        <div key={l._id || l.MALOAI} className="voucher-card">
            <div className="voucher-card-top">
                <div className="voucher-icon-box" style={{ background: avatarColor(i), color: '#fff', fontSize: 16, fontWeight: 800 }}>{(l.TENLOAI[0] || '?').toUpperCase()}</div>
                <span className="badge badge-info">Loại hàng</span>
            </div>
            <div className="voucher-card-mid" style={{ flex: 1 }}>
                <div className="voucher-code" style={{ fontFamily: 'var(--font)', fontSize: 15 }}>{l.TENLOAI}</div>
                <div className="voucher-label" style={{ marginTop: 6, lineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {l.MOTA || 'Chưa có mô tả cho loại hàng này'}
                </div>
            </div>
            <div className="ticket-divider" />
            <div className="voucher-card-bottom">
                <div className="voucher-label">Danh mục #{i + 1}</div>
                <div className="voucher-label" style={{ color: 'var(--accent2)' }}>Xem sản phẩm →</div>
            </div>
            <div className="voucher-actions">
                <button className="btn-edit" onClick={() => openEdit(l)}>{Ico.edit}</button>
                <button className="btn-del" onClick={() => del(l._id || l.MALOAI)}>{Ico.trash}</button>
            </div>
        </div>
    )}
    renderForm={(form, hc) => <>
        <div className="form-group"><label className="form-label">Tên loại</label><input className="form-input" name="TENLOAI" value={form.TENLOAI} onChange={hc} placeholder="Đồ uống, Thực phẩm..." /></div>
        <div className="form-group"><label className="form-label">Mô tả</label><input className="form-input" name="MOTA" value={form.MOTA} onChange={hc} placeholder="Mô tả (tùy chọn)" /></div>
    </>}
/>;
