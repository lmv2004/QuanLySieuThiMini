import React from 'react';
import { Ico } from '../../components/Manage/Icons';
import { avatarColor } from '../../components/Manage/Shared';
import { TableActions } from '../../components/Manage/TableActions';
export const EmployeeGridItem = ({ item, openEdit, del, idx, list, setList, addToast, openView }) => {
    const handleLock = () => {
        if (setList) {
            setList(prev => prev.map(x => x.MANV === item.MANV ? { ...x, IS_DELETED: !x.IS_DELETED } : x));
        }
        if (addToast) {
            addToast('success', `${item.IS_DELETED ? 'Mở khóa' : 'Khóa'} nhân viên thành công`);
        }
    };

    return (
        <div key={item.MANV} className="grid-item-card">
            <div className="grid-item-card-top">
                <div className="grid-item-icon-box" style={{ background: avatarColor(idx), color: '#fff', fontSize: 18, fontWeight: 800 }}>
                    {(item.TENNV[0] || '?').toUpperCase()}
                </div>
                <span className="badge badge-info">{item.chucVu?.TENCHUCVU || 'Nhân viên'}</span>
            </div>
            <div className="grid-item-card-mid" style={{ flex: 1 }}>
                <div className="grid-item-title" style={{ fontFamily: 'var(--font)', fontSize: 15 }}>{item.TENNV}</div>
                <div className="grid-item-label">{item.MANV}</div>
            </div>
            <div className="grid-item-card-bottom">
                <div className="grid-item-value" style={{ fontSize: 13, fontFamily: 'var(--mono)' }}>{item.SODIENTHOAI}</div>
                <div className="grid-item-label">Liên hệ</div>
            </div>
            <div className="grid-item-actions">
                <TableActions 
                    item={item}
                    primaryKey="MANV"
                    openView={openView}
                    onLock={handleLock}
                    openEdit={openEdit}
                    del={del}
                    isLocked={item.IS_DELETED}
                />
            </div>
        </div>
    );
};
