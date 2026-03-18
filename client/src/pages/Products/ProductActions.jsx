import React from 'react';
import { TableActions } from '../../components/TableActions';

export const ProductActions = ({ item, openEdit, del, list, setList, addToast, openView }) => {
    const handleLock = () => {
        if (setList) {
            setList(prev => prev.map(x => x.MASP === item.MASP ? { ...x, IS_DELETED: !x.IS_DELETED } : x));
        }
        if (addToast) {
            addToast('success', `${item.IS_DELETED ? 'Mở bán' : 'Ngừng bán'} sản phẩm thành công`);
        }
    };

    return (
        <TableActions 
            item={item}
            primaryKey="MASP"
            openEdit={openEdit}
            del={del}
            openView={openView}
            onLock={handleLock}
            isLocked={item.IS_DELETED}
        />
    );
};
