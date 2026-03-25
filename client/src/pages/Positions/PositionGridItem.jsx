import React from 'react';
import { Ico } from '../../components/Manage/Icons';
import { avatarColor } from '../../components/Manage/Shared';

export const PositionGridItem = ({ item, openEdit, del, idx, openView }) => (
    <div className="grid-item-card">
        <div className="grid-item-card-top">
            <div className="grid-item-icon-box" style={{ background: avatarColor(idx), color: '#fff', fontSize: 18, fontWeight: 800 }}>
                {(item.TENCHUCVU?.[0] || '?').toUpperCase()}
            </div>
            <span className="badge badge-role">Chức vụ</span>
        </div>
        <div className="grid-item-card-mid" style={{ flex: 1 }}>
            <div className="grid-item-title" style={{ fontFamily: 'var(--font)', fontSize: 15 }}>{item.TENCHUCVU}</div>
            <div className="grid-item-label">Mã: #{item.MACHUCVU}</div>
            {item.CODE && (
                <div className="grid-item-label" style={{ marginTop: 3, fontFamily: 'var(--mono)', color: 'var(--accent)', fontSize: 11.5 }}>
                    {item.CODE}
                </div>
            )}
            {item.MOTA && (
                <div className="grid-item-label" style={{ marginTop: 4, fontSize: 12 }}>{item.MOTA}</div>
            )}
        </div>
        <div className="grid-item-card-bottom">
            <div className="grid-item-value" style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {item.created_at ? new Date(item.created_at).toLocaleDateString('vi-VN') : '—'}
            </div>
            <div className="grid-item-label">Ngày tạo</div>
        </div>
        <div className="grid-item-actions">
            <TableActions 
                item={item}
                primaryKey="MACHUCVU"
                openEdit={openEdit}
                del={del}
                openView={openView}
            />
        </div>
    </div>
);
