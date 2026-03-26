import React, { useState } from 'react';
import { TableActions } from '../../components/TableActions';
import { voucherService } from '../../services/voucherService';
import { Modal } from '../../components/Manage/Modal';
import { Ico } from '../../components/Manage/Icons';

export const VoucherActions = ({ item, openEdit, del, list, setList, addToast, openView }) => {
    const [showLockConfirm, setShowLockConfirm] = useState(false);
    const isLocked = item.TRANGTHAI !== 1;

    const handleToggleLock = async () => {
        try {
            const updated = await voucherService.toggleLock(item);
            if (setList) {
                setList(p => p.map(x => x.SOVOUCHER === item.SOVOUCHER ? updated : x));
            }
            if (addToast) {
                addToast('success', `${updated.TRANGTHAI === 1 ? 'Mở khóa' : 'Khóa'} voucher thành công`);
            }
            setShowLockConfirm(false);
        } catch (err) {
            if (addToast) addToast('error', 'Lỗi khi thay đổi trạng thái');
        }
    };

    return (
        <>
            <TableActions 
                item={item}
                primaryKey="SOVOUCHER"
                openEdit={openEdit}
                del={del}
                openView={openView}
                onLock={() => setShowLockConfirm(true)}
                isLocked={isLocked}
            />

            {showLockConfirm && (
                <Modal
                    title={isLocked ? "Xác nhận mở khóa" : "Xác nhận khóa"}
                    onClose={() => setShowLockConfirm(false)}
                    actions={
                        <>
                            <button className="btn-secondary" onClick={() => setShowLockConfirm(false)}>Hủy bỏ</button>
                            <button className="btn-primary" 
                                style={{ background: isLocked ? '#0d6efd' : '#f59e0b', borderColor: isLocked ? '#0d6efd' : '#f59e0b' }} 
                                onClick={handleToggleLock}
                            >
                                {isLocked ? 'Mở khóa ngay' : 'Khóa voucher'}
                            </button>
                        </>
                    }
                >
                    <div style={{ padding: '20px 0', textAlign: 'center' }}>
                        <div style={{ color: isLocked ? '#0d6efd' : '#f59e0b', marginBottom: '16px' }}>
                            {isLocked ? Ico.unlock : Ico.lock}
                        </div>
                        <h3 style={{ fontSize: '18px', color: 'var(--text-main)', marginBottom: '8px' }}>
                            {isLocked ? 'Bạn muốn mở khóa voucher này?' : 'Bạn chắc chắn muốn khóa voucher?'}
                        </h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.5' }}>
                            {isLocked 
                                ? 'Voucher này sẽ quay lại trạng thái hoạt động và có thể được sử dụng bởi khách hàng.' 
                                : 'Voucher bị khóa sẽ không thể áp dụng để giảm giá cho các hóa đơn mới.'}
                        </p>
                    </div>
                </Modal>
            )}
        </>
    );
};
