import React from 'react';
import { TableActions } from '../../components/TableActions';
import { voucherService } from '../../services/voucherService';

export const VoucherActions = ({ item, openEdit, del, list, setList, addToast, openView }) => {
    const handleToggleLock = async () => {
        try {
            const updated = await voucherService.toggleLock(item);
            if (setList) {
                setList(p => p.map(x => x.SOVOUCHER === item.SOVOUCHER ? updated : x));
            }
            if (addToast) {
                addToast('success', `${updated.TRANGTHAI === 1 ? 'Mở khóa' : 'Khóa'} voucher thành công`);
            }
        } catch (err) {
            if (addToast) addToast('error', 'Lỗi khi thay đổi trạng thái');
        }
    };

    return (
        <TableActions 
            item={item}
            primaryKey="SOVOUCHER"
            openEdit={openEdit}
            del={del}
            openView={openView}
            onLock={handleToggleLock}
            isLocked={item.TRANGTHAI !== 1}
        />
    );
};
