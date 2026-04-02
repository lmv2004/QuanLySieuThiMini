import React from 'react';
import { Ico } from '../../components/Manage/Icons';
import api from '../../services/api';

/**
 * Render action buttons theo TRANGTHAI:
 * - PENDING  → Xem | Sửa | Duyệt | Hủy phiếu
 * - APPROVED → Xem (chỉ xem)
 * - CANCELLED→ Xem (chỉ xem)
 */
export const ImportActions = ({ item, openEdit, del, list, setList, addToast, openView }) => {
    const isPending = item.TRANGTHAI === 'PENDING' || !item.TRANGTHAI;

    const handleApprove = async () => {
        if (!window.confirm(`Duyệt phiếu IMP-${String(item.MAPHIEU).padStart(3, '0')}? Hàng sẽ được nhập vào kho.`)) return;
        try {
            const res = await api.patch(`/purchase-orders/${item.MAPHIEU}/approve`);
            const updated = res?.data ?? res;
            setList(list.map(x => x.MAPHIEU === item.MAPHIEU ? { ...x, ...updated, TRANGTHAI: 'APPROVED' } : x));
            addToast('success', `Đã duyệt phiếu IMP-${String(item.MAPHIEU).padStart(3, '0')} thành công!`);
        } catch (err) {
            addToast('error', err?.message || 'Lỗi khi duyệt phiếu nhập');
        }
    };

    const handleCancel = async () => {
        if (!window.confirm(`Hủy phiếu IMP-${String(item.MAPHIEU).padStart(3, '0')}?`)) return;
        try {
            const res = await api.patch(`/purchase-orders/${item.MAPHIEU}/cancel`);
            const updated = res?.data ?? res;
            setList(list.map(x => x.MAPHIEU === item.MAPHIEU ? { ...x, ...updated, TRANGTHAI: 'CANCELLED' } : x));
            addToast('success', `Đã hủy phiếu IMP-${String(item.MAPHIEU).padStart(3, '0')}.`);
        } catch (err) {
            addToast('error', err?.message || 'Lỗi khi hủy phiếu nhập');
        }
    };

    return (
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', justifyContent: 'center' }}>
            {/* Xem — luôn hiển thị */}
            <button
                className="btn-action-ico"
                title="Xem chi tiết"
                onClick={() => openView(item)}
            >
                {Ico.eye}
            </button>

            {/* Sửa — chỉ PENDING */}
            {isPending && (
                <button
                    className="btn-action-ico btn-edit"
                    title="Chỉnh sửa"
                    onClick={() => openEdit(item)}
                >
                    {Ico.edit}
                </button>
            )}

            {/* Duyệt — chỉ PENDING */}
            {isPending && (
                <button
                    className="btn-action-ico"
                    title="Duyệt phiếu"
                    onClick={handleApprove}
                    style={{ background: 'rgba(16,185,129,.15)', color: '#10b981', border: '1px solid rgba(16,185,129,.3)' }}
                >
                    {Ico.check ?? '✓'}
                </button>
            )}

            {/* Hủy phiếu — chỉ PENDING */}
            {isPending && (
                <button
                    className="btn-action-ico btn-del"
                    title="Hủy phiếu"
                    onClick={handleCancel}
                >
                    {Ico.ban}
                </button>
            )}
        </div>
    );
};
