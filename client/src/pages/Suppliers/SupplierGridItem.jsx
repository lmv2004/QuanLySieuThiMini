import React from 'react';
import { Ico } from '../../components/Manage/Icons';
import { avatarColor } from '../../components/Manage/Shared';

export const SupplierGridItem = ({ item, openEdit, del, idx, list, setList, addToast, openView }) => {
    const handleLock = () => {
        if (setList) {
            setList(prev => prev.map(x => x.MANCC === item.MANCC ? { ...x, IS_DELETED: !x.IS_DELETED } : x));
        }
        if (addToast) {
            addToast('success', `${item.IS_DELETED ? 'Mở hợp tác' : 'Ngừng hợp tác'} nhà cung cấp thành công`);
        }
    };

    return (
        <div key={item.MANCC} className="grid-item-card">
            <div className="grid-item-card-top">
                <div className="grid-item-icon-box" style={{ background: avatarColor(idx), color: '#fff', fontSize: 16, fontWeight: 800 }}>{(item.TENNCC[0] || '?').toUpperCase()}</div>
                <span className={item.IS_DELETED ? 'badge badge-inactive' : 'badge badge-active'}>
                    {item.IS_DELETED ? 'Ngừng' : 'Hoạt động'}
                </span>
            </div>
            <div className="grid-item-card-mid" style={{ flex: 1 }}>
                <div className="grid-item-title" style={{ fontFamily: 'var(--font)', fontSize: 15 }}>{item.TENNCC}</div>
                <div className="grid-item-label">{item.EMAIL || 'N/A'}</div>
            </div>
            <div className="grid-item-card-bottom">
                <div className="grid-item-value" style={{ fontSize: 13, fontFamily: 'var(--mono)' }}>{item.SDT}</div>
                <div className="grid-item-label">{item.DIACHI?.split(',')[0]}</div>
            </div>
            <div className="grid-item-actions">
                {openView && <button className="btn-view-action" title="Xem" onClick={() => openView(item)}>{Ico.eye}</button>}
                <button className="btn-lock-action" title="Khóa/Mở" onClick={handleLock}>{item.IS_DELETED ? Ico.unlock : Ico.lock}</button>
                <button className="btn-edit-action" title="Sửa" onClick={() => openEdit(item)}>{Ico.edit}</button>
                <button className="btn-del-action" title="Xóa" onClick={() => del(item.MANCC)}>{Ico.trash}</button>
            </div>
        </div>
    );
};
