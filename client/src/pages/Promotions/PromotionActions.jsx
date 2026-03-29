import React, { useState } from 'react';
import { TableActions } from '../../components/TableActions';
import { promotionService } from '../../services/promotionService';
import { Modal } from '../../components/Manage/Modal';
import { Ico } from '../../components/Manage/Icons';

export const PromotionActions = ({ item, openEdit, del, list, setList, addToast, openView }) => {
    const [showLockConfirm, setShowLockConfirm] = useState(false);
    const isLocked = !item.TRANGTHAI;
    
    // Toggle Status
    const handleToggleLock = async () => {
        try {
            const nextStatus = !item.TRANGTHAI;
            
            // Làm sạch dữ liệu trước khi gửi lên API
            const cleanItem = {
                TEN_CHUONG_TRINH: item.TEN_CHUONG_TRINH,
                LOAI_GIAM: parseInt(item.LOAI_GIAM),
                GIATRI_GIAM: parseFloat(item.GIATRI_GIAM),
                NGAYBD: item.NGAYBD,
                NGAYKT: item.NGAYKT,
                TRANGTHAI: nextStatus ? 1 : 0,
                MASP: parseInt(item.MASP || item.SANPHAM?.MASP)
            };
            
            const updated = await promotionService.update(parseInt(item.ID), cleanItem);
            
            setList(list.map(x => x.ID === item.ID ? { ...x, TRANGTHAI: nextStatus } : x));
            addToast('success', nextStatus ? 'Đã kích hoạt khuyến mãi' : 'Đã tạm dừng khuyến mãi');
            setShowLockConfirm(false);
        } catch (err) {
            console.error('Lỗi cập nhật trạng thái', err);
            addToast('error', 'Không thể thay đổi trạng thái lúc này');
        }
    };

    return (
        <>
            <TableActions 
                item={item} 
                primaryKey="ID"
                openEdit={openEdit} 
                del={del}
                onLock={() => setShowLockConfirm(true)}
                isLocked={isLocked}
                openView={openView}
            />

            {showLockConfirm && (
                <Modal
                    title={isLocked ? "Xác nhận kích hoạt" : "Xác nhận tạm dừng"}
                    onClose={() => setShowLockConfirm(false)}
                    actions={
                        <>
                            <button className="btn-secondary" onClick={() => setShowLockConfirm(false)}>Hủy bỏ</button>
                            <button className="btn-primary" 
                                style={{ background: isLocked ? '#0d6efd' : '#f59e0b', borderColor: isLocked ? '#0d6efd' : '#f59e0b' }} 
                                onClick={handleToggleLock}
                            >
                                {isLocked ? 'Kích hoạt ngay' : 'Tạm dừng ngay'}
                            </button>
                        </>
                    }
                >
                    <div style={{ padding: '20px 0', textAlign: 'center' }}>
                        <div style={{ color: isLocked ? '#0d6efd' : '#f59e0b', marginBottom: '16px' }}>
                            {isLocked ? Ico.check : Ico.lock}
                        </div>
                        <h3 style={{ fontSize: '18px', color: 'var(--text-main)', marginBottom: '8px' }}>
                            {isLocked ? 'Bạn muốn kích hoạt chương trình này?' : 'Bạn chắc chắn muốn tạm dừng?'}
                        </h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.5' }}>
                            {isLocked 
                                ? 'Khuyến mãi sẽ bắt đầu được áp dụng cho các sản phẩm liên quan.' 
                                : 'Chương trình sẽ ngừng áp dụng cho đến khi bạn kích hoạt lại.'}
                        </p>
                    </div>
                </Modal>
            )}
        </>
    );
};
