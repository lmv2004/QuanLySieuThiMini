import React from 'react';
import { TableActions } from '../../components/TableActions';
import api from '../../services/api';

export const ImportActions = ({ item, openEdit, del, list, setList, addToast, openView }) => {
    const handleToggleLock = async () => {
        try {
            const endpoint = `/purchase-orders/${item.MAPHIEU}`;
            const updatedData = { ...item, IS_DELETED: item.IS_DELETED ? 0 : 1 };
            const res = await api.put(endpoint, updatedData);
            if (res.data) {
                setList(list.map(x => x.MAPHIEU === item.MAPHIEU ? { ...x, IS_DELETED: updatedData.IS_DELETED } : x));
                addToast('success', `Đã ${updatedData.IS_DELETED ? 'hủy' : 'khôi phục'} phiếu nhập ${item.MAPHIEU} thành công!`);
            }
        } catch (err) {
            console.error(err);
            addToast('error', `Lỗi khi đổi trạng thái: ${err.response?.data?.message || err.message}`);
        }
    };

    return (
        <TableActions 
            item={item} 
            primaryKey="MAPHIEU"
            openEdit={openEdit} 
            del={del}
            onLock={handleToggleLock}
            isLocked={item.IS_DELETED}
            openView={openView}
        />
    );
};
