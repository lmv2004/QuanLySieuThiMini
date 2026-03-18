import React from 'react';
import { Ico } from '../../components/Manage/Icons';

export const PositionActions = ({ item, openEdit, del, openView }) => {
    return (
        <div className="actions-cell">
            <button className="btn-action-ico" title="Xem" onClick={() => openView(item)}>{Ico.eye}</button>
            <button className="btn-action-ico btn-edit" title="Sửa" onClick={() => openEdit(item)}>{Ico.edit}</button>
            <button className="btn-action-ico btn-del" title="Xóa" onClick={() => del(item.MACHUCVU)}>{Ico.trash}</button>
        </div>
    );
};
