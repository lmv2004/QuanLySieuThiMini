import React from 'react';
import { Ico } from '../../components/Manage/Icons';
import { avatarColor } from '../../components/Manage/Shared';

export const CategoryGridItem = ({ item, openEdit, del, idx, list, setList, addToast, openView }) => (
    <div className="grid-item-card">
        <div className="grid-item-card-top">
            <div className="grid-item-icon-box" style={{ background: avatarColor(idx), color: '#fff', fontSize: 18, fontWeight: 800 }}>
                {(item.TENLOAI?.[0] || '?').toUpperCase()}
            </div>
            <span className={item.IS_DELETED ? 'badge badge-inactive' : 'badge badge-info'}>
                {item.IS_DELETED ? 'Bị khóa' : 'Phân loại'}
            </span>
        </div>
        <div className="grid-item-card-mid" style={{ flex: 1 }}>
            <div className="grid-item-title" style={{ fontFamily: 'var(--font)', fontSize: 15 }}>{item.TENLOAI}</div>
            <div className="grid-item-label">Mã LSP: {item.MALOAI}</div>
        </div>
        <div className="grid-item-card-bottom">
            <div className="grid-item-value" style={{ fontSize: 14, color: 'var(--text-muted)' }}>
                {item.MOTA || '—'}
            </div>
            <div className="grid-item-label">Mô tả</div>
        </div>
        <div className="grid-item-actions">
            <button className="btn-edit" onClick={() => openEdit(item)}>{Ico.edit}</button>
            <button className="btn-del" onClick={() => del(item.MALOAI)}>{Ico.trash}</button>
        </div>
    </div>
);
