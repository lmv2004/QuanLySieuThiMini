import React from 'react';
import { SimplePage } from '../../components/Manage/SimplePage';
import { Ico } from '../../components/Manage/Icons';
import { avatarColor, initials } from '../../components/Manage/Shared';

export const AccountsPage = () => <SimplePage
    title="Tài khoản" icon={Ico.account}
    subtitle={(l) => `${l.filter(x => !x.KHOA_TK).length} đang hoạt động · ${l.length} tổng`}
    emptyTitle="Chưa có tài khoản" emptyDesc="Tài khoản được tạo từ hệ thống"
    cols={['Tên đăng nhập', 'Email', 'Nhân viên', 'Trạng thái']}
    emptyForm={{ TENTK: '', EMAIL: '', MANV: '', KHOA_TK: false }}
    tabs={[
        { id: 'all', label: 'Tất cả' },
        { id: 'active', label: 'Đang hoạt động', filter: (x) => !x.KHOA_TK },
        { id: 'locked', label: 'Bị khóa', filter: (x) => x.KHOA_TK },
    ]}
    renderRow={(item, i) => [
        <td key="1"><div className="cell-entity"><div className="entity-avatar" style={{ background: avatarColor(i) }}>{initials(item.TENTK || 'TK')}</div><div className="entity-name">{item.TENTK}</div></div></td>,
        <td key="2" style={{ color: 'var(--cyan)', fontSize: 12.5 }}>{item.EMAIL || '—'}</td>,
        <td key="3" style={{ color: 'var(--text-muted)' }}>{item.MANV || '—'}</td>,
        <td key="4"><span className={item.KHOA_TK ? 'badge badge-inactive' : 'badge badge-active'}>{item.KHOA_TK ? 'Bị khóa' : 'Hoạt động'}</span></td>,
    ]}
    renderActions={(item, openEdit, del, i, list, setList) => {
        const toggle = () => setList(prev => prev.map(x => x._id === item._id ? { ...x, KHOA_TK: !x.KHOA_TK } : x));
        return (
            <>
                <button className="btn-action-ico btn-toggle" title={item.KHOA_TK ? "Mở khóa" : "Khóa tài khoản"} onClick={toggle}>
                    {item.KHOA_TK ? Ico.power : Ico.ban}
                </button>
                <button className="btn-action-ico btn-edit" title="Sửa" onClick={() => openEdit(item)}>{Ico.edit}</button>
                <button className="btn-action-ico btn-del" title="Xóa" onClick={() => del(item._id)}>{Ico.trash}</button>
            </>
        );
    }}
    renderGridItem={(item, openEdit, del, i, list, setList) => {
        const toggle = () => setList(prev => prev.map(x => x._id === item._id ? { ...x, KHOA_TK: !x.KHOA_TK } : x));
        return (
            <div key={item._id} className="voucher-card">
                <div className="voucher-card-top">
                    <div className="voucher-icon-box" style={{ background: avatarColor(i), color: '#fff', fontSize: 16, fontWeight: 800 }}>{initials(item.TENTK || 'TK')}</div>
                    <span className={item.KHOA_TK ? 'badge badge-inactive' : 'badge badge-active'}>
                        {item.KHOA_TK ? 'Đã khóa' : 'Hoạt động'}
                    </span>
                </div>
                <div className="voucher-card-mid" style={{ flex: 1 }}>
                    <div className="voucher-code" style={{ fontFamily: 'var(--font)', fontSize: 15 }}>{item.TENTK}</div>
                    <div className="voucher-label">{item.EMAIL || 'Chưa cập nhật email'}</div>
                </div>
                <div className="ticket-divider" />
                <div className="voucher-card-bottom">
                    <div className="voucher-label">ID NV: {item.MANV || '—'}</div>
                    <div className="voucher-label" style={{ color: 'var(--accent2)' }}>Cài đặt MK</div>
                </div>
                <div className="voucher-actions">
                    <button className="btn-edit" style={{ background: 'var(--amber-bg)', color: 'var(--amber)', borderColor: 'var(--amber-bd)' }} onClick={toggle}>{item.KHOA_TK ? Ico.power : Ico.ban}</button>
                    <button className="btn-edit" onClick={() => openEdit(item)}>{Ico.edit}</button>
                    <button className="btn-del" onClick={() => del(item._id)}>{Ico.trash}</button>
                </div>
            </div>
        );
    }}
    renderForm={(form, hc, setForm) => <>
        <div className="form-row"><div className="form-group"><label className="form-label">Tên đăng nhập</label><input className="form-input" name="TENTK" value={form.TENTK} onChange={hc} placeholder="user1" /></div><div className="form-group"><label className="form-label">Email</label><input className="form-input" name="EMAIL" value={form.EMAIL} onChange={hc} /></div></div>
        <div className="form-group"><label className="form-label">Trạng thái</label><select className="form-select" name="KHOA_TK" value={form.KHOA_TK ? 'true' : 'false'} onChange={e => setForm(p => ({ ...p, KHOA_TK: e.target.value === 'true' }))}><option value="false">Hoạt động</option><option value="true">Khóa</option></select></div>
    </>}
/>;
