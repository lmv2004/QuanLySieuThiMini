import React from 'react';
import { Ico } from '../../components/Manage/Icons';
import { fmtDate, avatarColor, fmtVND } from '../../components/Manage/Shared';

export const PromotionGridItem = ({ item, openEdit, del, idx }) => {
    return (
        <div className={`grid-item-card promo-card ${!item.TRANGTHAI ? 'promo-inactive' : ''}`}>
            <div className="grid-item-card-top">
                <div 
                    className="grid-item-icon-box" 
                    style={{ background: avatarColor(idx), color: '#fff', fontSize: 18, fontWeight: 800 }}
                >
                    {(item.TEN_CHUONG_TRINH[0] || '?').toUpperCase()}
                </div>
                <span className={item.TRANGTHAI ? 'badge badge-active' : 'badge badge-inactive'}>
                    {item.TRANGTHAI ? 'Đang chạy' : 'Tạm dừng'}
                </span>
            </div>
            
            <div className="grid-item-card-mid" style={{ flex: 1 }}>
                <div className="grid-item-title" style={{ fontFamily: 'var(--font)', fontSize: 15 }}>
                    {item.TEN_CHUONG_TRINH}
                </div>
                <div className="grid-item-label promo-type-label">
                    Chương trình giảm giá {item.LOAI_GIAM === 0 ? '(%)' : '(VNĐ)'}
                </div>
            </div>
            
            <div className="grid-item-card-bottom">
                <div className="grid-item-value" style={{ fontSize: 18, color: 'var(--accent)' }}>
                    {item.LOAI_GIAM === 0 ? `${item.GIATRI_GIAM}%` : fmtVND(item.GIATRI_GIAM)}
                </div>
                <div className="grid-item-label">
                    HSD: {fmtDate(item.NGAYKT)}
                </div>
            </div>
            
            <div className="grid-item-actions">
                <button className="btn-edit" title="Sửa" onClick={() => openEdit(item)}>
                    {Ico.edit}
                </button>
                <button className="btn-del" title="Xóa" onClick={() => del(item.ID)}>
                    {Ico.trash}
                </button>
            </div>
        </div>
    );
};
