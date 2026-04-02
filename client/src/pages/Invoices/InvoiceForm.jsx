import React, { useEffect, useMemo, useState } from 'react';
import api from '../../services/api';
import { fmtDateTime } from '../../components/Manage/Shared';

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

    // Fetch chi tiết hóa đơn từ API khi mở modal view/edit
    useEffect(() => {
        if (form.MAHD && (mode === 'view' || mode === 'edit')) {
            api.get(`/invoices/${form.MAHD}`)
                .then(res => {
                    const data = res.data?.data || res.data;
                    setForm(p => ({
                        ...p,
                        ...data,
                        nhanVien: data.nhanVien || p.nhanVien,
                        khachHang: data.khachHang || p.khachHang,
                        voucher: data.voucher || p.voucher,
                        chiTiets: data.chiTiets || p.chiTiets || []
                    }));
                })
                .catch(err => console.error('Fetch invoice detail error:', err));
        }
    }, [form.MAHD, mode, setForm]);

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

    const statusLabel = Number(form.TRANGTHAI) === 1 ? 'Da thanh toan' : 'Cho thanh toan';
    const totalText = Number(form.TONG_THANHTOAN || 0).toLocaleString('vi-VN');
    const tonTienHang = Number(form.TONGTIEN_HANG || 0).toLocaleString('vi-VN');
    const tienGiam = Number(form.TIEN_GIAM_VOUCHER || 0).toLocaleString('vi-VN');

    return (
        <div className="invoice-form-container">
            {readOnly && (
                <div className="invoice-summary-box">
                    <div className="summary-item">
                        <span className="summary-label">Mã HĐ</span>
                        <span className="summary-value">{form.MAHD || '—'}</span>
                    </div>
                    <div className="summary-item">
                        <span className="summary-label">Ngày giờ lập</span>
                        <span className="summary-value">{fmtDateTime(form.NGAYHD)}</span>
                    </div>
                    <div className="summary-item">
                        <span className="summary-label">Trạng thái</span>
                        <span className={`summary-badge ${Number(form.TRANGTHAI) === 1 ? 'badge-paid' : 'badge-pending'}`}>
                            {Number(form.TRANGTHAI) === 1 ? 'Đã thanh toán' : 'Chờ thanh toán'}
                        </span>
                    </div>
                    <div className="summary-item">
                        <span className="summary-label">Tổng tiền hàng</span>
                        <span className="summary-value">₫{tonTienHang}</span>
                    </div>
                    <div className="summary-item">
                        <span className="summary-label">Giảm voucher</span>
                        <span className="summary-value">{soVoucher ? '₫' + tienGiam : 'Không dùng'}</span>
                    </div>
                    <div className="summary-item">
                        <span className="summary-label">Tổng thanh toán</span>
                        <span className="summary-total">₫{totalText}</span>
                    </div>
                </div>
            )}

            <div className="form-section">
                <h3 className="form-section-title">Thông tin chung</h3>
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
                </div>
                <div className="form-row">
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
                    {!readOnly && (
                        <div className="form-group">
                            <label className="form-label">Trạng thái</label>
                            <select className="form-select" name="TRANGTHAI" value={String(form.TRANGTHAI ?? 0)} onChange={e => setForm(p => ({ ...p, TRANGTHAI: Number(e.target.value) }))}>
                                <option value="0">Chờ thanh toán</option>
                                <option value="1">Đã thanh toán</option>
                            </select>
                        </div>
                    )}
                    {readOnly && (
                        <div className="form-group">
                            <label className="form-label">Trạng thái</label>
                            <input className="form-input" value={Number(form.TRANGTHAI) === 1 ? 'Đã thanh toán' : 'Chờ thanh toán'} readOnly />
                        </div>
                    )}
                </div>
            </div>

            <div className="form-section">
                <h3 className="form-section-title">Tổng tiền & Voucher</h3>
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Tổng tiền hàng (₫)</label>
                        <input className="form-input" type="number" name="TONGTIEN_HANG" value={form.TONGTIEN_HANG || ''} onChange={hc} readOnly={readOnly} style={errStyle(errors, 'TONGTIEN_HANG')} />
                        <FieldError errors={errors} name="TONGTIEN_HANG" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Voucher</label>
                        {readOnly ? (
                            <input className="form-input" value={soVoucher ? soVoucher : 'Không dùng voucher'} readOnly />
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
                    <div className="form-group">
                        <label className="form-label">Giảm voucher (₫)</label>
                        <input className="form-input" type="number" name="TIEN_GIAM_VOUCHER" value={form.TIEN_GIAM_VOUCHER || ''} onChange={hc} readOnly={readOnly} placeholder="0" style={errStyle(errors, 'TIEN_GIAM_VOUCHER')} />
                        <FieldError errors={errors} name="TIEN_GIAM_VOUCHER" />
                    </div>
                </div>
                <div className="form-group full-width">
                    <label className="form-label">Tổng thanh toán (₫)</label>
                    <input className="form-input total-amount" type="number" name="TONG_THANHTOAN" value={form.TONG_THANHTOAN || ''} onChange={hc} readOnly={readOnly} placeholder="0" style={errStyle(errors, 'TONG_THANHTOAN')} />
                    <FieldError errors={errors} name="TONG_THANHTOAN" />
                </div>
            </div>

            <div className="form-section">
                <h3 className="form-section-title">Chi tiết sản phẩm</h3>
                {form.chiTiets && form.chiTiets.length > 0 ? (
                    <div className="invoice-items-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Sản phẩm</th>
                                    <th>Hạn sử dụng</th>
                                    <th>Số lượng</th>
                                    <th>Đơn giá (₫)</th>
                                    <th>Thành tiền (₫)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {form.chiTiets.map((item, idx) => {
                                    const tenSP = item.sanPham?.TENSP || item.TENSP || '—';
                                    const hsd = item.tonKho?.HANSUDUNG ? new Date(item.tonKho.HANSUDUNG).toLocaleDateString('vi-VN') : (item.HANSUDUNG ? new Date(item.HANSUDUNG).toLocaleDateString('vi-VN') : '—');
                                    const soluong = Number(item.SOLUONG || 0);
                                    const dongia = Number(item.GIABAN_THUCTE || item.DONGIA || 0);
                                    const thanhtien = Number(item.THANHTIEN || soluong * dongia);
                                    return (
                                        <tr key={idx}>
                                            <td className="product-name">{tenSP}</td>
                                            <td className="product-hsd">{hsd}</td>
                                            <td className="product-qty">{soluong}</td>
                                            <td className="product-price">{dongia.toLocaleString('vi-VN')}</td>
                                            <td className="product-total">{thanhtien.toLocaleString('vi-VN')}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#999', fontStyle: 'italic' }}>
                        Không có sản phẩm trong hóa đơn
                    </div>
                )}
            </div>
        </div>
    );
};
