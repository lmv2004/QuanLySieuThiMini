import React from 'react';
import { TableActions } from '../../components/TableActions';

export const EmployeeActions = ({ item, openEdit, del, list, setList, addToast, openView }) => {
    const handleLock = () => {
        if (setList) {
            setList(prev => prev.map(x => x.MANV === item.MANV ? { ...x, IS_DELETED: !x.IS_DELETED } : x));
        }
        if (addToast) {
            addToast('success', `${item.IS_DELETED ? 'Mở khóa' : 'Khóa'} nhân viên thành công`);
        }
    };

    return (
        <TableActions 
            item={item}
            primaryKey="MANV"
            openEdit={openEdit}
            del={del}
            openView={openView}
            onLock={handleLock}
            isLocked={item.IS_DELETED}
        />
    );
};
