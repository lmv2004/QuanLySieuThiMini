import React from 'react';
import { SimplePage } from '../../components/Manage/SimplePage';
import { Ico } from '../../components/Manage/Icons';
import { fmtDate, avatarColor } from '../../components/Manage/Shared';

export const PromotionsPage = () => <SimplePage
    title="Khuyến mãi / Giảm giá" icon={Ico.percent}
    subtitle={(l) => `${l.length} chương trình`}
    emptyTitle="Chưa có khuyến mãi" emptyDesc="Nhấn + Thêm để tạo chương trình KM"
    cols={['Tên KM', 'Giảm giá', 'Từ ngày', 'Đến ngày', 'Trạng thái']}
    emptyForm={{ TENKM: '', PHANTRAMGIAM: '', TUNGAY: '', DENNGAY: '', IS_ACTIVE: true }}
    tabs={[
        { id: 'all', label: 'Tất cả' },
        { id: 'active', label: 'Đang chạy', filter: (x) => x.IS_ACTIVE },
        { id: 'finished', label: 'Kết thúc', filter: (x) => !x.IS_ACTIVE },
    ]}
    renderRow={(item) => [
        <td key="1"><span className="entity-name">{item.TENKM}</span></td>,
        <td key="2"><span className="badge badge-info">{item.PHANTRAMGIAM}%</span></td>,
        <td key="3" style={{ color: 'var(--text-muted)', fontSize: 12 }}>{fmtDate(item.TUNGAY)}</td>,
        <td key="4" style={{ color: 'var(--text-muted)', fontSize: 12 }}>{fmtDate(item.DENNGAY)}</td>,
        <td key="5"><span className={item.IS_ACTIVE ? 'badge badge-active' : 'badge badge-inactive'}>{item.IS_ACTIVE ? 'Đang chạy' : 'Kết thúc'}</span></td>,
    ]}
    renderActions={(item, openEdit, del, i, list, setList) => {
        const toggle = () => setList(prev => prev.map(x => x._id === item._id ? { ...x, IS_ACTIVE: !x.IS_ACTIVE } : x));
        return (
            <>
                <button className="btn-action-ico btn-toggle" title={item.IS_ACTIVE ? "Kết thúc KM" : "Kích hoạt KM"} onClick={toggle}>
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
                    <div className="voucher-icon-box" style={{ background: avatarColor(i), color: '#fff', fontSize: 18, fontWeight: 800 }}>%</div>
                    <span className={item.IS_ACTIVE ? 'badge badge-active' : 'badge badge-inactive'}>
                        {item.IS_ACTIVE ? 'Đang chạy' : 'Kết thúc'}
                    </span>
                </div>
                <div className="voucher-card-mid" style={{ flex: 1 }}>
                    <div className="voucher-code" style={{ fontFamily: 'var(--font)', fontSize: 15 }}>{item.TENKM}</div>
                    <div className="voucher-label">Chương trình giảm giá</div>
                    <div style={{ marginTop: 12, display: 'flex', gap: 6 }}>
                        <span className="badge badge-info" style={{ fontSize: 14 }}>Giảm {item.PHANTRAMGIAM}%</span>
                    </div>
                </div>
                <div className="ticket-divider" />
                <div className="voucher-card-bottom">
                    <div className="voucher-label">Từ {fmtDate(item.TUNGAY)}</div>
                    <div className="voucher-label">Đến {fmtDate(item.DENNGAY)}</div>
                </div>
                <div className="voucher-actions">
                    <button className="btn-edit" style={{ background: 'var(--amber-bg)', color: 'var(--amber)', borderColor: 'var(--amber-bd)' }} onClick={toggle}>{item.IS_ACTIVE ? Ico.power : Ico.ban}</button>
                    <button className="btn-edit" onClick={() => openEdit(item)}>{Ico.edit}</button>
                    <button className="btn-del" onClick={() => del(item._id)}>{Ico.trash}</button>
                </div>
            </div>
        );
    }}
    renderForm={(form, hc) => <>
        <div className="form-group"><label className="form-label">Tên chương trình</label><input className="form-input" name="TENKM" value={form.TENKM} onChange={hc} placeholder="Khuyến mãi hè 2026" /></div>
        <div className="form-group"><label className="form-label">Phần trăm giảm (%)</label><input className="form-input" type="number" name="PHANTRAMGIAM" value={form.PHANTRAMGIAM} onChange={hc} placeholder="20" /></div>
        <div className="form-row"><div className="form-group"><label className="form-label">Từ ngày</label><input className="form-input" type="date" name="TUNGAY" value={form.TUNGAY} onChange={hc} /></div><div className="form-group"><label className="form-label">Đến ngày</label><input className="form-input" type="date" name="DENNGAY" value={form.DENNGAY} onChange={hc} /></div></div>
    </>}
/>;
