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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', minWidth: '170px' }}>
            {openView && (
                <button
                    onClick={() => openView(item)}
                    title="Xem"
                    className="btn-action-ico"
                    style={{ color: '#10b981', backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' }}
                >
                    <FaEye size={15} />
                </button>
            )}

            {openEdit && (
                <button
                    onClick={() => openEdit(item)}
                    title="Sửa"
                    className="btn-action-ico"
                    style={{ color: '#f59e0b', backgroundColor: '#fffbeb', borderColor: '#fde68a' }}
                >
                    <FaEdit size={15} />
                </button>
            )}

            {onLock && (
                <button
                    onClick={() => onLock(item)}
                    title={isLocked ? "Mở khóa" : "Khóa"}
                    className="btn-action-ico"
                    style={{ color: '#0ea5e9', backgroundColor: '#f0f9ff', borderColor: '#bae6fd' }}
                >
                    {isLocked ? <FaUnlock size={15} /> : <FaLock size={15} />}
                </button>
            )}

            {del && (
                <button
                    onClick={() => del(item[primaryKey])}
                    title="Xóa"
                    className="btn-action-ico"
                    style={{ color: '#f43f5e', backgroundColor: '#fff1f2', borderColor: '#fecdd3' }}
                >
                    <FaTrash size={15} />
                </button>
            )}
        </div>
    );
};
