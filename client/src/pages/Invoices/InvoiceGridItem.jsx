import React from 'react';
import { Ico } from '../../components/Manage/Icons';
import { fmtDate, fmtVND, STATUS_MAP } from '../../components/Manage/Shared';

export const InvoiceGridItem = ({ item, openEdit, del, idx, list, setList, addToast, openView }) => {
    const s = STATUS_MAP[item.TRANGTHAI] || { label: item.TRANGTHAI, cls: 'badge' };
    
    const handleLock = () => {
        if (setList) {
            setList(prev => prev.map(x => x._id === item._id ? { ...x, TRANGTHAI: item.TRANGTHAI === 'CANCELLED' ? 'PENDING' : 'CANCELLED' } : x));
        }
        if (addToast) {
            addToast('success', `Đã đổi trạng thái hóa đơn thành công`);
        }
    };

    return (
        <div key={item._id} className="grid-item-card">
            <div className="grid-item-card-top">
                <div className="grid-item-icon-box" style={{ background: 'var(--bg-hover)', border: '1px solid var(--border)' }}>{Ico.receipt}</div>
                <span className={s.cls}>{s.label}</span>
            </div>
            <div className="grid-item-card-mid" style={{ flex: 1 }}>
                <div className="grid-item-title" style={{ fontFamily: 'var(--mono)', fontSize: 16 }}>{item.MAHD || `HD-${String(item._id).slice(-4)}`}</div>
                <div className="grid-item-label">{item.KHACHHANG || 'Khách lẻ'}</div>
                <div className="grid-item-label" style={{ marginTop: 4 }}>{fmtDate(item.NGAY)}</div>
            </div>
            <div className="grid-item-card-bottom">
                <div className="grid-item-value" style={{ fontSize: 18 }}>{fmtVND(item.TONGTIEN)}</div>
                <div className="grid-item-label">Thanh toán</div>
            </div>
            <div className="grid-item-actions">
                {openView && <button className="btn-view-action" title="Xem" onClick={() => openView(item)}>{Ico.eye}</button>}
                <button className="btn-lock-action" title="Khóa/Mở" onClick={handleLock}>{item.TRANGTHAI === 'CANCELLED' ? Ico.unlock : Ico.lock}</button>
                <button className="btn-edit-action" title="Sửa" onClick={() => openEdit(item)}>{Ico.edit}</button>
                <button className="btn-del-action" title="Xóa" onClick={() => del(item._id)}>{Ico.trash}</button>
            </div>
        </div>
    );
};
