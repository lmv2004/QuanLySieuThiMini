import React from 'react';
import { TableActions } from '../../components/TableActions';

export const InvoiceActions = ({ item, openEdit, del, list, setList, addToast, openView }) => {
    return (
        <TableActions 
            item={item}
            primaryKey="MAHD"
            openEdit={openEdit}
            del={del}
            openView={openView}
        />
    );
};
