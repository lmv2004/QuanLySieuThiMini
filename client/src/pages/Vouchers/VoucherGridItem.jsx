import React, { useState } from 'react';
import { Ico } from '../../components/Manage/Icons';
import { fmtDate, fmtVND } from '../../components/Manage/Shared';
import { voucherService } from '../../services/voucherService';
import { Modal } from '../../components/Manage/Modal';

export const VoucherGridItem = ({ item, openEdit, del, list, setList, addToast, openView }) => {
    const [showLockConfirm, setShowLockConfirm] = useState(false);
    const isLocked = item.TRANGTHAI === 0;

    const handleToggleLock = async () => {
        try {
            const updated = await voucherService.toggleLock(item);
            setList(p => p.map(x => x.SOVOUCHER === item.SOVOUCHER ? updated : x));
            addToast('success', `${updated.TRANGTHAI === 1 ? 'Mở khóa' : 'Khóa'} voucher thành công`);
            setShowLockConfirm(false);
        } catch (err) {
            addToast('error', 'Lỗi khi thay đổi trạng thái');
        }
    };

    const now = new Date();
    const isFuture = new Date(item.NGAYBD) > now;
    const status = item.TRANGTHAI === 0 ? { t: 'Bị khóa', c: 'badge-inactive' }
                 : (isFuture ? { t: 'Chưa phát hành', c: 'badge-info' }
                 : (item.IS_AVAILABLE ? { t: 'Hoạt động', c: 'badge-active' } : { t: 'Hết hạn', c: 'badge-warning' }));

    return (
        <div key={item.SOVOUCHER} className={`grid-item-card voucher-card ${item.TRANGTHAI === 0 ? 'locked' : ''}`}>
            <div className="grid-item-card-top voucher-card-top">
                <div className="grid-item-icon-box voucher-icon-box">{Ico.ticket}</div>
                <span className={`badge ${status.c}`}>
                    {status.t}
                </span>
            </div>
            <div className="grid-item-card-mid voucher-card-mid" style={{ flex: 1 }}>
                <div className="voucher-code">{item.MAVOUCHER}</div>
                <div className="voucher-label">{Number(item.PTGIAM || 0) > 0 ? 'Giảm giá phần trăm' : 'Giảm trực tiếp'}</div>
            </div>
            <div className="ticket-divider" />
            <div className="grid-item-card-bottom voucher-card-bottom">
                <div className="voucher-value">{Number(item.PTGIAM || 0) > 0 ? `${item.PTGIAM}%` : fmtVND(item.KMTOIDA)}</div>
                <div className="voucher-label">HSD: {fmtDate(item.NGAYKT)}</div>
            </div>
            <div className="grid-item-actions voucher-actions actions-cell">
                <button className="btn-action-ico view" title="Xem chi tiết" onClick={() => openView(item)}>{Ico.eye}</button>
                <button className="btn-action-ico lock" title={item.TRANGTHAI === 1 ? "Khóa" : "Mở khóa"} onClick={() => setShowLockConfirm(true)}>
                    {item.TRANGTHAI === 1 ? Ico.lock : Ico.unlock}
                </button>
                <button className="btn-action-ico edit" onClick={() => openEdit(item)} title="Chỉnh sửa">{Ico.edit}</button>
                <button className="btn-action-ico delete" onClick={() => del(item.SOVOUCHER)} title="Xóa">{Ico.trash}</button>
            </div>

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
        </div>
    );
};
