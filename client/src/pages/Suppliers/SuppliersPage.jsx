import React, { useState, useMemo } from 'react';
import { SimplePage } from '../../components/Manage/SimplePage';
import { Ico } from '../../components/Manage/Icons';
import { avatarColor } from '../../components/Manage/Shared';
import { EmptyState } from '../../components/Manage/EmptyState';
import { Modal } from '../../components/Manage/Modal';

const NCC_EMPTY = { TENNCC: '', SDT: '', EMAIL: '', DIACHI: '', IS_DELETED: false };

export const SuppliersPage = () => <SimplePage
    title="Nhà cung cấp" icon={Ico.truck}
    subtitle={(l) => `${l.filter(x => !x.IS_DELETED).length} hợp tác · ${l.length} tổng`}
    emptyTitle="Chưa có nhà cung cấp" emptyDesc="Nhấn + Thêm để bắt đầu"
    cols={['Công ty', 'SĐT', 'Email', 'Địa chỉ', 'Trạng thái']}
    emptyForm={NCC_EMPTY}
    tabs={[
        { id: 'all', label: 'Tất cả' },
        { id: 'active', label: 'Đang hợp tác', filter: (x) => !x.IS_DELETED },
        { id: 'inactive', label: 'Ngừng hợp tác', filter: (x) => x.IS_DELETED },
    ]}
    renderRow={(n, i) => [
        <td key="1"><div className="cell-entity"><div className="entity-avatar" style={{ background: avatarColor(i) }}>{(n.TENNCC[0] || '?').toUpperCase()}</div><div className="entity-name">{n.TENNCC}</div></div></td>,
        <td key="2" style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>{n.SDT}</td>,
        <td key="3" style={{ color: 'var(--cyan)', fontSize: 12.5 }}>{n.EMAIL}</td>,
        <td key="4" style={{ color: 'var(--text-muted)', fontSize: 12 }}>{n.DIACHI}</td>,
        <td key="5"><span className={n.IS_DELETED ? 'badge badge-inactive' : 'badge badge-active'}>{n.IS_DELETED ? 'Ngừng' : 'Hoạt động'}</span></td>,
    ]}
    renderActions={(n, openEdit, del, i, list, setList) => {
        const toggle = () => setList(prev => prev.map(x => x.MANCC === n.MANCC ? { ...x, IS_DELETED: !x.IS_DELETED } : x));
        return (
            <>
                <button className="btn-action-ico btn-toggle" title={n.IS_DELETED ? "Mở hợp tác" : "Ngừng hợp tác"} onClick={toggle}>
                    {n.IS_DELETED ? Ico.power : Ico.ban}
                </button>
                <button className="btn-action-ico btn-edit" title="Sửa" onClick={() => openEdit(n)}>{Ico.edit}</button>
                <button className="btn-action-ico btn-del" title="Xóa" onClick={() => del(n.MANCC)}>{Ico.trash}</button>
            </>
        );
    }}
    renderGridItem={(n, openEdit, del, i, list, setList) => {
        const toggle = () => setList(prev => prev.map(x => x.MANCC === n.MANCC ? { ...x, IS_DELETED: !x.IS_DELETED } : x));
        return (
            <div key={n.MANCC} className="voucher-card">
                <div className="voucher-card-top">
                    <div className="voucher-icon-box" style={{ background: avatarColor(i), color: '#fff', fontSize: 16, fontWeight: 800 }}>{(n.TENNCC[0] || '?').toUpperCase()}</div>
                    <span className={n.IS_DELETED ? 'badge badge-inactive' : 'badge badge-active'}>
                        {n.IS_DELETED ? 'Ngừng' : 'Hoạt động'}
                    </span>
                </div>
                <div className="voucher-card-mid" style={{ flex: 1 }}>
                    <div className="voucher-code" style={{ fontFamily: 'var(--font)', fontSize: 15 }}>{n.TENNCC}</div>
                    <div className="voucher-label">{n.EMAIL || 'N/A'}</div>
                </div>
                <div className="ticket-divider" />
                <div className="voucher-card-bottom">
                    <div className="voucher-value" style={{ fontSize: 13, fontFamily: 'var(--mono)' }}>{n.SDT}</div>
                    <div className="voucher-label">{n.DIACHI?.split(',')[0]}</div>
                </div>
                <div className="voucher-actions">
                    <button className="btn-edit" style={{ background: 'var(--amber-bg)', color: 'var(--amber)', borderColor: 'var(--amber-bd)' }} onClick={toggle}>{n.IS_DELETED ? Ico.power : Ico.ban}</button>
                    <button className="btn-edit" onClick={() => openEdit(n)}>{Ico.edit}</button>
                    <button className="btn-del" onClick={() => del(n.MANCC)}>{Ico.trash}</button>
                </div>
            </div>
        );
    }}
    renderForm={(form, hc, setForm) => <>
        <div className="form-group"><label className="form-label">Tên công ty</label><input className="form-input" name="TENNCC" value={form.TENNCC} onChange={hc} placeholder="Công ty TNHH ABC" /></div>
        <div className="form-row"><div className="form-group"><label className="form-label">Số điện thoại</label><input className="form-input" name="SDT" value={form.SDT} onChange={hc} /></div><div className="form-group"><label className="form-label">Email</label><input className="form-input" name="EMAIL" value={form.EMAIL} onChange={hc} /></div></div>
        <div className="form-group"><label className="form-label">Địa chỉ</label><input className="form-input" name="DIACHI" value={form.DIACHI} onChange={hc} /></div>
        <div className="form-group"><label className="form-label">Trạng thái</label><select className="form-select" name="IS_DELETED" value={form.IS_DELETED ? 'true' : 'false'} onChange={e => setForm(p => ({ ...p, IS_DELETED: e.target.value === 'true' }))}><option value="false">Hoạt động</option><option value="true">Ngừng</option></select></div>
    </>}
/>;
