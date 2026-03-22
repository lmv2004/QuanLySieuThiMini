import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Ico } from '../../components/Manage/Icons';
import { fmtVND } from '../../components/Manage/Shared';
import api from '../../services/api';
import authService from '../../services/authService';
import { Toast } from '../../components/Manage/Toast';
import './InvoicesPage.css';

const HINHTHUC_OPTIONS = [
    { value: 'Tiền mặt', label: 'Tiền mặt', icon: '💵' },
    { value: 'Chuyển khoản', label: 'Chuyển khoản', icon: '🏦' },
    { value: 'Thẻ', label: 'Thẻ', icon: '💳' },
];

const QUICK_CASH = [50000, 100000, 200000, 500000, 1000000];

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
    const [customers, setCustomers] = useState([]);
    const [vouchers, setVouchers] = useState([]);
    const [cashier, setCashier] = useState(null);
    const [barcode, setBarcode] = useState('');
    const [cart, setCart] = useState([]);
    const [customerId, setCustomerId] = useState('');
    const [voucherCode, setVoucherCode] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Tiền mặt');
    const [cashGiven, setCashGiven] = useState('');
    const [toasts, setToasts] = useState([]);
    const [orderNumber] = useState(() => `#HD-${Math.floor(Math.random() * 9000) + 1000}`);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const barcodeRef = useRef(null);
    const searchRef = useRef(null);
    const searchTimerRef = useRef(null);
    const searchBlurTimerRef = useRef(null);

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
        api.get('/customers', { params: { per_page: 1000 } })
            .then(res => setCustomers(normalizeList(res)))
            .catch(() => setCustomers([]));
    }, []);

    useEffect(() => {
        api.get('/vouchers', { params: { per_page: 1000 } })
            .then(res => setVouchers(normalizeList(res)))
            .catch(() => setVouchers([]));
    }, []);

    // Auto-focus barcode input on mount
    useEffect(() => {
        barcodeRef.current?.focus();
        return () => {
            clearTimeout(searchTimerRef.current);
            clearTimeout(searchBlurTimerRef.current);
        };
    }, []);

    // Product search by name (debounced)
    const handleSearchChange = useCallback((e) => {
        const q = e.target.value;
        setSearchQuery(q);
        if (!q.trim()) {
            setSearchResults([]);
            setShowSearchResults(false);
            return;
        }
        setSearchLoading(true);
        setShowSearchResults(true);
        clearTimeout(searchTimerRef.current);
        searchTimerRef.current = setTimeout(async () => {
            try {
                const res = await api.get('/products', { params: { search: q.trim(), per_page: 10 } });
                const list = Array.isArray(res) ? res : (res?.data?.data || res?.data || []);
                setSearchResults(list.filter(p => !p.IS_DELETED));
            } catch {
                setSearchResults([]);
            } finally {
                setSearchLoading(false);
            }
        }, 300);
    }, []);

    const handleClearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
        setShowSearchResults(false);
    };

    const handleSelectSearchResult = (product) => {
        addToCart(product);
        handleClearSearch();
    };

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
        const activeLots = Array.isArray(product.tonKhos)
            ? product.tonKhos.filter(t => t.IS_ACTIVE && Number(t.SOLUONG_CON_LAI) > 0)
            : [];
        const totalStock = activeLots.reduce((s, t) => s + Number(t.SOLUONG_CON_LAI || 0), 0);
        if (totalStock <= 0) {
            addToast('warning', `San pham ${product.TENSP} da het hang`);
            return;
        }
        const lot = activeLots.sort((a, b) => String(a.HANSUDUNG || '').localeCompare(String(b.HANSUDUNG || '')))[0];
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
                TONKHO_ID: lot?.ID ?? null,
                TONKHO_TONG: totalStock,
            }];
        });
    };

    const changeQty = (MASP, delta) => {
        setCart(prev =>
            prev.map(c => {
                if (c.MASP !== MASP) return c;
                const qty = c.SOLUONG + delta;
                
                // Kiểm tra tồn kho khi tăng số lượng
                if (delta > 0 && qty > c.TONKHO_TONG) {
                    addToast('warning', `Sản phẩm ${c.TENSP} chỉ còn ${c.TONKHO_TONG} cái`);
                    return c; // Giữ nguyên số lượng cũ
                }
                
                if (qty <= 0) return null;
                return { ...c, SOLUONG: qty, THANHTIEN: qty * c.GIABAN_THUCTE };
            }).filter(Boolean)
        );
    };

    const removeItem = (MASP) => setCart(prev => prev.filter(c => c.MASP !== MASP));

    const handleBarcodeSubmit = async (e) => {
        e.preventDefault();
        const code = barcode.trim();
        if (!code) return;
        try {
            const res = await api.get(`/products/barcode/${code}`);
            const product = res?.data || res;
            if (!product) {
                addToast('warning', `Không tìm thấy sản phẩm với barcode ${code}`);
                return;
            }
            addToCart(product);
            setBarcode('');
        } catch (err) {
            addToast('warning', `Không tìm thấy sản phẩm với barcode ${code}`);
        } finally {
            barcodeRef.current?.focus();
        }
    };

    const handleClearCart = () => {
        if (cart.length === 0) return;
        if (window.confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) {
            setCart([]);
            barcodeRef.current?.focus();
        }
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
            barcodeRef.current?.focus();
        } catch (err) {
            console.error(err);
            addToast('error', `Lỗi khi tạo hóa đơn: ${err.response?.data?.message || err.message}`);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="invoices-pos">
            <div className="toast-container">
                {toasts.map(t => (
                    <Toast key={t.id} type={t.type} message={t.message} onClose={() => removeToast(t.id)} />
                ))}
            </div>

            {/* Header Card */}
            <div className="pos-header-card">
                <div className="pos-header-left">
                    <div className="pos-receipt-icon">{Ico.receipt}</div>
                    <div>
                        <div className="pos-header-title">Tạo Hóa Đơn Bán Hàng</div>
                        <div className="pos-header-sub">Quét barcode hoặc tìm kiếm sản phẩm để bán</div>
                    </div>
                </div>
                <div className="pos-header-right">
                    <div className="pos-cashier-info">
                        <div className="pos-cashier-badge">{cashier?.TENNV || 'Chưa đăng nhập'}</div>
                        <div className="pos-cashier-role">{cashier?.chucVu?.TENCHUCVU || 'Nhân viên'}</div>
                    </div>
                    <div className="pos-order-num">{orderNumber}</div>
                </div>
            </div>

            <div className="pos-container">
                {/* Left: Products and Barcode */}
                <div className="pos-left">
                    <div className="pos-barcode-card">
                        <div className="pos-barcode-label">📦 Thêm Sản Phẩm</div>
                        <form className="pos-barcode-form" onSubmit={handleBarcodeSubmit}>
                            <input
                                ref={barcodeRef}
                                value={barcode}
                                onChange={(e) => setBarcode(e.target.value)}
                                placeholder="Quét hoặc nhập barcode rồi nhấn Enter..."
                                className="pos-barcode-input"
                            />
                            <button type="submit" className="pos-add-btn">+ Thêm</button>
                        </form>
                        {/* Product name search */}
                        <div className="pos-search-wrapper" ref={searchRef}>
                            <div className="pos-search-row">
                                <span className="pos-search-icon">🔍</span>
                                <input
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    onFocus={() => searchQuery && setShowSearchResults(true)}
                                onBlur={() => { searchBlurTimerRef.current = setTimeout(() => setShowSearchResults(false), 150); }}
                                    placeholder="Tìm theo tên sản phẩm..."
                                    className="pos-search-input"
                                />
                                {searchQuery && (
                                    <button className="pos-search-clear" onClick={handleClearSearch}>✕</button>
                                )}
                            </div>
                            {showSearchResults && (
                                <div className="pos-search-results">
                                    {searchLoading && <div className="pos-search-loading">Đang tìm...</div>}
                                    {!searchLoading && searchResults.length === 0 && (
                                        <div className="pos-search-empty">Không tìm thấy sản phẩm</div>
                                    )}
                                    {searchResults.map(p => {
                                        const activeLots = Array.isArray(p.tonKhos) ? p.tonKhos.filter(t => t.IS_ACTIVE && Number(t.SOLUONG_CON_LAI) > 0) : [];
                                        const stock = activeLots.reduce((s, t) => s + Number(t.SOLUONG_CON_LAI || 0), 0);
                                        return (
                                            <button key={p.MASP} className="pos-search-item" onMouseDown={() => handleSelectSearchResult(p)}>
                                                <div className="pos-search-item-info">
                                                    <span className="pos-search-item-name">{p.TENSP}</span>
                                                    <span className="pos-search-item-meta">{p.BARCODE && <span className="pos-search-barcode">{p.BARCODE}</span>} · {p.DVT}</span>
                                                </div>
                                                <div className="pos-search-item-right">
                                                    <span className="pos-search-item-price">{fmtVND(p.GIABAN)}</span>
                                                    <span className={`pos-search-item-stock ${stock === 0 ? 'out' : stock < 5 ? 'low' : ''}`}>
                                                        {stock === 0 ? 'Hết hàng' : `Còn: ${stock}`}
                                                    </span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Cart Items */}
                    <div className="pos-cart-card">
                        <div className="pos-cart-header">
                            <h3 className="pos-cart-title">🛒 Giỏ Hàng</h3>
                            <span className="pos-cart-count">{cart.length} sản phẩm</span>
                        </div>
                        <div className="pos-cart-list">
                            {cart.length === 0 ? (
                                <div className="pos-empty-cart">
                                    <div className="pos-empty-icon">📭</div>
                                    <p>Giỏ hàng trống</p>
                                    <span>Quét barcode hoặc tìm tên sản phẩm để bắt đầu</span>
                                </div>
                            ) : (
                                cart.map(item => {
                                    const atLimit = item.SOLUONG >= item.TONKHO_TONG;
                                    return (
                                        <div key={item.MASP} className={`pos-cart-row${atLimit ? ' at-limit' : ''}`}>
                                            <div className="pos-item-info">
                                                <div className="pos-item-name">{item.TENSP}</div>
                                                <div className="pos-item-meta">
                                                    <span className="pos-item-price">{fmtVND(item.GIABAN_THUCTE)}</span>
                                                    <span className={`pos-item-stock ${atLimit ? 'low' : ''}`}>
                                                        Còn: {item.TONKHO_TONG - item.SOLUONG}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="pos-item-qty">
                                                <button onClick={() => changeQty(item.MASP, -1)}>−</button>
                                                <span>{item.SOLUONG}</span>
                                                <button onClick={() => changeQty(item.MASP, 1)} disabled={atLimit}>+</button>
                                            </div>
                                            <div className="pos-item-total">{fmtVND(item.THANHTIEN)}</div>
                                            <button className="pos-item-remove" onClick={() => removeItem(item.MASP)}>{Ico.x}</button>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Checkout Panel */}
                <div className="pos-right">
                    {/* Customer & Voucher */}
                    <div className="pos-sidebar-card">
                        <h3 className="pos-sidebar-title">👤 Thông Tin Giao Dịch</h3>
                        <div className="pos-form-group">
                            <label>Khách hàng</label>
                            <select value={customerId} onChange={(e) => setCustomerId(e.target.value)} className="pos-form-select">
                                <option value="">👤 Khách lẻ</option>
                                {customers.map(c => (
                                    <option key={c.MAKH} value={c.MAKH}>
                                        {c.TENKH} ({c.DIEMTHUONG || 0} điểm)
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="pos-form-group">
                            <label>Voucher</label>
                            <select value={voucherCode} onChange={(e) => setVoucherCode(e.target.value)} className="pos-form-select">
                                <option value="">— Không dùng</option>
                                {vouchers.map(v => (
                                    <option key={v.SOVOUCHER} value={v.SOVOUCHER}>
                                        {v.SOVOUCHER} ({v.MOTA || 'Voucher'})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="pos-sidebar-card">
                        <h3 className="pos-sidebar-title">💳 Hình Thức Thanh Toán</h3>
                        <div className="pos-payment-methods">
                            {HINHTHUC_OPTIONS.map(opt => (
                                <button
                                    key={opt.value}
                                    className={`pos-payment-btn ${paymentMethod === opt.value ? 'active' : ''}`}
                                    onClick={() => setPaymentMethod(opt.value)}
                                >
                                    {opt.icon} {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Bill Summary */}
                    <div className="pos-bill-card">
                        <div className="pos-bill-item">
                            <span>Tạm tính</span>
                            <span className="pos-amount">{fmtVND(subtotal)}</span>
                        </div>
                        {discount > 0 && (
                            <div className="pos-bill-item discount">
                                <span>Giảm giá</span>
                                <span className="pos-discount-amt">-{fmtVND(discount)}</span>
                            </div>
                        )}
                        <div className="pos-bill-divider" />
                        <div className="pos-bill-total">
                            <span>Tổng Cần Thanh Toán</span>
                            <span>{fmtVND(total)}</span>
                        </div>
                        {paymentMethod === 'Tiền mặt' && (
                            <>
                                <div className="pos-form-group" style={{ marginTop: '12px' }}>
                                    <label>Tiền khách đưa</label>
                                    <input
                                        type="number"
                                        value={cashGiven}
                                        onChange={(e) => setCashGiven(e.target.value)}
                                        placeholder="Nhập số tiền..."
                                        className="pos-form-input"
                                    />
                                    <div className="pos-quick-cash">
                                        {QUICK_CASH.map(amt => (
                                            <button key={amt} className="pos-quick-cash-btn" onClick={() => setCashGiven(String(amt))}>
                                                {amt >= 1000000 ? `${amt / 1000000}M` : `${amt / 1000}k`}
                                            </button>
                                        ))}
                                        {total > 0 && (
                                            <button className="pos-quick-cash-btn exact" onClick={() => setCashGiven(String(total))}>
                                                Đúng tiền
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="pos-bill-item change">
                                    <span>Tiền thừa</span>
                                    <span className="pos-change-amt">{fmtVND(change)}</span>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="pos-actions-group">
                        <button
                            className="pos-btn pos-btn-primary"
                            onClick={handleCheckout}
                            disabled={cart.length === 0 || (paymentMethod === 'Tiền mặt' && cashGivenNum < total && total > 0)}
                            title={cart.length === 0 ? 'Giỏ hàng đang trống' : (paymentMethod === 'Tiền mặt' && cashGivenNum < total && total > 0) ? 'Tiền khách đưa chưa đủ' : ''}
                        >
                            ✓ Thanh Toán
                        </button>
                        <button className="pos-btn pos-btn-secondary" onClick={handlePrint}>
                            🖨️ In Hóa Đơn
                        </button>
                        <button className="pos-btn pos-btn-ghost" onClick={handleClearCart} disabled={cart.length === 0}>
                            🗑️ Xóa Giỏ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
