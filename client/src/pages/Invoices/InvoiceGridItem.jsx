import React from 'react';
import { Ico } from '../../components/Manage/Icons';
import { fmtDate, fmtVND } from '../../components/Manage/Shared';

const INVOICE_STATUS = {
    0: { label: 'Chờ thanh toán', cls: 'badge badge-pending' },
    1: { label: 'Đã thanh toán', cls: 'badge badge-approved' },
};

export const InvoiceGridItem = ({ item, openEdit, del, idx, list, setList, addToast, openView }) => {
    const s = INVOICE_STATUS[Number(item.TRANGTHAI)] || { label: String(item.TRANGTHAI ?? '—'), cls: 'badge' };
    const canEdit = Number(item?.TRANGTHAI) === 0;

    return (
        <div key={item.MAHD} className="grid-item-card">
            <div className="grid-item-card-top">
                <div className="grid-item-icon-box" style={{ background: 'var(--bg-hover)', border: '1px solid var(--border)' }}>{Ico.receipt}</div>
                <span className={s.cls}>{s.label}</span>
            </div>
            <div className="grid-item-card-mid" style={{ flex: 1 }}>
                <div className="grid-item-title" style={{ fontFamily: 'var(--mono)', fontSize: 16 }}>{item.MAHD || '—'}</div>
                <div className="grid-item-label">{item.khachHang?.TENKH || 'Khách lẻ'}</div>
                <div className="grid-item-label" style={{ marginTop: 4 }}>{fmtDate(item.NGAYHD)}</div>
            </div>
            <div className="grid-item-card-bottom">
                <div className="grid-item-value" style={{ fontSize: 18 }}>{item.TONG_THANHTOAN !== undefined ? fmtVND(item.TONG_THANHTOAN) : '—'}</div>
                <div className="grid-item-label">Thanh toán</div>
            </div>
            <div className="grid-item-actions">
                {openView && <button className="btn-view-action" title="Xem" onClick={() => openView(item)}>{Ico.eye}</button>}
                {canEdit && openEdit && <button className="btn-edit-action" title="Sửa" onClick={() => openEdit(item)}>{Ico.edit}</button>}
            </div>
        </div>
    );
};
