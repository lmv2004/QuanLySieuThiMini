import React from 'react';
import { TableActions } from '../../components/TableActions';
import api from '../../services/api';

export const PositionActions = ({ item, openEdit, del, list, setList, addToast, openView }) => {
    const handleToggleLock = async () => {
        try {
            const endpoint = `/chuc-vus/${item.MACHUCVU}`; 
            const updatedData = { ...item, IS_DELETED: item.IS_DELETED ? 0 : 1 };
            const res = await api.put(endpoint, updatedData);
            if (res.data) {
                setList(list.map(x => x.MACHUCVU === item.MACHUCVU ? { ...x, IS_DELETED: updatedData.IS_DELETED } : x));
                addToast('success', `Đã ${updatedData.IS_DELETED ? 'khóa' : 'mở khóa'} chức vụ ${item.TENCHUCVU} thành công!`);
            }
        } catch (err) {
            console.error(err);
            addToast('error', `Lỗi khi đổi trạng thái: ${err.response?.data?.message || err.message}`);
        }
    };

    return (
        <TableActions 
            item={item} 
            primaryKey="MACHUCVU"
            openEdit={openEdit} 
            del={del}
            onLock={handleToggleLock}
            isLocked={item.IS_DELETED}
        />
    );
};
