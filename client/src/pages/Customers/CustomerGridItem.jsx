import React from 'react';
import { Ico } from '../../components/Manage/Icons';
import { avatarColor } from '../../components/Manage/Shared';

export const CustomerGridItem = ({ item, openEdit, del, idx, list, setList, addToast, openView }) => (
    <div className="grid-item-card">
        <div className="grid-item-card-top">
            <div className="grid-item-icon-box" style={{ background: avatarColor(idx), color: '#fff', fontSize: 18, fontWeight: 800 }}>
                {(item.TENKH?.[0] || 'K').toUpperCase()}
            </div>
            <span className={item.IS_DELETED ? 'badge badge-inactive' : 'badge badge-active'}>
                {item.IS_DELETED ? 'Bị khóa' : 'Hoạt động'}
            </span>
        </div>
        <div className="grid-item-card-mid" style={{ flex: 1 }}>
            <div className="grid-item-title" style={{ fontFamily: 'var(--font)', fontSize: 15 }}>{item.TENKH}</div>
            <div className="grid-item-label">
                <span style={{ marginRight: 6 }}>{Ico.phone}</span>
                {item.SODIENTHOAI || '—'}
            </div>
            <div className="grid-item-label">
                <span style={{ marginRight: 6 }}>{Ico.mapPin}</span>
                {item.DIACHI || '—'}
            </div>
        </div>
        <div className="grid-item-card-bottom">
            <div className="grid-item-value" style={{ fontSize: 16 }}>{item.DIEMTHUONG || 0}</div>
            <div className="grid-item-label">Điểm thưởng</div>
        </div>
        <div className="grid-item-actions">
            <button className="btn-edit" onClick={() => openEdit(item)}>{Ico.edit}</button>
            <button className="btn-del" onClick={() => del(item.MAKH)}>{Ico.trash}</button>
        </div>
    </div>
);
