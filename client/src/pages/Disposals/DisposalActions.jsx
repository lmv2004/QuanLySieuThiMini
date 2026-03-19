import React from 'react';
import { TableActions } from '../../components/TableActions';

export const DisposalActions = ({ item, openEdit, del, openView, onLock, primaryKey = 'MAPHIEU' }) => {
    return (
        <TableActions 
            item={item}
            primaryKey={primaryKey}
            openEdit={openEdit}
            del={del}
            openView={openView}
            onLock={onLock}
            isLocked={item.TRANGTHAI === 'Locked'}
        />
    );
};