import React from 'react';
import { SimplePage } from '../../components/Manage/SimplePage';
import { Ico } from '../../components/Manage/Icons';
import { fmtDate, fmtVND } from '../../components/Manage/Shared';

export const VouchersPage = () => {
    const initialData = [
        { _id: 1, MAVOUCHER: 'SALES20', LOAI: 'percent', GIATRI: 20, NGAYHETHAN: '2026-12-31', IS_ACTIVE: true },
        { _id: 2, MAVOUCHER: 'GIAM100K', LOAI: 'fixed', GIATRI: 100000, NGAYHETHAN: '2026-11-15', IS_ACTIVE: true },
        { _id: 3, MAVOUCHER: 'WELCOME', LOAI: 'percent', GIATRI: 10, NGAYHETHAN: '2024-01-01', IS_ACTIVE: false },
        { _id: 4, MAVOUCHER: 'TET2026', LOAI: 'percent', GIATRI: 15, NGAYHETHAN: '2026-02-28', IS_ACTIVE: true },
    ];

    const stats = (list) => [
        { label: 'Tổng voucher', value: list.length, icon: 'ticket', color: 'var(--accent)' },
        { label: 'Đang hoạt động', value: list.filter(v => v.IS_ACTIVE).length, icon: 'userCheck', color: '#10b981' },
        { label: 'Hết hạn', value: list.filter(v => !v.IS_ACTIVE).length, icon: 'ban', color: '#f43f5e' },
    ];

    return (
        <SimplePage
            title="Voucher"
            icon={Ico.ticket}
            subtitle={(l) => `${l.filter(x => x.IS_ACTIVE).length} đang hoạt động · ${l.length} tổng`}
            emptyTitle="Chưa có voucher"
            emptyDesc="Nhấn + Thêm để tạo voucher mới"
            cols={['Mã voucher', 'Loại giảm', 'Giá trị', 'Hạn dùng', 'Trạng thái']}
            initialData={initialData}
            stats={stats}
            tabs={[
                { id: 'all', label: 'Tất cả' },
                { id: 'active', label: 'Đang hoạt động', filter: (x) => x.IS_ACTIVE },
                { id: 'expired', label: 'Hết hạn', filter: (x) => !x.IS_ACTIVE },
            ]}
            renderRow={(item) => [
                <td key="1"><span className="code-link">{item.MAVOUCHER}</span></td>,
                <td key="2"><span className="badge badge-info">{item.LOAI === 'percent' ? 'Phần trăm' : 'Số tiền'}</span></td>,
                <td key="3" className="price-main">{item.LOAI === 'percent' ? `${item.GIATRI}%` : fmtVND(item.GIATRI)}</td>,
                <td key="4" style={{ color: 'var(--text-muted)' }}>{fmtDate(item.NGAYHETHAN)}</td>,
                <td key="5"><span className={item.IS_ACTIVE ? 'badge badge-active' : 'badge badge-inactive'}>{item.IS_ACTIVE ? 'Hoạt động' : 'Hết hạn'}</span></td>,
            ]}
            renderActions={(item, openEdit, del, i, list, setList) => {
                const toggle = () => setList(prev => prev.map(x => x._id === item._id ? { ...x, IS_ACTIVE: !x.IS_ACTIVE } : x));
                return (
                    <>
                        <button className="btn-action-ico btn-toggle" title={item.IS_ACTIVE ? "Hết hạn" : "Kích hoạt"} onClick={toggle}>
                            {item.IS_ACTIVE ? Ico.power : Ico.ban}
                        </button>
                        <button className="btn-action-ico btn-edit" title="Sửa" onClick={() => openEdit(item)}>{Ico.edit}</button>
                        <button className="btn-action-ico btn-del" title="Xóa" onClick={() => del(item._id)}>{Ico.trash}</button>
                    </>
                );
            }}
            renderGridItem={(item, openEdit, del, i, list, setList) => {
                const toggle = () => setList(prev => prev.map(x => x._id === item._id ? { ...x, IS_ACTIVE: !x.IS_ACTIVE } : x));
                return (
                    <div key={item._id} className="voucher-card">
                        <div className="voucher-card-top">
                            <div className="voucher-icon-box">{Ico.ticket}</div>
                            <span className={item.IS_ACTIVE ? 'badge badge-active' : 'badge badge-inactive'}>
                                {item.IS_ACTIVE ? 'Hoạt động' : 'Hết hạn'}
                            </span>
                        </div>
                        <div className="voucher-card-mid" style={{ flex: 1 }}>
                            <div className="voucher-code">{item.MAVOUCHER}</div>
                            <div className="voucher-label">{item.LOAI === 'percent' ? 'Giảm giá phần trăm' : 'Giảm trực tiếp'}</div>
                        </div>
                        <div className="ticket-divider" />
                        <div className="voucher-card-bottom">
                            <div className="voucher-value">{item.LOAI === 'percent' ? `${item.GIATRI}%` : fmtVND(item.GIATRI)}</div>
                            <div className="voucher-label">HSD: {fmtDate(item.NGAYHETHAN)}</div>
                        </div>
                        <div className="voucher-actions">
                            <button className="btn-edit" style={{ background: 'var(--amber-bg)', color: 'var(--amber)', borderColor: 'var(--amber-bd)' }} onClick={toggle}>{item.IS_ACTIVE ? Ico.power : Ico.ban}</button>
                            <button className="btn-edit" onClick={() => openEdit(item)}>{Ico.edit}</button>
                            <button className="btn-del" onClick={() => del(item._id)}>{Ico.trash}</button>
                        </div>
                    </div>
                );
            }}
            emptyForm={{ MAVOUCHER: '', LOAI: 'percent', GIATRI: '', NGAYHETHAN: '' }}
            renderForm={(form, hc, setForm) => <>
                <div className="form-row"><div className="form-group"><label className="form-label">Mã voucher</label><input className="form-input" name="MAVOUCHER" value={form.MAVOUCHER} onChange={hc} placeholder="SALE20" /></div><div className="form-group"><label className="form-label">Loại giảm</label><select className="form-select" name="LOAI" value={form.LOAI} onChange={hc}><option value="percent">Phần trăm (%)</option><option value="fixed">Số tiền (₫)</option></select></div></div>
                <div className="form-row"><div className="form-group"><label className="form-label">Giá trị</label><input className="form-input" type="number" name="GIATRI" value={form.GIATRI} onChange={hc} placeholder={form.LOAI === 'percent' ? '20' : '50000'} /></div><div className="form-group"><label className="form-label">Ngày hết hạn</label><input className="form-input" type="date" name="NGAYHETHAN" value={form.NGAYHETHAN} onChange={hc} /></div></div>
            </>}
        />
    );
};
