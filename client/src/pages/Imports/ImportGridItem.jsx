import React from 'react';
import { Ico } from '../../components/Manage/Icons';
import { fmtDate, fmtVND } from '../../components/Manage/Shared';

export const ImportGridItem = ({ item, openEdit, del, idx, list, setList, addToast, openView }) => (
    <div className="grid-item-card">
        <div className="grid-item-card-top">
            <div className="grid-item-icon-box" style={{ background: 'var(--bg-hover)', border: '1px solid var(--border)' }}>
                {Ico.package}
            </div>
            <span className={item.IS_DELETED ? 'badge badge-inactive' : 'badge badge-active'}>
                {item.IS_DELETED ? 'Đã hủy' : 'Hoạt động'}
            </span>
        </div>
        <div className="grid-item-card-mid" style={{ flex: 1 }}>
            <div className="grid-item-title" style={{ fontFamily: 'var(--mono)', fontSize: 15 }}>
                Phiếu nhập #{String(item.MAPHIEU).padStart(3, '0')}
            </div>
            <div className="grid-item-label">{item.NGAYLAP ? fmtDate(item.NGAYLAP) : '—'}</div>
        </div>
        <div className="grid-item-card-bottom">
            <div className="grid-item-value" style={{ fontSize: 18 }}>{fmtVND(item.TONGTIEN || 0)}</div>
            <div className="grid-item-label">Tổng tiền</div>
        </div>
        <div className="grid-item-actions">
            <button className="btn-edit" onClick={() => openEdit(item)}>{Ico.edit}</button>
            <button className="btn-del" onClick={() => del(item.MAPHIEU)}>{Ico.trash}</button>
        </div>
    </div>
);
