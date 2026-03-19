import React, { useEffect, useMemo, useState } from 'react';
import api from '../../services/api';

export const emptyInvoice = {
    MAHD: '',
    NGAYHD: '',
    HINHTHUC: 'Tiền mặt',
    TONGTIEN_HANG: '',
    TIEN_GIAM_VOUCHER: '',
    TONG_THANHTOAN: '',
    TRANGTHAI: 0,
    MANV: '',
    MAKH: '',
    SOVOUCHER: '',
    nhanVien: null,
    khachHang: null,
    voucher: null,
    chiTiets: [],
};

const FieldError = ({ errors, name }) => {
    if (!errors?.[name]) return null;
    return (
        <span style={{ display: 'block', color: '#dc2626', fontSize: 11.5, marginTop: 4, fontWeight: 500 }}>
            {errors[name]}
        </span>
    );
};

const errStyle = (errors, name) =>
    errors?.[name] ? { borderColor: '#f87171', background: '#fff8f8' } : {};

export const InvoiceForm = ({ form, hc, setForm, readOnly = false, errors = {}, mode }) => {
    const [employees, setEmployees] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [vouchers, setVouchers] = useState([]);
    const [loadingEmp, setLoadingEmp] = useState(false);
    const [loadingCus, setLoadingCus] = useState(false);
    const [loadingVou, setLoadingVou] = useState(false);

    useEffect(() => {
        setLoadingEmp(true);
        api.get('/employees', { params: { per_page: 500 } })
            .then(res => setEmployees(res.data?.data || res.data || []))
            .catch(() => setEmployees([]))
            .finally(() => setLoadingEmp(false));
    }, []);

    useEffect(() => {
        setLoadingCus(true);
        api.get('/customers', { params: { per_page: 500 } })
            .then(res => setCustomers(res.data?.data || res.data || []))
            .catch(() => setCustomers([]))
            .finally(() => setLoadingCus(false));
    }, []);

    useEffect(() => {
        setLoadingVou(true);
        api.get('/vouchers', { params: { per_page: 500 } })
            .then(res => setVouchers(res.data?.data || res.data || []))
            .catch(() => setVouchers([]))
            .finally(() => setLoadingVou(false));
    }, []);

    useEffect(() => {
        if (readOnly) return;
        const hang = Number(form.TONGTIEN_HANG || 0);
        const giam = Number(form.TIEN_GIAM_VOUCHER || 0);
        const total = Math.max(0, hang - giam);
        if (String(form.TONG_THANHTOAN || '') !== String(total || '')) {
            setForm(p => ({ ...p, TONG_THANHTOAN: total }));
        }
    }, [form.TONGTIEN_HANG, form.TIEN_GIAM_VOUCHER, readOnly, setForm]);

    const manv = form.MANV ?? form.nhanVien?.MANV ?? '';
    const makh = form.MAKH ?? form.khachHang?.MAKH ?? '';
    const soVoucher = form.SOVOUCHER ?? form.voucher?.SOVOUCHER ?? '';

    const tenNhanVien = useMemo(() => {
        if (form.nhanVien?.TENNV) return form.nhanVien.TENNV;
        const match = employees.find(e => String(e.MANV) === String(manv));
        return match?.TENNV || '';
    }, [employees, form.nhanVien, manv]);

    const tenKhachHang = useMemo(() => {
        if (form.khachHang?.TENKH) return form.khachHang.TENKH;
        const match = customers.find(c => String(c.MAKH) === String(makh));
        return match?.TENKH || '';
    }, [customers, form.khachHang, makh]);

    return (
        <>
            {readOnly && (
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Mã hóa đơn</label>
                        <input className="form-input" value={form.MAHD || '—'} readOnly />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Trạng thái</label>
                        <input className="form-input" value={Number(form.TRANGTHAI) === 1 ? 'Đã thanh toán' : 'Chờ thanh toán'} readOnly />
                    </div>
                </div>
            )}

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Ngày lập</label>
                    <input className="form-input" type="date" name="NGAYHD" value={(form.NGAYHD || '').slice(0, 10)} onChange={hc} readOnly={readOnly} style={errStyle(errors, 'NGAYHD')} />
                    <FieldError errors={errors} name="NGAYHD" />
                </div>
                <div className="form-group">
                    <label className="form-label">Hình thức</label>
                    {readOnly ? (
                        <input className="form-input" value={form.HINHTHUC || '—'} readOnly />
                    ) : (
                        <select className="form-select" name="HINHTHUC" value={form.HINHTHUC || ''} onChange={hc} style={errStyle(errors, 'HINHTHUC')}>
                            {!form.HINHTHUC && <option value="">-- Chọn hình thức --</option>}
                            {form.HINHTHUC && !['Tiền mặt', 'Chuyển khoản', 'Thẻ'].includes(form.HINHTHUC) && (
                                <option value={form.HINHTHUC}>{form.HINHTHUC}</option>
                            )}
                            <option value="Tiền mặt">Tiền mặt</option>
                            <option value="Chuyển khoản">Chuyển khoản</option>
                            <option value="Thẻ">Thẻ</option>
                        </select>
                    )}
                    <FieldError errors={errors} name="HINHTHUC" />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Nhân viên</label>
                    {readOnly ? (
                        <input className="form-input" value={tenNhanVien ? `${tenNhanVien}${manv ? ` (#${manv})` : ''}` : '—'} readOnly />
                    ) : (
                        <select className="form-select" name="MANV" value={manv} onChange={hc} disabled={loadingEmp} style={errStyle(errors, 'MANV')}>
                            <option value="">{loadingEmp ? 'Đang tải...' : '-- Chọn nhân viên --'}</option>
                            {employees.map(e => (
                                <option key={e.MANV} value={e.MANV}>#{e.MANV} · {e.TENNV}</option>
                            ))}
                        </select>
                    )}
                    <FieldError errors={errors} name="MANV" />
                </div>
                <div className="form-group">
                    <label className="form-label">Khách hàng</label>
                    {readOnly ? (
                        <input className="form-input" value={tenKhachHang ? `${tenKhachHang}${makh ? ` (#${makh})` : ''}` : 'Khách lẻ'} readOnly />
                    ) : (
                        <select className="form-select" name="MAKH" value={makh} onChange={hc} disabled={loadingCus} style={errStyle(errors, 'MAKH')}>
                            <option value="">{loadingCus ? 'Đang tải...' : '-- Khách lẻ --'}</option>
                            {customers.map(c => (
                                <option key={c.MAKH} value={c.MAKH}>#{c.MAKH} · {c.TENKH}</option>
                            ))}
                        </select>
                    )}
                    <FieldError errors={errors} name="MAKH" />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Tổng tiền hàng (₫)</label>
                    <input className="form-input" type="number" name="TONGTIEN_HANG" value={form.TONGTIEN_HANG || ''} onChange={hc} readOnly={readOnly} style={errStyle(errors, 'TONGTIEN_HANG')} />
                    <FieldError errors={errors} name="TONGTIEN_HANG" />
                </div>
                <div className="form-group">
                    <label className="form-label">Giảm voucher (₫)</label>
                    <input className="form-input" type="number" name="TIEN_GIAM_VOUCHER" value={form.TIEN_GIAM_VOUCHER || ''} onChange={hc} readOnly={readOnly} style={errStyle(errors, 'TIEN_GIAM_VOUCHER')} />
                    <FieldError errors={errors} name="TIEN_GIAM_VOUCHER" />
                </div>
                <div className="form-group">
                    <label className="form-label">Tổng thanh toán (₫)</label>
                    <input className="form-input" type="number" name="TONG_THANHTOAN" value={form.TONG_THANHTOAN || ''} onChange={hc} readOnly={readOnly} style={errStyle(errors, 'TONG_THANHTOAN')} />
                    <FieldError errors={errors} name="TONG_THANHTOAN" />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Voucher</label>
                    {readOnly ? (
                        <input className="form-input" value={soVoucher || '—'} readOnly />
                    ) : (
                        <select className="form-select" name="SOVOUCHER" value={soVoucher} onChange={hc} disabled={loadingVou} style={errStyle(errors, 'SOVOUCHER')}>
                            <option value="">{loadingVou ? 'Đang tải...' : '-- Không áp dụng --'}</option>
                            {vouchers.map(v => (
                                <option key={v.SOVOUCHER} value={v.SOVOUCHER}>{v.SOVOUCHER} · {v.MAVOUCHER || v.MOTA || 'Voucher'}</option>
                            ))}
                        </select>
                    )}
                    <FieldError errors={errors} name="SOVOUCHER" />
                </div>
                {!readOnly && (
                    <div className="form-group">
                        <label className="form-label">Trạng thái</label>
                        <select className="form-select" name="TRANGTHAI" value={String(form.TRANGTHAI ?? 0)} onChange={e => setForm(p => ({ ...p, TRANGTHAI: Number(e.target.value) }))}>
                            <option value="0">Chờ thanh toán</option>
                            <option value="1">Đã thanh toán</option>
                        </select>
                    </div>
                )}
            </div>
        </>
    );
};
