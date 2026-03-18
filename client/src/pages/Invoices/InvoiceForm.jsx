import React from 'react';

export const emptyInvoice = { MAHD: '', NGAY: '', KHACHHANG: '', TONGTIEN: '', TRANGTHAI: 'PENDING' };

export const InvoiceForm = ({ form, hc, setForm }) => (
    <>
        <div className="form-row">
            <div className="form-group">
                <label className="form-label">Ngày lập</label>
                <input className="form-input" type="date" name="NGAY" value={form.NGAY || ''} onChange={hc} />
            </div>
            <div className="form-group">
                <label className="form-label">Khách hàng</label>
                <input className="form-input" name="KHACHHANG" value={form.KHACHHANG || ''} onChange={hc} placeholder="Tên khách" />
            </div>
        </div>
        <div className="form-group">
            <label className="form-label">Tổng tiền (₫)</label>
            <input className="form-input" type="number" name="TONGTIEN" value={form.TONGTIEN || ''} onChange={hc} placeholder="0" />
        </div>
    </>
);
