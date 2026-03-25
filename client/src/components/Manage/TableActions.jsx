import React from 'react';
import { FaEye, FaEdit, FaLock, FaUnlock, FaTrash } from 'react-icons/fa';

export const TableActions = ({
    item,
    primaryKey = 'id',
    openView,
    onLock,
    openEdit,
    del,
    isLocked = false
}) => {
    return (
        <div className="actions-cell" style={{ minWidth: '170px', justifyContent: 'center' }}>
            {openView && (
                <button
                    onClick={() => openView(item)}
                    title="Xem"
                    className="btn-action-ico view"
                >
                    <FaEye size={15} />
                </button>
            )}

            {openEdit && (
                <button
                    onClick={() => openEdit(item)}
                    title="Sửa"
                    className="btn-action-ico edit"
                >
                    <FaEdit size={15} />
                </button>
            )}

            {onLock && (
                <button
                    onClick={() => onLock(item)}
                    title={isLocked ? "Mở khóa" : "Khóa"}
                    className="btn-action-ico lock"
                >
                    {isLocked ? <FaUnlock size={15} /> : <FaLock size={15} />}
                </button>
            )}

            {del && (
                <button
                    onClick={() => del(item[primaryKey])}
                    title="Xóa"
                    className="btn-action-ico delete"
                >
                    <FaTrash size={15} />
                </button>
            )}
        </div>
    );
};
