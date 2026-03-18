import React from 'react';
import { Ico } from '../../components/Manage/Icons';
import { avatarColor } from '../../components/Manage/Shared';
import { accountService } from '../../services/accountService';

export const AccountGridItem = ({ item, openEdit, del, idx, list, setList, addToast }) => {
    
    const toggleLock = async () => {
        try {
            await accountService.update(item.SOTK, { KHOA_TK: !item.KHOA_TK });
            setList(prev => prev.map(x => x.SOTK === item.SOTK ? { ...x, KHOA_TK: !x.KHOA_TK } : x));
            addToast('success', item.KHOA_TK ? 'Đã mở khóa tài khoản' : 'Đã khóa tài khoản');
        } catch (err) {
            console.error('Lỗi', err);
            addToast('error', 'Bạn không có quyền thực hiện hành động này');
        }
    };

    return (
        <div className={`grid-item-card account-card ${item.KHOA_TK ? 'account-locked' : ''}`}>
            <div className="grid-item-card-top">
                <div className="grid-item-icon-box" style={{ background: avatarColor(idx), color: '#fff' }}>
                    {Ico.user}
                </div>
                <span className={item.KHOA_TK ? 'badge badge-inactive' : 'badge badge-active'}>
                    {item.KHOA_TK ? 'Đã khóa' : 'Hoạt động'}
                </span>
            </div>
            
            <div className="grid-item-card-mid" style={{ flex: 1 }}>
                <div className="grid-item-title" style={{ fontFamily: 'var(--font)', fontSize: 15 }}>
                    {item.TENTK}
                </div>
                <div className="grid-item-label account-email">
                    {item.EMAIL || 'Chưa cập nhật email'}
                </div>
            </div>
            
            <div className="grid-item-card-bottom">
                <div className="grid-item-label">NV: {item.NHANVIEN?.TENNV || '—'}</div>
                <div className="grid-item-label" style={{ color: item.MATKHAU ? 'var(--green)' : 'var(--accent2)' }}>
                    {item.MATKHAU ? 'Đã thiết lập' : 'Cần cài mật khẩu'}
                </div>
            </div>
            
            <div className="grid-item-actions">
                <button 
                    className={`btn-edit btn-account-toggle ${item.KHOA_TK ? 'is-locked' : ''}`} 
                    title="Khóa/Mở Khóa"
                    onClick={toggleLock}
                >
                    {item.KHOA_TK ? Ico.power : Ico.ban}
                </button>
                <button className="btn-edit" title="Sửa" onClick={() => openEdit(item)}>
                    {Ico.edit}
                </button>
                <button className="btn-del" title="Xóa" onClick={() => del(item.SOTK)}>
                    {Ico.trash}
                </button>
            </div>
        </div>
    );
};
