import React, { useState, useMemo } from 'react';
import { SimplePage } from '../../components/Manage/SimplePage';
import { Ico } from '../../components/Manage/Icons';
import { avatarColor, roleBadge, initials } from '../../components/Manage/Shared';
import { EmptyState } from '../../components/Manage/EmptyState';
import { Modal } from '../../components/Manage/Modal';

const CHUCVU_LIST = [{ MACHUCVU: 1, TENCHUCVU: 'Quản lý' }, { MACHUCVU: 2, TENCHUCVU: 'Thu ngân' }, { MACHUCVU: 3, TENCHUCVU: 'Thủ kho' }];
const NV_EMPTY = { TENNV: '', SODIENTHOAI: '', EMAIL: '', DIACHI: '', MACHUCVU: '', IS_DELETED: false };

export const EmployeesPage = () => <SimplePage
    title="Nhân viên" icon={Ico.users}
    subtitle={(l) => `${l.filter(x => !x.IS_DELETED).length} hoạt động · ${l.length} tổng`}
    emptyTitle="Chưa có nhân viên" emptyDesc="Nhấn + Thêm để bắt đầu"
    cols={['Nhân viên', 'Số điện thoại', 'Vai trò', 'Trạng thái']}
    emptyForm={NV_EMPTY}
    tabs={[
        { id: 'all', label: 'Tất cả' },
        { id: 'active', label: 'Đang hoạt động', filter: (x) => !x.IS_DELETED },
        { id: 'manager', label: 'Quản lý', filter: (x) => x.chucVu?.MACHUCVU === 1 },
        { id: 'cashier', label: 'Thu ngân', filter: (x) => x.chucVu?.MACHUCVU === 2 },
        { id: 'warehouse', label: 'Thủ kho', filter: (x) => x.chucVu?.MACHUCVU === 3 },
        { id: 'inactive', label: 'Đã nghỉ', filter: (x) => x.IS_DELETED },
    ]}
    renderRow={(nv, i) => [
        <td key="1"><div className="cell-entity"><div className="entity-avatar" style={{ background: avatarColor(i) }}>{initials(nv.TENNV)}</div><div><div className="entity-name">{nv.TENNV}</div><div className="entity-sub">{nv.EMAIL}</div></div></div></td>,
        <td key="2" style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>{nv.SODIENTHOAI}</td>,
        <td key="3"><span className={roleBadge(nv.chucVu?.TENCHUCVU || '')}>{nv.chucVu?.TENCHUCVU || '—'}</span></td>,
        <td key="4"><span className={nv.IS_DELETED ? 'badge badge-inactive' : 'badge badge-active'}>{nv.IS_DELETED ? 'Ngừng' : 'Hoạt động'}</span></td>,
    ]}
    renderActions={(nv, openEdit, del, i, list, setList) => {
        const toggle = () => setList(prev => prev.map(x => x.MANV === nv.MANV ? { ...x, IS_DELETED: !x.IS_DELETED } : x));
        return (
            <>
                <button className="btn-action-ico btn-toggle" title={nv.IS_DELETED ? "Mở khóa" : "Khóa nhân viên"} onClick={toggle}>
                    {nv.IS_DELETED ? Ico.power : Ico.ban}
                </button>
                <button className="btn-action-ico btn-edit" title="Sửa" onClick={() => openEdit(nv)}>{Ico.edit}</button>
                <button className="btn-action-ico btn-del" title="Xóa" onClick={() => del(nv.MANV)}>{Ico.trash}</button>
            </>
        );
    }}
    renderGridItem={(nv, openEdit, del, i, list, setList) => {
        const toggle = () => setList(prev => prev.map(x => x.MANV === nv.MANV ? { ...x, IS_DELETED: !x.IS_DELETED } : x));
        return (
            <div key={nv.MANV} className="voucher-card">
                <div className="voucher-card-top">
                    <div className="voucher-icon-box" style={{ background: avatarColor(i), color: '#fff', fontSize: 16, fontWeight: 800 }}>{initials(nv.TENNV)}</div>
                    <span className={nv.IS_DELETED ? 'badge badge-inactive' : 'badge badge-active'}>
                        {nv.IS_DELETED ? 'Ngừng' : 'Hoạt động'}
                    </span>
                </div>
                <div className="voucher-card-mid" style={{ flex: 1 }}>
                    <div className="voucher-code" style={{ fontFamily: 'var(--font)', fontSize: 15 }}>{nv.TENNV}</div>
                    <div className="voucher-label">{nv.EMAIL}</div>
                    <div style={{ marginTop: 10 }}>
                        <span className={roleBadge(nv.chucVu?.TENCHUCVU || '')}>{nv.chucVu?.TENCHUCVU || 'Staff'}</span>
                    </div>
                </div>
                <div className="ticket-divider" />
                <div className="voucher-card-bottom">
                    <div className="voucher-value" style={{ fontSize: 13, fontFamily: 'var(--mono)' }}>{nv.SODIENTHOAI}</div>
                    <div className="voucher-label">{nv.DIACHI?.split(',')[0]}</div>
                </div>
                <div className="voucher-actions">
                    <button className="btn-edit" style={{ background: 'var(--amber-bg)', color: 'var(--amber)', borderColor: 'var(--amber-bd)' }} onClick={toggle}>{nv.IS_DELETED ? Ico.power : Ico.ban}</button>
                    <button className="btn-edit" onClick={() => openEdit(nv)}>{Ico.edit}</button>
                    <button className="btn-del" onClick={() => del(nv.MANV)}>{Ico.trash}</button>
                </div>
            </div>
        );
    }}
    renderForm={(form, hc, setForm) => <>
        <div className="form-group"><label className="form-label">Họ tên</label><input className="form-input" name="TENNV" value={form.TENNV} onChange={hc} placeholder="Nguyễn Văn A" /></div>
        <div className="form-row">
            <div className="form-group"><label className="form-label">Số điện thoại</label><input className="form-input" name="SODIENTHOAI" value={form.SODIENTHOAI} onChange={hc} placeholder="0901 234 567" /></div>
            <div className="form-group"><label className="form-label">Email</label><input className="form-input" name="EMAIL" value={form.EMAIL} onChange={hc} placeholder="email@gmail.com" /></div>
        </div>
        <div className="form-row">
            <div className="form-group"><label className="form-label">Chức vụ</label><select className="form-select" name="MACHUCVU" value={form.MACHUCVU} onChange={(e) => {
                const val = Number(e.target.value);
                const cv = CHUCVU_LIST.find(c => c.MACHUCVU === val);
                hc(e);
                setForm(p => ({ ...p, chucVu: cv }));
            }}><option value="">-- Chọn --</option>{CHUCVU_LIST.map(cv => <option key={cv.MACHUCVU} value={cv.MACHUCVU}>{cv.TENCHUCVU}</option>)}</select></div>
            <div className="form-group"><label className="form-label">Trạng thái</label><select className="form-select" name="IS_DELETED" value={form.IS_DELETED ? 'true' : 'false'} onChange={e => setForm(p => ({ ...p, IS_DELETED: e.target.value === 'true' }))}><option value="false">Hoạt động</option><option value="true">Ngừng</option></select></div>
        </div>
        <div className="form-group"><label className="form-label">Địa chỉ</label><input className="form-input" name="DIACHI" value={form.DIACHI} onChange={hc} placeholder="123 Nguyễn Huệ, Q.1" /></div>
    </>}
/>;
