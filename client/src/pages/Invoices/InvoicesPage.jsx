import React, { useEffect, useMemo, useState } from 'react';
import { Ico } from '../../components/Manage/Icons';
import { fmtVND } from '../../components/Manage/Shared';
import api from '../../services/api';
import authService from '../../services/authService';
import { Toast } from '../../components/Manage/Toast';
import './InvoicesPage.css';

const HINHTHUC_OPTIONS = [
    { value: 'Tiền mặt', label: 'Tiền mặt' },
    { value: 'Chuyển khoản', label: 'Chuyển khoản' },
    { value: 'Thẻ', label: 'Thẻ' },
];

const normalizeList = (res) => {
    if (Array.isArray(res)) return res;
    return res?.data || [];
};

const calcVoucherDiscount = (subtotal, voucher) => {
    if (!voucher || subtotal <= 0) return 0;
    if (voucher.GIATRITOITHIEU && subtotal < Number(voucher.GIATRITOITHIEU)) return 0;
    let discount = 0;
    if (voucher.PTGIAM) {
        discount = subtotal * (Number(voucher.PTGIAM) / 100);
    } else if (voucher.KMTOITHIEU) {
        discount = Number(voucher.KMTOITHIEU);
    }
    if (voucher.KMTOIDA) {
        discount = Math.min(discount, Number(voucher.KMTOIDA));
    }
    return Math.max(0, Math.round(discount));
};

