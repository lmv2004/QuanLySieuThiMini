import React from 'react';
import { TableActions } from '../../components/TableActions';

export const CategoryActions = ({ item, openEdit, del, list, setList, addToast, openView }) => {
    return (
        <TableActions 
            item={item} 
            primaryKey="MALOAI"
            openEdit={openEdit} 
            del={del}
            openView={openView}
        />
    );
};
