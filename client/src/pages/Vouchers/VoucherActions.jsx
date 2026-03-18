import React from 'react';
import { Ico } from '../../components/Manage/Icons';
import { voucherService } from '../../services/voucherService';

export const VoucherActions = ({ item, openEdit, del, list, setList, addToast, openView }) => {
    const handleToggleLock = async () => {
        try {
            const updated = await voucherService.toggleLock(item);
            setList(p => p.map(x => x.SOVOUCHER === item.SOVOUCHER ? updated : x));
            addToast('success', `${updated.TRANGTHAI === 1 ? 'Mở khóa' : 'Khóa'} voucher thành công`);
        } catch (err) {
            addToast('error', 'Lỗi khi thay đổi trạng thái');
        }
    };

    return (
        <div className="actions-cell">
            <button className="btn-action-ico" title="Xem chi tiết" onClick={() => openView(item)}>{Ico.eye}</button>
            <button className="btn-action-ico" title={item.TRANGTHAI === 1 ? "Khóa" : "Mở khóa"} onClick={handleToggleLock}>
                {item.TRANGTHAI === 1 ? Ico.lock : Ico.unlock}
            </button>
            <button className="btn-action-ico btn-edit" title="Sửa" onClick={() => openEdit(item)}>{Ico.edit}</button>
            <button className="btn-action-ico btn-del" title="Xóa" onClick={() => del(item.SOVOUCHER)}>{Ico.trash}</button>
        </div>
    );
};
