import React from 'react';
import { Ico } from '../../components/Manage/Icons';
import { fmtDate } from '../../components/Manage/Shared';

export const DisposalGridItem = ({ item, openEdit, del }) => {
    return (
        <div className="grid-item-card disposal-card">
            <div className="grid-item-card-top">
                <div className="grid-item-icon-box" style={{ background: 'var(--bg-hover)', border: '1px solid var(--border)' }}>
                    {Ico.trash}
                </div>
                <span className="badge badge-approved">Phiếu Hủy</span>
            </div>

            <div className="grid-item-card-mid" style={{ flex: 1 }}>
                <div className="grid-item-title" style={{ fontFamily: 'var(--mono)', fontSize: 16 }}>
                    Phiếu #{String(item.MAPHIEU).padStart(3, '0')}
                </div>
                <div className="grid-item-label" style={{ marginTop: '4px' }}>
                    {fmtDate(item.NGAYLAP)}
                </div>
                <div className="grid-item-label" style={{ marginTop: '2px', fontSize: 11 }}>
                    {item.NHANVIEN?.TENNV || '—'}
                </div>
            </div>

            <div className="grid-item-card-bottom">
                <div className="grid-item-value" style={{ fontSize: 16 }}>
                    {item.CHI_TIET_PHIEU_HUY?.length || 0} SP
                </div>
                <div className="grid-item-label">Số mặt hàng hủy</div>
            </div>

            <div className="grid-item-actions">
                <button className="btn-edit" title="Sửa" onClick={() => openEdit(item)}>
                    {Ico.edit}
                </button>
                <button className="btn-del" title="Xóa" onClick={() => del(item.MAPHIEU)}>
                    {Ico.trash}
                </button>
            </div>
        </div>
    );
};
