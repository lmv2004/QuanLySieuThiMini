import React from 'react';
import { TableActions } from '../../components/TableActions';
import { promotionService } from '../../services/promotionService';

export const PromotionActions = ({ item, openEdit, del, list, setList, addToast, openView }) => {
    
    // Toggle Status
    const toggleStatus = async () => {
        try {
            await promotionService.update(item.ID, { ...item, TRANGTHAI: !item.TRANGTHAI });
            setList(list.map(x => x.ID === item.ID ? { ...x, TRANGTHAI: !x.TRANGTHAI } : x));
            addToast('success', !item.TRANGTHAI ? 'Đã kích hoạt khuyến mãi' : 'Đã tạm dừng khuyến mãi');
        } catch (err) {
            console.error('Lỗi cập nhật trạng thái', err);
            addToast('error', 'Không thể thay đổi trạng thái lúc này');
        }
    };

    return (
        <TableActions 
            item={item} 
            primaryKey="ID"
            openEdit={openEdit} 
            del={del}
            onLock={toggleStatus}
            isLocked={!item.TRANGTHAI}
            openView={openView}
        />
    );
};
