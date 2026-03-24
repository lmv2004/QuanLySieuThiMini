import React from 'react';
import { Ico } from '../../components/Manage/Icons';
import { fmtDate, initials, avatarColor } from '../../components/Manage/Shared';
import { DisposalActions } from './DisposalActions';

export const DisposalGridItem = ({ item, openEdit, del, list, setList, addToast, openView }) => {
    const status = item.TRANGTHAI || 'PENDING';
    const statusLabel = status === 'APPROVED' ? 'Đã duyệt' : status === 'CANCELLED' ? 'Đã hủy' : 'Chờ duyệt';
    const statusClass = status.toLowerCase();

    return (
        <div className={`disposal-card ${statusClass}`}>
            {/* 1. TOP: Avatar & Badge */}
            <div className="disposal-card-top">
                <div className="disposal-avatar-big" style={{ background: avatarColor(item.NHANVIEN?.TENNV || 'A') }}>
                    {initials(item.NHANVIEN?.TENNV || 'A')}
                </div>
                <span className={`badge badge-${statusClass}`}>{statusLabel}</span>
            </div>

            {/* 2. MID: Main Info */}
            <div className="disposal-card-content">
                <div className="disposal-card-title">
                    {item.NHANVIEN?.TENNV || 'Người dùng'}
                </div>
                <div className="disposal-card-sub">
                    <b>ID:</b> DSP-{String(item.MAPHIEU).padStart(3, '0')}
                </div>
                <div className="disposal-card-sub" style={{ marginTop: 4, height: 32, overflow: 'hidden' }}>
                    {item.LYDO || 'Không có lý do'}
                </div>
            </div>

            {/* 3. BOTTOM: Date & Total Items count */}
            <div className="disposal-card-bottom">
                <div>
                    <div className="disposal-stats-label">{fmtDate(item.NGAYLAP)}</div>
                    <div className="disposal-stats-sub">Ngày lập phiếu</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div className="disposal-stats-label" style={{ color: '#475569' }}>
                        {item.chiTiets?.length || 0}
                    </div>
                    <div className="disposal-stats-sub">Sản phẩm</div>
                </div>
            </div>

            {/* 4. ACTIONS (Floating top-right) */}
            <div className="disposal-floating-actions">
                <DisposalActions
                    item={item}
                    openEdit={openEdit}
                    del={del}
                    openView={openView}
                    list={list}
                    setList={setList}
                    addToast={addToast}
                />
            </div>
        </div>
    );
};
