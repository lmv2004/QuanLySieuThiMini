import React from 'react';
import { Ico } from '../../components/Manage/Icons';
import { avatarColor } from '../../components/Manage/Shared';

export const PositionGridItem = ({ item, openEdit, del, idx, list, setList, addToast, openView }) => (
    <div className="grid-item-card">
        <div className="grid-item-card-top">
            <div className="grid-item-icon-box" style={{ background: avatarColor(idx), color: '#fff', fontSize: 18, fontWeight: 800 }}>
                {(item.TENCHUCVU?.[0] || '?').toUpperCase()}
            </div>
            <span className={item.IS_DELETED ? 'badge badge-inactive' : 'badge badge-role'}>
                {item.IS_DELETED ? 'Bị khóa' : 'Chức vụ'}
            </span>
        </div>
        <div className="grid-item-card-mid" style={{ flex: 1 }}>
            <div className="grid-item-title" style={{ fontFamily: 'var(--font)', fontSize: 15 }}>{item.TENCHUCVU}</div>
            <div className="grid-item-label">Mã CV: {item.MACHUCVU}</div>
        </div>
        <div className="grid-item-card-bottom">
            <div className="grid-item-value" style={{ fontSize: 13, fontFamily: 'var(--mono)' }}>
                {item.LUONGCOBAN ? (Number(item.LUONGCOBAN) / 1000000).toFixed(1) + 'M' : '0M'}/tháng
            </div>
            <div className="grid-item-label">Lương CB</div>
        </div>
        <div className="grid-item-actions">
            <button className="btn-edit" onClick={() => openEdit(item)}>{Ico.edit}</button>
            <button className="btn-del" onClick={() => del(item.MACHUCVU)}>{Ico.trash}</button>
        </div>
    </div>
);
