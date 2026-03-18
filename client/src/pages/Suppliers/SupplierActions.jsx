import React from 'react';
import { TableActions } from '../../components/TableActions';

export const SupplierActions = ({ item, openEdit, del, list, setList, addToast, openView }) => {
    const handleLock = () => {
        if (setList) {
            setList(prev => prev.map(x => x.MANCC === item.MANCC ? { ...x, IS_DELETED: !x.IS_DELETED } : x));
        }
        if (addToast) {
            addToast('success', `${item.IS_DELETED ? 'Mở hợp tác' : 'Ngừng hợp tác'} nhà cung cấp thành công`);
        }
    };

    return (
        <TableActions 
            item={item}
            primaryKey="MANCC"
            openEdit={openEdit}
            del={del}
            openView={openView}
            onLock={handleLock}
            isLocked={item.IS_DELETED}
        />
    );
};
