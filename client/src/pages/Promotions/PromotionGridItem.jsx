import React, { useState } from 'react';
import { Ico } from '../../components/Manage/Icons';
import { fmtDate, fmtVND } from '../../components/Manage/Shared';
import { promotionService } from '../../services/promotionService';
import { Modal } from '../../components/Manage/Modal';

export const PromotionGridItem = ({ item, openEdit, del, list, setList, addToast, openView }) => {
    const [showLockConfirm, setShowLockConfirm] = useState(false);
    const isLocked = !item.TRANGTHAI;

    const handleToggleLock = async () => {
        try {
            const nextStatus = !item.TRANGTHAI;
            const itemsToUpdate = item._items || [item];

            for (const it of itemsToUpdate) {
                const cleanItem = {
                    TEN_CHUONG_TRINH: it.TEN_CHUONG_TRINH,
                    LOAI_GIAM: parseInt(it.LOAI_GIAM),
                    GIATRI_GIAM: parseFloat(it.GIATRI_GIAM),
                    NGAYBD: it.NGAYBD,
                    NGAYKT: it.NGAYKT,
                    TRANGTHAI: nextStatus ? 1 : 0,
                    MASP: parseInt(it.MASP || it.SANPHAM?.MASP)
                };
                await promotionService.update(parseInt(it.ID), cleanItem);
            }

            setList(p => p.map(x => {
                const isMatch = x.ID === item.ID || (item._items && item._items.some(si => si.ID === x.ID));
                return isMatch ? { ...x, TRANGTHAI: nextStatus } : x;
            }));

            addToast('success', nextStatus ? 'Đã kích hoạt nhóm khuyến mãi' : 'Đã tạm dừng nhóm khuyến mãi');
            setShowLockConfirm(false);
        } catch (err) {
            addToast('error', 'Lỗi khi thay đổi trạng thái nhóm');
        }
    };

    const now = new Date();
    const parseDate = (d) => {
        const date = new Date(d);
        return isNaN(date.getTime()) ? null : date;
    };
    const start = parseDate(item.NGAYBD);
    const end = parseDate(item.NGAYKT);
    const isFuture = start && start > now;
    const isExpired = end && end < now;

    const status = !item.TRANGTHAI ? { t: 'Tạm dừng', c: 'badge-inactive' }
        : (isExpired ? { t: 'Hết hạn', c: 'badge-warning' }
            : (isFuture ? { t: 'Sắp diễn ra', c: 'badge-info' } : { t: 'Đang chạy', c: 'badge-active' }));

    const count = item._items?.length || 1;

    return (
        <div key={item.ID} className={`grid-item-card promo-card ${!item.TRANGTHAI ? 'locked' : ''}`}>
            <div className="grid-item-card-top">
                <div className="grid-item-icon-box" style={{ background: 'var(--blue-bg)', color: 'var(--blue)' }}>
                    {Ico.percent}
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {count > 1 && <span className="badge badge-info">{count} SP</span>}
                    <span className={`badge ${status.c}`}>
                        {status.t}
                    </span>
                </div>
            </div>

            <div className="grid-item-card-mid" style={{ flex: 1 }}>
                <div className="grid-item-title">{item.TEN_CHUONG_TRINH}</div>
                <div className="grid-item-label">
                    {count} sản phẩm
                </div>
            </div>

            <div className="grid-item-card-bottom">
                <div className="grid-item-value">
                    {item.LOAI_GIAM === 0 ? `${item.GIATRI_GIAM}%` : fmtVND(item.GIATRI_GIAM)}
                </div>
                <div className="grid-item-label">
                    HSD: {fmtDate(item.NGAYKT)}
                </div>
            </div>

            <div className="grid-item-actions voucher-actions actions-cell">
                <button className="btn-action-ico view" title="Xem chi tiết" onClick={() => openView(item)}>
                    {Ico.eye}
                </button>
                <button className="btn-action-ico lock" title={!isLocked ? "Tạm dừng" : "Kích hoạt"} onClick={() => setShowLockConfirm(true)}>
                    {!isLocked ? Ico.lock : Ico.unlock}
                </button>
                <button className="btn-action-ico edit" title="Sửa" onClick={() => openEdit(item)}>
                    {Ico.edit}
                </button>
                <button className="btn-action-ico delete" title="Xóa" onClick={() => del(item.ID)}>
                    {Ico.trash}
                </button>
            </div>

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
        </div>
    );
};
