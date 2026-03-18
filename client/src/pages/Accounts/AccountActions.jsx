import React from 'react';
import { TableActions } from '../../components/TableActions';
import { accountService } from '../../services/accountService';

export const AccountActions = ({ item, openEdit, del, list, setList, addToast, openView }) => {
    
    // Toggle User Lock Status
    const toggleLock = async () => {
        try {
            await accountService.update(item.SOTK, { KHOA_TK: !item.KHOA_TK });
            setList(list.map(x => x.SOTK === item.SOTK ? { ...x, KHOA_TK: !x.KHOA_TK } : x));
            addToast('success', !item.KHOA_TK ? 'Đã khóa tài khoản' : 'Đã mở khóa tài khoản');
        } catch (err) {
            console.error('Lỗi khóa tài khoản', err);
            addToast('error', 'Chỉ tài khoản Quản Trị Hệ Thống / Chủ Siêu Thị mới có quyền này');
        }
    };

    return (
        <TableActions 
            item={item} 
            primaryKey="SOTK"
            openEdit={openEdit} 
            del={del}
            onLock={toggleLock}
            isLocked={item.KHOA_TK}
            openView={openView}
        />
    );
};