export const InvoicesPage = () => {
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [vouchers, setVouchers] = useState([]);
    const [cashier, setCashier] = useState(null);
    const [search, setSearch] = useState('');
    const [barcode, setBarcode] = useState('');
    const [cart, setCart] = useState([]);
    const [customerId, setCustomerId] = useState('');
    const [voucherCode, setVoucherCode] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Tiền mặt');
    const [cashGiven, setCashGiven] = useState('');
    const [toasts, setToasts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);

    const addToast = (type, message) => {
        const id = Date.now();
        setToasts(p => [...p, { id, type, message }]);
    };

    const removeToast = (id) => setToasts(p => p.filter(t => t.id !== id));

    useEffect(() => {
        authService.getCurrentUser()
            .then(res => setCashier(res?.user || null))
            .catch(() => setCashier(null));
    }, []);

    useEffect(() => {
        setLoadingProducts(true);
        api.get('/products', { params: { per_page: 1000 } })
            .then(res => setProducts(normalizeList(res)))
            .catch(() => setProducts([]))
            .finally(() => setLoadingProducts(false));
    }, []);

    useEffect(() => {
        api.get('/customers', { params: { per_page: 1000 } })
            .then(res => setCustomers(normalizeList(res)))
            .catch(() => setCustomers([]));
    }, []);

    useEffect(() => {
        api.get('/vouchers', { params: { per_page: 1000 } })
            .then(res => setVouchers(normalizeList(res)))
            .catch(() => setVouchers([]));
    }, []);

    const filteredProducts = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return products;
        return products.filter(p =>
            String(p.TENSP || '').toLowerCase().includes(q) ||
            String(p.BARCODE || '').toLowerCase().includes(q)
        );
    }, [products, search]);

    const selectedVoucher = useMemo(
        () => vouchers.find(v => String(v.SOVOUCHER) === String(voucherCode)),
        [vouchers, voucherCode]
    );

    const subtotal = useMemo(
        () => cart.reduce((s, c) => s + c.THANHTIEN, 0),
        [cart]
    );

    const discount = useMemo(
        () => calcVoucherDiscount(subtotal, selectedVoucher),
        [subtotal, selectedVoucher]
    );

    const total = Math.max(0, subtotal - discount);
    const cashGivenNum = Number(cashGiven || 0);
    const change = paymentMethod === 'Tiền mặt' ? Math.max(0, cashGivenNum - total) : 0;

    const addToCart = (product) => {
        if (!product || product.IS_DELETED) return;
        setCart(prev => {
            const existing = prev.find(c => c.MASP === product.MASP);
            if (existing) {
                return prev.map(c => c.MASP === product.MASP
                    ? { ...c, SOLUONG: c.SOLUONG + 1, THANHTIEN: (c.SOLUONG + 1) * c.GIABAN_THUCTE }
                    : c
                );
            }
            const price = Number(product.GIABAN || 0);
            return [...prev, {
                MASP: product.MASP,
                TENSP: product.TENSP,
                BARCODE: product.BARCODE,
                DVT: product.DVT,
                GIABAN_GOC: price,
                GIABAN_THUCTE: price,
                SOLUONG: 1,
                THANHTIEN: price,
            }];
        });
    };

    const changeQty = (MASP, delta) => {
        setCart(prev =>
            prev.map(c => {
                if (c.MASP !== MASP) return c;
                const qty = c.SOLUONG + delta;
                if (qty <= 0) return null;
                return { ...c, SOLUONG: qty, THANHTIEN: qty * c.GIABAN_THUCTE };
            }).filter(Boolean)
        );
    };

    const removeItem = (MASP) => setCart(prev => prev.filter(c => c.MASP !== MASP));

    const handleBarcodeSubmit = (e) => {
        e.preventDefault();
        const code = barcode.trim();
        if (!code) return;
        const found = products.find(p => String(p.BARCODE) === code);
        if (!found) {
            addToast('warning', `Không tìm thấy sản phẩm với barcode ${code}`);
            return;
        }
        addToCart(found);
        setBarcode('');
    };

    const handleCheckout = async () => {
        if (cart.length === 0) {
            addToast('warning', 'Giỏ hàng đang trống');
            return;
        }
        if (!cashier?.MANV) {
            addToast('error', 'Không xác định được nhân viên thu ngân');
            return;
        }
        if (paymentMethod === 'Tiền mặt' && cashGivenNum < total) {
            addToast('warning', 'Số tiền khách đưa chưa đủ');
            return;
        }

        try {
            const payload = {
                NGAYHD: new Date().toISOString().slice(0, 19).replace('T', ' '),
                HINHTHUC: paymentMethod,
                TONGTIEN_HANG: subtotal,
                TIEN_GIAM_VOUCHER: discount,
                TONG_THANHTOAN: total,
                TRANGTHAI: 1,
                MANV: cashier.MANV,
                MAKH: customerId || null,
                SOVOUCHER: voucherCode || null,
            };

            await api.post('/invoices', payload);
            addToast('success', 'Đã tạo hóa đơn thành công');
            setCart([]);
            setCustomerId('');
            setVoucherCode('');
            setCashGiven('');
        } catch (err) {
            addToast('error', err?.message || 'Lỗi khi tạo hóa đơn');
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="invoices-pos">
            <div className="pos-toast">
                {toasts.map(t => (
                    <Toast key={t.id} type={t.type} message={t.message} onClose={() => removeToast(t.id)} />
                ))}
            </div>

            <div className="pos-header">
                <div className="pos-title">
                    <div className="pos-title-icon">{Ico.receipt}</div>
                    <div>
                        <div className="pos-title-text">Bán hàng / Tính tiền</div>
                        <div className="pos-title-sub">Quét barcode hoặc chọn sản phẩm để tạo hóa đơn</div>
                    </div>
                </div>
                <div className="pos-cashier">
                    <div className="pos-cashier-label">Thu ngân</div>
                    <div className="pos-cashier-name">
                        {cashier?.TENNV || '—'}
                        <span>{cashier?.chucVu?.TENCHUCVU || 'Nhân viên'}</span>
                    </div>
                </div>
            </div>

            <div className="pos-grid">
                <section className="pos-panel">
                    <div className="pos-panel-head">
                        <div className="pos-panel-title">Sản phẩm</div>
                        <form className="pos-barcode" onSubmit={handleBarcodeSubmit}>
                            <span>{Ico.search}</span>
                            <input
                                value={barcode}
                                onChange={(e) => setBarcode(e.target.value)}
                                placeholder="Quet/nhap barcode"
                            />
                            <button type="submit">Them</button>
                        </form>
                    </div>

                    <div className="pos-search">
                        <span>{Ico.search}</span>
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Tim san pham theo ten hoac barcode"
                        />
                    </div>

                    <div className="pos-products">
                        {loadingProducts ? (
                            <div className="pos-empty">Dang tai san pham...</div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="pos-empty">Khong tim thay san pham phu hop</div>
                        ) : (
                            <div className="pos-product-grid">
                                {filteredProducts.map((sp) => (
                                    <button key={sp.MASP} className="pos-product-card" onClick={() => addToCart(sp)}>
                                        <div className="pos-product-name">{sp.TENSP}</div>
                                        <div className="pos-product-barcode">{sp.BARCODE || '—'}</div>
                                        <div className="pos-product-foot">
                                            <span className="pos-product-price">{fmtVND(sp.GIABAN || 0)}</span>
                                            <span className="pos-product-unit">{sp.DVT || '—'}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                <aside className="pos-panel pos-cart">
                    <div className="pos-panel-head">
                        <div className="pos-panel-title">Gio hang</div>
                        <div className="pos-panel-sub">{cart.length} san pham</div>
                    </div>

                    <div className="pos-cart-items">
                        {cart.length === 0 ? (
                            <div className="pos-empty">Chua co san pham trong gio</div>
                        ) : (
                            cart.map(item => (
                                <div key={item.MASP} className="pos-cart-item">
                                    <div className="pos-cart-info">
                                        <div className="pos-cart-name">{item.TENSP}</div>
                                        <div className="pos-cart-sub">{fmtVND(item.GIABAN_THUCTE)} / {item.DVT}</div>
                                    </div>
                                    <div className="pos-cart-qty">
                                        <button onClick={() => changeQty(item.MASP, -1)}>-</button>
                                        <span>{item.SOLUONG}</span>
                                        <button onClick={() => changeQty(item.MASP, 1)}>+</button>
                                    </div>
                                    <div className="pos-cart-total">{fmtVND(item.THANHTIEN)}</div>
                                    <button className="pos-cart-remove" onClick={() => removeItem(item.MASP)}>{Ico.x}</button>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="pos-form">
                        <div className="pos-form-row">
                            <label>Khach hang</label>
                            <select value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
                                <option value="">Khach le</option>
                                {customers.map(c => (
                                    <option key={c.MAKH} value={c.MAKH}>
                                        #{c.MAKH} · {c.TENKH} ({c.DIEMTHUONG || 0} diem)
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="pos-form-row">
                            <label>Voucher</label>
                            <select value={voucherCode} onChange={(e) => setVoucherCode(e.target.value)}>
                                <option value="">Khong ap dung</option>
                                {vouchers.map(v => (
                                    <option key={v.SOVOUCHER} value={v.SOVOUCHER}>
                                        {v.SOVOUCHER} · {v.MAVOUCHER || v.MOTA || 'Voucher'}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="pos-form-row">
                            <label>Hinh thuc thanh toan</label>
                            <div className="pos-methods">
                                {HINHTHUC_OPTIONS.map(opt => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        className={paymentMethod === opt.value ? 'active' : ''}
                                        onClick={() => setPaymentMethod(opt.value)}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="pos-summary">
                        <div className="pos-summary-row">
                            <span>Tam tinh</span>
                            <span>{fmtVND(subtotal)}</span>
                        </div>
                        <div className="pos-summary-row">
                            <span>Giam voucher</span>
                            <span>-{fmtVND(discount)}</span>
                        </div>
                        <div className="pos-summary-row total">
                            <span>Tong thanh toan</span>
                            <span>{fmtVND(total)}</span>
                        </div>
                        <div className="pos-summary-row">
                            <span>Tien khach dua</span>
                            <input
                                type="number"
                                value={cashGiven}
                                onChange={(e) => setCashGiven(e.target.value)}
                                placeholder="0"
                                disabled={paymentMethod !== 'Tiền mặt'}
                            />
                        </div>
                        <div className="pos-summary-row">
                            <span>Tien thua</span>
                            <span className="pos-change">{fmtVND(change)}</span>
                        </div>
                    </div>

                    <div className="pos-actions">
                        <button className="btn-primary" onClick={handleCheckout}>Thanh toan</button>
                        <button className="btn-secondary" onClick={handlePrint}>In hoa don</button>
                        <button className="btn-ghost" onClick={() => setCart([])}>Xoa gio</button>
                    </div>
                </aside>
            </div>
        </div>
    );
};
