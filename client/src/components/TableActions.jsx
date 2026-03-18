import React from 'react';
import { Ico } from './Manage/Icons'; // Đảm bảo đường dẫn đúng tới file Icons của bạn

export const TableActions = ({
    item,
    primaryKey = 'id',
    openView,
    onLock,
    openEdit,
    del,
    isLocked = false // Truyền trạng thái khóa từ bên ngoài vào
}) => {
    return (
        <div className="actions-cell flex items-center justify-end gap-2 pr-2">
            {/* 1. NÚT XEM */}
            {openView && (
                <button className="btn-action-ico btn-view-action" title="Xem" onClick={() => openView(item)}>
                    {Ico.eye}
                </button>
            )}

            {/* 2. NÚT KHÓA (Chỉ hiện nếu trang đó có tính năng khóa) */}
            {onLock && (
                <button className="btn-action-ico btn-lock-action" title="Khóa/Mở" onClick={() => onLock(item)}>
                    {isLocked ? Ico.unlock : Ico.lock}
                </button>
            )}

            {/* 3. NÚT SỬA */}
            {openEdit && (
                <button className="btn-action-ico btn-edit-action" title="Sửa" onClick={() => openEdit(item)}>
                    {Ico.edit}
                </button>
            )}

            {/* 4. NÚT XÓA */}
            {del && (
                <button className="btn-action-ico btn-del-action" title="Xóa" onClick={() => del(item[primaryKey])}>
                    {Ico.trash}
                </button>
            )}
        </div>
    );
};