import React from 'react';
import { Ico } from '../../components/Manage/Icons';
import { fmtVND, totalStock, avatarColor, STOCK_MAX } from '../../components/Manage/Shared';

export const ProductGridItem = ({ item, openEdit, del, idx, list, setList, addToast, openView }) => {
    const stock = totalStock(item.tonKhos);
    const pct = Math.min(100, Math.round((stock / STOCK_MAX) * 100));

    return (
        <div key={item.MASP} className="grid-item-card">
            <div className="grid-item-card-top">
                <div className="grid-item-icon-box" style={{ background: avatarColor(idx), color: '#fff', fontSize: 18, fontWeight: 800 }}>
                    {(item.TENSP[0] || '?').toUpperCase()}
                </div>
                <span className={item.IS_DELETED ? 'badge badge-inactive' : 'badge badge-active'}>{item.IS_DELETED ? 'Ngừng' : 'Đang bán'}</span>
            </div>
            <div className="grid-item-card-mid" style={{ flex: 1 }}>
                <div className="grid-item-title" style={{ fontFamily: 'var(--font)', fontSize: 15 }}>{item.TENSP}</div>
                <div className="grid-item-label">{item.BARCODE}</div>
                <div className="stock-cell" style={{ marginTop: 12 }}>
                    <div className="stock-bar" style={{ flex: 1 }}>
                        <div className="stock-fill" style={{ width: `${pct}%`, background: stock === 0 ? 'var(--red)' : undefined }} />
                    </div>
                    <span className="stock-count" style={{ fontSize: 11 }}>{stock} tồn</span>
                </div>
            </div>
            <div className="grid-item-card-bottom">
                <div className="grid-item-value" style={{ fontSize: 18 }}>{fmtVND(item.GIABAN)}</div>
                <div className="grid-item-label">{item.DVT}</div>
            </div>
            <div className="grid-item-actions">
                {openView && <button className="btn-view-action" title="Xem" onClick={() => openView(item)}>{Ico.eye}</button>}
                <button className="btn-edit-action" title="Sửa" onClick={() => openEdit(item)}>{Ico.edit}</button>
                <button className="btn-del-action" title="Xóa" onClick={() => del(item.MASP)}>{Ico.trash}</button>
            </div>
        </div>
    );
};
