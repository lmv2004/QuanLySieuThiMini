import React from 'react';
import { TableActions } from '../../components/TableActions';
import api from '../../services/api';

export const CustomerActions = ({ item, openEdit, del, list, setList, addToast, openView }) => {
    const handleToggleLock = async () => {
        try {
            const endpoint = `/customers/${item.MAKH}`;
            // In the backend, we should use a toggle-lock API or just update the object
            // Assuming we just send PUT with toggled IS_DELETED
            const updatedData = { ...item, IS_DELETED: item.IS_DELETED ? 0 : 1 };
            const res = await api.put(endpoint, updatedData);
            if (res.data) {
                setList(list.map(x => x.MAKH === item.MAKH ? { ...x, IS_DELETED: updatedData.IS_DELETED } : x));
                addToast('success', `Đã ${updatedData.IS_DELETED ? 'khóa' : 'mở khóa'} khách hàng ${item.TENKH} thành công!`);
            }
        } catch (err) {
            console.error(err);
            addToast('error', `Lỗi khi đổi trạng thái: ${err.response?.data?.message || err.message}`);
        }
    };

    return (
        <TableActions 
            item={item} 
            primaryKey="MAKH"
            openEdit={openEdit} 
            del={del}
            onLock={handleToggleLock}
            isLocked={item.IS_DELETED}
            openView={openView}
        />
    );
};
