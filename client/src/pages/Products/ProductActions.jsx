import React from 'react';
import { TableActions } from '../../components/TableActions';

export const ProductActions = ({ item, openEdit, del, openView }) => {
    return (
        <TableActions 
            item={item}
            primaryKey="MASP"
            openEdit={openEdit}
            del={del}
            openView={openView}
        />
    );
};
