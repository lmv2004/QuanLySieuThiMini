import React from 'react';
import { TableActions } from '../../components/TableActions';

export const PositionActions = ({ item, openEdit, del, openView }) => {
    return (
        <TableActions 
            item={item}
            primaryKey="MACHUCVU"
            openEdit={openEdit}
            del={del}
            openView={openView}
            onLock={() => {}} // Temporary placeholder for 4th icon
        />
    );
};
