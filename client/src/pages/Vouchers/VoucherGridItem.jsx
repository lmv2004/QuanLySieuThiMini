import React from 'react';
import { Ico } from '../../components/Manage/Icons';
import { fmtDate, fmtVND } from '../../components/Manage/Shared';
import { voucherService } from '../../services/voucherService';

export const VoucherGridItem = ({ item, openEdit, del, list, setList, addToast, openView }) => {
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
        <div key={item.SOVOUCHER} className={`grid-item-card voucher-card ${item.TRANGTHAI === 0 ? 'locked' : ''}`}>
            <div className="grid-item-card-top voucher-card-top">
                <div className="grid-item-icon-box voucher-icon-box">{Ico.ticket}</div>
                <span className={item.TRANGTHAI === 0 ? 'badge badge-inactive' : (item.IS_AVAILABLE ? 'badge badge-active' : 'badge badge-warning')}>
                    {item.TRANGTHAI === 0 ? 'Bị khóa' : (item.IS_AVAILABLE ? 'Hoạt động' : 'Hết hạn')}
                </span>
            </div>
            <div className="grid-item-card-mid voucher-card-mid" style={{ flex: 1 }}>
                <div className="voucher-code">{item.MAVOUCHER}</div>
                <div className="voucher-label">{item.PTGIAM > 0 ? 'Giảm giá phần trăm' : 'Giảm trực tiếp'}</div>
            </div>
            <div className="ticket-divider" />
            <div className="grid-item-card-bottom voucher-card-bottom">
                <div className="voucher-value">{item.PTGIAM > 0 ? `${item.PTGIAM}%` : fmtVND(item.KMTOIDA)}</div>
                <div className="voucher-label">HSD: {fmtDate(item.NGAYKT)}</div>
            </div>
            <div className="grid-item-actions voucher-actions">
                <button title="Xem chi tiết" onClick={() => openView(item)}>{Ico.eye}</button>
                <button title={item.TRANGTHAI === 1 ? "Khóa" : "Mở khóa"} onClick={handleToggleLock}>
                    {item.TRANGTHAI === 1 ? Ico.lock : Ico.unlock}
                </button>
                <button className="btn-edit" onClick={() => openEdit(item)}>{Ico.edit}</button>
                <button className="btn-del" onClick={() => del(item.SOVOUCHER)}>{Ico.trash}</button>
            </div>
        </div>
    );
};
