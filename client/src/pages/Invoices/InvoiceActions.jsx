import React from 'react';
import { TableActions } from '../../components/TableActions';

export const InvoiceActions = ({ item, openEdit, del, list, setList, addToast, openView }) => {
    const handleLock = () => {
        if (setList) {
            setList(prev => prev.map(x => x._id === item._id ? { ...x, TRANGTHAI: item.TRANGTHAI === 'CANCELLED' ? 'PENDING' : 'CANCELLED' } : x));
        }
        if (addToast) {
            addToast('success', `Đã đổi trạng thái hóa đơn thành công`);
        }
    };

    return (
        <TableActions 
            item={item}
            primaryKey="_id"
            openEdit={openEdit}
            del={del}
            openView={openView}
            onLock={handleLock}
            isLocked={item.TRANGTHAI === 'CANCELLED'}
        />
    );
};
