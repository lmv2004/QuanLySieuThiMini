import React from 'react';
import { Ico } from '../../components/Manage/Icons';

export const DisposalActions = ({ item, openEdit, del, openView, onLock, primaryKey = 'MAPHIEU' }) => {
    return (
        <div className="actions-cell">
            {/* Nút Xem */}
            <button
                className="btn-action-ico btn-view-action"
                title="Xem chi tiết"
                onClick={() => openView && openView(item)}
            >
                {Ico.eye}
            </button>

            {/* Nút Khóa */}
            <button
                className="btn-action-ico btn-lock-action"
                title="Khóa phiếu"
                onClick={() => onLock && onLock(item)}
            >
                {item.TRANGTHAI === 'Locked' ? Ico.unlock : Ico.lock}
            </button>

            {/* Nút Sửa */}
            <button
                className="btn-action-ico btn-edit-action"
                title="Chỉnh sửa"
                onClick={() => openEdit(item)}
            >
                {Ico.edit}
            </button>

            {/* Nút Xóa */}
            <button
                className="btn-action-ico btn-del-action"
                title="Xóa phiếu"
                onClick={() => del && del(item[primaryKey])}
            >
                {Ico.trash}
            </button>
        </div>
    );
};