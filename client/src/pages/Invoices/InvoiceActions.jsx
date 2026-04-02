import React from 'react';
import { TableActions } from '../../components/TableActions';

export const InvoiceActions = ({ item, openEdit, del, list, setList, addToast, openView }) => {
    const canEdit = Number(item?.TRANGTHAI) === 0;

    return (
        <TableActions 
            item={item}
            primaryKey="MAHD"
            openEdit={canEdit ? openEdit : undefined}
            openView={openView}
        />
    );
};
