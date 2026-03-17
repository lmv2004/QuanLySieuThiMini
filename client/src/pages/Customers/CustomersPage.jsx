import React from 'react';
import { SimplePage } from '../../components/Manage/SimplePage';
import { Ico } from '../../components/Manage/Icons';
import { avatarColor, initials } from '../../components/Manage/Shared';

export const CustomersPage = () => <SimplePage
    title="Khách hàng" icon={Ico.userGroup}
    subtitle={(l) => `${l.length} khách hàng`}
    emptyTitle="Chưa có khách hàng" emptyDesc="Dữ liệu khách hàng sẽ hiển thị ở đây"
    cols={['Khách hàng', 'Số điện thoại', 'Email', 'Điểm tích lũy']}
    emptyForm={{ TENKH: '', SDT: '', EMAIL: '', DIEMTICHLUY: 0 }}
    tabs={[
        { id: 'all', label: 'Tất cả' },
        { id: 'vip', label: 'Khách hàng VIP', filter: (x) => x.DIEMTICHLUY >= 1000 },
        { id: 'regular', label: 'Thường', filter: (x) => x.DIEMTICHLUY < 1000 },
    ]}
    renderRow={(item, i) => [
        <td key="1"><div className="cell-entity"><div className="entity-avatar" style={{ background: avatarColor(i) }}>{initials(item.TENKH || 'KH')}</div><div className="entity-name">{item.TENKH}</div></div></td>,
        <td key="2" style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>{item.SDT || '—'}</td>,
        <td key="3" style={{ color: 'var(--cyan)', fontSize: 12.5 }}>{item.EMAIL || '—'}</td>,
        <td key="4"><span className="badge badge-info">{item.DIEMTICHLUY || 0} điểm</span></td>,
    ]}
    renderActions={(item, openEdit, del) => (
        <>
            <button className="btn-action-ico btn-edit" title="Sửa" onClick={() => openEdit(item)}>{Ico.edit}</button>
            <button className="btn-action-ico btn-del" title="Xóa" onClick={() => del(item._id)}>{Ico.trash}</button>
        </>
    )}
    renderGridItem={(item, openEdit, del, i) => (
        <div key={item._id} className="voucher-card">
            <div className="voucher-card-top">
                <div className="voucher-icon-box" style={{ background: avatarColor(i), color: '#fff', fontSize: 16, fontWeight: 800 }}>{initials(item.TENKH || 'KH')}</div>
                <span className={item.DIEMTICHLUY >= 1000 ? 'badge badge-active' : 'badge badge-info'}>
                    {item.DIEMTICHLUY >= 1000 ? 'Thành viên VIP' : 'Thành viên'}
                </span>
            </div>
            <div className="voucher-card-mid" style={{ flex: 1 }}>
                <div className="voucher-code" style={{ fontFamily: 'var(--font)', fontSize: 15 }}>{item.TENKH}</div>
                <div className="voucher-label">{item.EMAIL || 'Chưa cập nhật email'}</div>
            </div>
            <div className="ticket-divider" />
            <div className="voucher-card-bottom">
                <div className="voucher-value" style={{ fontSize: 14 }}>{item.DIEMTICHLUY || 0} pts</div>
                <div className="voucher-label">{item.SDT || '—'}</div>
            </div>
            <div className="voucher-actions">
                <button className="btn-edit" onClick={() => openEdit(item)}>{Ico.edit}</button>
                <button className="btn-del" onClick={() => del(item._id)}>{Ico.trash}</button>
            </div>
        </div>
    )}
    renderForm={(form, hc) => <>
        <div className="form-group"><label className="form-label">Họ tên</label><input className="form-input" name="TENKH" value={form.TENKH} onChange={hc} placeholder="Nguyễn Văn A" /></div>
        <div className="form-row"><div className="form-group"><label className="form-label">Số điện thoại</label><input className="form-input" name="SDT" value={form.SDT} onChange={hc} /></div><div className="form-group"><label className="form-label">Email</label><input className="form-input" name="EMAIL" value={form.EMAIL} onChange={hc} /></div></div>
    </>}
/>;
