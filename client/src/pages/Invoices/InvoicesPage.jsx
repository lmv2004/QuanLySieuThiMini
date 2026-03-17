import React from 'react';
import { SimplePage } from '../../components/Manage/SimplePage';
import { Ico } from '../../components/Manage/Icons';
import { fmtDate, fmtVND, STATUS_MAP } from '../../components/Manage/Shared';

export const InvoicesPage = () => <SimplePage
    title="Hóa đơn / Bán hàng" icon={Ico.receipt}
    subtitle={(l) => `${l.length} hóa đơn`}
    emptyTitle="Chưa có hóa đơn" emptyDesc="Dữ liệu hóa đơn sẽ hiển thị ở đây"
    cols={['Mã HD', 'Ngày', 'Khách hàng', 'Tổng tiền', 'Trạng thái']}
    emptyForm={{ MAHD: '', NGAY: '', KHACHHANG: '', TONGTIEN: '', TRANGTHAI: 'PENDING' }}
    tabs={[
        { id: 'all', label: 'Tất cả' },
        { id: 'completed', label: 'Đã hoàn thành', filter: (x) => x.TRANGTHAI === 'COMPLETED' },
        { id: 'pending', label: 'Chờ xử lý', filter: (x) => x.TRANGTHAI === 'PENDING' },
        { id: 'cancelled', label: 'Đã hủy', filter: (x) => x.TRANGTHAI === 'CANCELLED' },
    ]}
    renderRow={(item) => [
        <td key="1"><span className="code-link">{item.MAHD || `HD-${String(item._id).slice(-4)}`}</span></td>,
        <td key="2" style={{ color: 'var(--text-muted)' }}>{fmtDate(item.NGAY)}</td>,
        <td key="3">{item.KHACHHANG || '—'}</td>,
        <td key="4" className="price-main">{item.TONGTIEN ? fmtVND(item.TONGTIEN) : '—'}</td>,
        <td key="5"><span className={(STATUS_MAP[item.TRANGTHAI] || { cls: 'badge' }).cls}>{(STATUS_MAP[item.TRANGTHAI] || { label: item.TRANGTHAI }).label}</span></td>,
    ]}
    renderGridItem={(item, openEdit, del, i) => {
        const s = STATUS_MAP[item.TRANGTHAI] || { label: item.TRANGTHAI, cls: 'badge' };
        return (
            <div key={item._id} className="voucher-card">
                <div className="voucher-card-top">
                    <div className="voucher-icon-box" style={{ background: 'var(--bg-hover)', border: '1px solid var(--border)' }}>{Ico.receipt}</div>
                    <span className={s.cls}>{s.label}</span>
                </div>
                <div className="voucher-card-mid" style={{ flex: 1 }}>
                    <div className="voucher-code" style={{ fontFamily: 'var(--mono)', fontSize: 16 }}>{item.MAHD || `HD-${String(item._id).slice(-4)}`}</div>
                    <div className="voucher-label">{item.KHACHHANG || 'Khách lẻ'}</div>
                    <div className="voucher-label" style={{ marginTop: 4 }}>{fmtDate(item.NGAY)}</div>
                </div>
                <div className="ticket-divider" />
                <div className="voucher-card-bottom">
                    <div className="voucher-value" style={{ fontSize: 18 }}>{fmtVND(item.TONGTIEN)}</div>
                    <div className="voucher-label">Thanh toán</div>
                </div>
                <div className="voucher-actions">
                    <button className="btn-edit" onClick={() => openEdit(item)}>Sửa</button>
                    <button className="btn-del" onClick={() => del(item._id)}>✕</button>
                </div>
            </div>
        );
    }}
    renderForm={(form, hc) => <>
        <div className="form-row"><div className="form-group"><label className="form-label">Ngày lập</label><input className="form-input" type="date" name="NGAY" value={form.NGAY} onChange={hc} /></div><div className="form-group"><label className="form-label">Khách hàng</label><input className="form-input" name="KHACHHANG" value={form.KHACHHANG} onChange={hc} placeholder="Tên khách" /></div></div>
        <div className="form-group"><label className="form-label">Tổng tiền (₫)</label><input className="form-input" type="number" name="TONGTIEN" value={form.TONGTIEN} onChange={hc} placeholder="0" /></div>
    </>}
/>;
