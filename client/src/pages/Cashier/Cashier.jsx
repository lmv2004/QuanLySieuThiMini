import React, { useState, useMemo } from 'react';
import Header from '../../components/layout/Header/Header.jsx';
import './Cashier.css';

// ════════════════════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════════════════════
const fmtVND = (v) => Number(v || 0).toLocaleString('vi-VN') + ' ₫';
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '—';
const STOCK_MAX = 300;

// HINHTHUC values (HoaDon.HINHTHUC)
const HINHTHUC_MAP = {
    TIEN_MAT: { label: 'Tiền mặt' },
    THE: { label: 'Thẻ' },
    CHUYEN_KHOAN: { label: 'Chuyển khoản' },
};

// Derived order status (from IS_DELETED + HINHTHUC + business logic)
// PAID     = có HINHTHUC và IS_DELETED=false
// PENDING  = chưa có HINHTHUC và IS_DELETED=false
// CANCELLED= IS_DELETED=true
const getOrderStatus = (hd) => {
    if (hd.IS_DELETED) return 'CANCELLED';
    if (hd.HINHTHUC) return 'PAID';
    return 'PENDING';
};
const STATUS_MAP = {
    PAID: { label: 'Đã thanh toán', cls: 'badge badge-paid' },
    PENDING: { label: 'Chờ duyệt', cls: 'badge badge-pending' },
    CANCELLED: { label: 'Đã hủy', cls: 'badge badge-cancelled' },
};

const totalStock = (tonKhos = []) =>
    tonKhos.filter(t => t.IS_ACTIVE !== false)
        .reduce((s, t) => s + (t.SOLUONG_CON_LAI || 0), 0);

// ════════════════════════════════════════════════════════════
// PAGE 1: TẠO ĐƠN HÀNG
// SanPham: MASP, BARCODE, TENSP, DVT, GIABAN, MALOAI, IS_DELETED
// TonKho:  ID, MASP, SOLUONG_CON_LAI, IS_ACTIVE
// CTHoaDon: MAHD, MASP, ID_TONKHO, SOLUONG, GIABAN_GOC,
//           GIABAN_THUCTE, THANHTIEN
// HoaDon:  MAHD, NGAYHD, HINHTHUC, TONGTIEN_HANG,
//          TIEN_GIAM_VOUCHER, TONG_THANHTOAN, MANV, MAKH
// ════════════════════════════════════════════════════════════
const TaoDoPage = ({ onOrderCreated }) => {
    // TODO: fetch từ API /products?with=tonKhos,giamGias,loaiSanPham
    const [products] = useState([]);
    const [search, setSearch] = useState('');
    // cart item shape: { MASP, TENSP, BARCODE, DVT, GIABAN_GOC,
    //                   GIABAN_THUCTE, SOLUONG, THANHTIEN, ID_TONKHO }
    const [cart, setCart] = useState([]);
    const [sovoucher, setSovoucher] = useState('');

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return products.filter(p =>
            !p.IS_DELETED &&
            (p.TENSP.toLowerCase().includes(q) || p.BARCODE.toLowerCase().includes(q))
        );
    }, [products, search]);

    const addToCart = (sp) => {
        const stock = totalStock(sp.tonKhos);
        if (stock === 0) return;

        // Tính giá thực tế (có thể check giamGias nếu có)
        const activeDiscount = sp.giamGias?.find(g =>
            g.TRANGTHAI && !g.IS_DELETED &&
            new Date(g.NGAYBD) <= new Date() && new Date(g.NGAYKT) >= new Date()
        );
        let giaBanThucTe = Number(sp.GIABAN);
        if (activeDiscount) {
            giaBanThucTe = activeDiscount.LOAI_GIAM === 0
                ? sp.GIABAN * (1 - activeDiscount.GIATRI_GIAM / 100)
                : Math.max(0, sp.GIABAN - activeDiscount.GIATRI_GIAM);
        }

        // Lấy ID_TONKHO từ lô hàng còn hạn sử dụng gần nhất
        const activeLot = sp.tonKhos
            ?.filter(t => t.IS_ACTIVE !== false && t.SOLUONG_CON_LAI > 0)
            ?.sort((a, b) => new Date(a.HANSUDUNG || '9999') - new Date(b.HANSUDUNG || '9999'))[0];

        setCart(prev => {
            const existing = prev.find(c => c.MASP === sp.MASP);
            if (existing) {
                return prev.map(c => c.MASP === sp.MASP
                    ? { ...c, SOLUONG: c.SOLUONG + 1, THANHTIEN: (c.SOLUONG + 1) * c.GIABAN_THUCTE }
                    : c
                );
            }
            return [...prev, {
                MASP: sp.MASP,
                TENSP: sp.TENSP,
                BARCODE: sp.BARCODE,
                DVT: sp.DVT,
                GIABAN_GOC: Number(sp.GIABAN),
                GIABAN_THUCTE: giaBanThucTe,
                SOLUONG: 1,
                THANHTIEN: giaBanThucTe,
                ID_TONKHO: activeLot?.ID ?? null,
            }];
        });
    };

    const changeQty = (MASP, delta) => {
        setCart(prev =>
            prev.map(c => {
                if (c.MASP !== MASP) return c;
                const newQty = c.SOLUONG + delta;
                if (newQty <= 0) return null;
                return { ...c, SOLUONG: newQty, THANHTIEN: newQty * c.GIABAN_THUCTE };
            }).filter(Boolean)
        );
    };

    const removeFromCart = (MASP) => setCart(prev => prev.filter(c => c.MASP !== MASP));

    const TONGTIEN_HANG = cart.reduce((s, c) => s + c.THANHTIEN, 0);
    const TONG_THANHTOAN = TONGTIEN_HANG; // voucher deducted on confirm

    const handleSubmitOrder = () => {
        if (cart.length === 0) return;
        // TODO: POST /orders với body:
        // { NGAYHD: now, MANV: currentUser.MANV, MAKH: null, SOVOUCHER: sovoucher||null,
        //   TONGTIEN_HANG, TIEN_GIAM_VOUCHER: 0, TONG_THANHTOAN,
        //   chiTiets: cart.map(c => ({ MASP:c.MASP, ID_TONKHO:c.ID_TONKHO,
        //               SOLUONG:c.SOLUONG, GIABAN_GOC:c.GIABAN_GOC,
        //               GIABAN_THUCTE:c.GIABAN_THUCTE, THANHTIEN:c.THANHTIEN })) }
        if (onOrderCreated) onOrderCreated();
        setCart([]);
        setSovoucher('');
    };

    return (
        <>
            <div className="c-page-header">
                <div className="c-page-title-block">
                    <div>
                        <div className="c-page-title">Tạo đơn hàng</div>
                        <div className="c-page-sub">Thêm sản phẩm vào giỏ</div>
                    </div>
                </div>
            </div>

            <div className="create-order-layout">
                {/* Left: product search + grid */}
                <div>
                    <div className="c-search-wrap">
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Tìm sản phẩm..."
                        />
                    </div>
                    {filtered.length === 0 && products.length === 0 && (
                        <div style={{ textAlign: 'center', padding: 40, color: 'var(--c-text-muted)' }}>

                        </div>
                    )}
                    <div className="product-grid">
                        {filtered.map((sp, idx) => {
                            const stock = totalStock(sp.tonKhos);
                            const activeDiscount = sp.giamGias?.find(g =>
                                g.TRANGTHAI && !g.IS_DELETED &&
                                new Date(g.NGAYBD) <= new Date() && new Date(g.NGAYKT) >= new Date()
                            );
                            return (
                                <div
                                    key={sp.MASP}
                                    className={`product-card${stock === 0 ? ' out-of-stock' : ''}`}
                                    onClick={() => addToCart(sp)}
                                >
                                    {activeDiscount && (
                                        <span className="product-card-discount">
                                            {activeDiscount.LOAI_GIAM === 0
                                                ? `-${activeDiscount.GIATRI_GIAM}%`
                                                : `-${fmtVND(activeDiscount.GIATRI_GIAM)}`}
                                        </span>
                                    )}
                                    <div className="product-card-name">{sp.TENSP}</div>
                                    <div className="product-card-barcode">{sp.BARCODE}</div>
                                    <div className="product-card-footer">
                                        <span className="product-card-price">{fmtVND(sp.GIABAN)}</span>
                                        <span className={`product-card-stock${stock <= 10 ? ' low' : ''}`}>
                                            {stock === 0 ? 'Hết' : stock}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right: cart */}
                <div className="cart-panel">
                    <div className="cart-title">Giỏ hàng ({cart.length} SP)</div>
                    {cart.length === 0
                        ? <div className="cart-empty">Chưa có sản phẩm </div>
                        : (
                            <>
                                <div className="cart-items">
                                    {cart.map(item => (
                                        <div key={item.MASP} className="cart-item">
                                            <div className="cart-item-info">
                                                <div className="cart-item-name">{item.TENSP}</div>
                                                <div className="cart-item-price">{fmtVND(item.GIABAN_THUCTE)} / {item.DVT}</div>
                                            </div>
                                            <div className="cart-item-ctrl">
                                                <button className="qty-btn" onClick={() => changeQty(item.MASP, -1)}>−</button>
                                                <span className="qty-val">{item.SOLUONG}</span>
                                                <button className="qty-btn" onClick={() => changeQty(item.MASP, +1)}>+</button>
                                            </div>
                                            <div className="cart-item-subtotal">{fmtVND(item.THANHTIEN)}</div>
                                            <button className="cart-item-remove" onClick={() => removeFromCart(item.MASP)}>✕</button>
                                        </div>
                                    ))}
                                </div>
                                <div className="cart-footer">
                                    <div className="cart-summary-row">
                                        <span>Tạm tính</span>
                                        <span>{fmtVND(TONGTIEN_HANG)}</span>
                                    </div>
                                    <div className="cart-summary-row">
                                        {/* SOVOUCHER: mã voucher áp dụng cho HoaDon */}
                                        <span>Mã voucher (SOVOUCHER)</span>
                                        <input
                                            value={sovoucher}
                                            onChange={e => setSovoucher(e.target.value.toUpperCase())}
                                            placeholder="Nhập mã..."
                                            style={{
                                                background: 'var(--c-bg-card2)', border: '1px solid var(--c-border)',
                                                borderRadius: 6, padding: '3px 8px', color: 'var(--c-text)',
                                                fontSize: 12, width: 100
                                            }}
                                        />
                                    </div>
                                    <div className="cart-summary-row total">
                                        <span>Tổng thanh toán</span>
                                        <span className="teal">{fmtVND(TONG_THANHTOAN)}</span>
                                    </div>
                                    <div className="cart-actions">
                                        <button className="btn-primary" onClick={handleSubmitOrder}>
                                            Tạo đơn hàng
                                        </button>
                                        <button className="btn-secondary" onClick={() => setCart([])}>
                                            Xóa giỏ hàng
                                        </button>
                                    </div>
                                </div>
                            </>
                        )
                    }
                </div>
            </div>
        </>
    );
};

// ════════════════════════════════════════════════════════════
// PAGE 2: XEM TỒN KHO
// SanPham + TonKho + LoaiSanPham
// ════════════════════════════════════════════════════════════
const TonKhoPage = () => {
    // TODO: fetch từ API /products?with=tonKhos,loaiSanPham
    const [products] = useState([]);
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return products.filter(p =>
            !p.IS_DELETED &&
            (p.TENSP.toLowerCase().includes(q) || p.BARCODE.toLowerCase().includes(q))
        );
    }, [products, search]);

    const getStockStatus = (stock) => {
        if (stock === 0) return { cls: 'badge-out', label: 'Hết hàng', barCls: 'out' };
        if (stock <= 10) return { cls: 'badge-low', label: 'Sắp hết', barCls: 'low' };
        return { cls: 'badge-in-stock', label: 'Còn hàng', barCls: '' };
    };

    return (
        <>
            <div className="c-page-header">
                <div className="c-page-title-block">
                    <div>
                        <div className="c-page-title">Xem tồn kho</div>
                        <div className="c-page-sub">Tra cứu nhanh số lượng hàng</div>
                    </div>
                </div>
            </div>

            <div className="c-search-wrap">
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm sản phẩm..." />
            </div>

            <div className="c-data-card">
                <table className="c-table">
                    <thead>
                        <tr>
                            <th>Sản phẩm</th>
                            <th>Danh mục</th>
                            <th>Đơn giá</th>
                            <th>Tồn kho</th>
                            <th>Tình trạng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 && (
                            <tr className="empty-row"><td colSpan={5}> </td></tr>
                        )}
                        {filtered.map(sp => {
                            const stock = totalStock(sp.tonKhos);
                            const pct = Math.min(100, Math.round((stock / STOCK_MAX) * 100));
                            const st = getStockStatus(stock);
                            return (
                                <tr key={sp.MASP}>
                                    <td>
                                        <div className="entity-name">{sp.TENSP}</div>
                                        <div className="entity-sub">{sp.BARCODE}</div>
                                    </td>
                                    <td style={{ color: 'var(--c-text-sub)', fontSize: 13 }}>
                                        {sp.loaiSanPham?.TENLOAI || '—'}
                                    </td>
                                    <td className="price-teal">{fmtVND(sp.GIABAN)}</td>
                                    <td>
                                        <div className="stock-bar-wrap">
                                            <div className="stock-bar">
                                                <div className={`stock-fill ${st.barCls}`} style={{ width: `${pct}%` }} />
                                            </div>
                                            <span className="stock-count">{stock}</span>
                                        </div>
                                    </td>
                                    <td><span className={`badge ${st.cls}`}>{st.label}</span></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </>
    );
};

// ════════════════════════════════════════════════════════════
// PAGE 3: DANH SÁCH ĐƠN HÀNG
// HoaDon: MAHD, NGAYHD, HINHTHUC, TONGTIEN_HANG,
//         TIEN_GIAM_VOUCHER, TONG_THANHTOAN, MANV, MAKH, IS_DELETED
// joined: nhanVien.TENNV, khachHang.TENKH, chiTiets[]
// ════════════════════════════════════════════════════════════
const DanhSachDonPage = () => {
    // TODO: fetch từ API /orders?with=nhanVien,khachHang,chiTiets
    const [orders, setOrders] = useState([]);
    const [modalOrder, setModalOrder] = useState(null);

    const handleCancel = (MAHD) => {
        // TODO: PATCH /orders/:MAHD với { IS_DELETED: true }
        if (window.confirm('Hủy đơn hàng này?')) {
            setOrders(prev => prev.map(o => o.MAHD === MAHD ? { ...o, IS_DELETED: true } : o));
        }
    };

    return (
        <>
            <div className="c-page-header">
                <div className="c-page-title-block">
                    <div>
                        <div className="c-page-title">Danh sách đơn hàng</div>
                        <div className="c-page-sub">{orders.length} đơn</div>
                    </div>
                </div>
            </div>

            <div className="c-data-card">
                <table className="c-table">
                    <thead>
                        <tr>
                            <th>Mã đơn</th>
                            <th>Ngày</th>
                            <th>Thu ngân</th>
                            <th>Tổng</th>
                            <th>TT</th>
                            <th>Trạng thái</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 && (
                            <tr className="empty-row"><td colSpan={7}></td></tr>
                        )}
                        {orders.map(o => {
                            const status = getOrderStatus(o);
                            const st = STATUS_MAP[status];
                            const ht = HINHTHUC_MAP[o.HINHTHUC];
                            return (
                                <tr key={o.MAHD}>
                                    <td>
                                        <span className="c-code-link" onClick={() => setModalOrder(o)}>
                                            ORD-{String(o.MAHD).padStart(3, '0')}
                                        </span>
                                    </td>
                                    <td style={{ color: 'var(--c-text-sub)', fontSize: 13 }}>{fmtDate(o.NGAYHD)}</td>
                                    <td style={{ fontSize: 13 }}>{o.nhanVien?.TENNV || '—'}</td>
                                    <td className="price-teal">{fmtVND(o.TONG_THANHTOAN)}</td>
                                    <td>
                                        {ht
                                            ? <div className="hinhthuc-cell">{ht.label}</div>
                                            : <span style={{ color: 'var(--c-text-muted)' }}>—</span>}
                                    </td>
                                    <td><span className={st.cls}>{st.label}</span></td>
                                    <td>
                                        <div className="actions-cell">
                                            <button className="btn-view" onClick={() => setModalOrder(o)}>Xem</button>
                                            {status === 'PENDING' && (
                                                <button className="btn-cancel" onClick={() => handleCancel(o.MAHD)}>Hủy</button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Modal: Chi tiết đơn hàng */}
            {modalOrder && (
                <div className="modal-overlay" onClick={() => setModalOrder(null)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <div className="modal-title">
                            Chi tiết — ORD-{String(modalOrder.MAHD).padStart(3, '0')}
                        </div>
                        <div className="modal-detail-row">
                            <span className="modal-detail-label">Ngày lập (NGAYHD)</span>
                            <span className="modal-detail-value">{fmtDate(modalOrder.NGAYHD)}</span>
                        </div>
                        <div className="modal-detail-row">
                            <span className="modal-detail-label">Thu ngân (MANV)</span>
                            <span className="modal-detail-value">{modalOrder.nhanVien?.TENNV || modalOrder.MANV}</span>
                        </div>
                        <div className="modal-detail-row">
                            <span className="modal-detail-label">Khách hàng (MAKH)</span>
                            <span className="modal-detail-value">{modalOrder.khachHang?.TENKH || 'Khách lẻ'}</span>
                        </div>
                        <div className="modal-detail-row">
                            <span className="modal-detail-label">Hình thức TT (HINHTHUC)</span>
                            <span className="modal-detail-value">
                                {HINHTHUC_MAP[modalOrder.HINHTHUC]
                                    ? HINHTHUC_MAP[modalOrder.HINHTHUC].label
                                    : '—'}
                            </span>
                        </div>
                        <div className="modal-detail-row">
                            <span className="modal-detail-label">Tổng tiền hàng (TONGTIEN_HANG)</span>
                            <span className="modal-detail-value">{fmtVND(modalOrder.TONGTIEN_HANG)}</span>
                        </div>
                        <div className="modal-detail-row">
                            <span className="modal-detail-label">Giảm voucher (TIEN_GIAM_VOUCHER)</span>
                            <span className="modal-detail-value" style={{ color: 'var(--c-red)' }}>
                                -{fmtVND(modalOrder.TIEN_GIAM_VOUCHER)}
                            </span>
                        </div>
                        <div className="modal-detail-row">
                            <span className="modal-detail-label">Tổng thanh toán (TONG_THANHTOAN)</span>
                            <span className="modal-detail-value" style={{ color: 'var(--c-teal)', fontSize: 16 }}>
                                {fmtVND(modalOrder.TONG_THANHTOAN)}
                            </span>
                        </div>

                        {/* Chi tiết từng sản phẩm (CTHoaDon) */}
                        {(modalOrder.chiTiets?.length > 0) && (
                            <>
                                <div style={{ margin: '18px 0 10px', fontWeight: 700, color: 'var(--c-text)', fontSize: 14 }}>
                                    Chi tiết sản phẩm
                                </div>
                                {modalOrder.chiTiets.map((ct, i) => (
                                    <div key={i} className="modal-detail-row">
                                        <span className="modal-detail-label">
                                            {ct.sanPham?.TENSP || `SP #${ct.MASP}`} × {ct.SOLUONG}
                                        </span>
                                        <span className="modal-detail-value">{fmtVND(ct.THANHTIEN)}</span>
                                    </div>
                                ))}
                            </>
                        )}

                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={() => setModalOrder(null)}>Đóng</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

// ════════════════════════════════════════════════════════════
// PAGE 4: THANH TOÁN
// Chọn đơn PENDING → nhập HINHTHUC → xác nhận
// Cập nhật HoaDon: { HINHTHUC, TONG_THANHTOAN }
// ════════════════════════════════════════════════════════════
const ThanhToanPage = () => {
    // TODO: fetch từ API /orders?status=pending&with=chiTiets,nhanVien
    const [pendingOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [hinhThuc, setHinhThuc] = useState('');

    const handleConfirmPayment = () => {
        if (!selectedOrder || !hinhThuc) return;
        // TODO: PATCH /orders/:MAHD với:
        // { HINHTHUC: hinhThuc, TONG_THANHTOAN: selectedOrder.TONG_THANHTOAN }
        alert(`Xác nhận thanh toán ORD-${String(selectedOrder.MAHD).padStart(3, '0')} bằng ${HINHTHUC_MAP[hinhThuc]?.label}`);
        setSelectedOrder(null);
        setHinhThuc('');
    };

    return (
        <>
            <div className="c-page-header">
                <div className="c-page-title-block">
                    <div>
                        <div className="c-page-title">Thanh toán</div>
                        <div className="c-page-sub">Chọn đơn và xử lý thanh toán</div>
                    </div>
                </div>
            </div>

            <div className="payment-layout">
                {/* Left: pending orders */}
                <div className="payment-panel">
                    <div className="payment-panel-title">Đơn chờ thanh toán</div>
                    {pendingOrders.length === 0 && (
                        <div className="payment-placeholder"></div>
                    )}
                    {pendingOrders.map(o => (
                        <div
                            key={o.MAHD}
                            className={`pending-order-item${selectedOrder?.MAHD === o.MAHD ? ' selected' : ''}`}
                            onClick={() => { setSelectedOrder(o); setHinhThuc(''); }}
                        >
                            <div className="pending-order-id">ORD-{String(o.MAHD).padStart(3, '0')}</div>
                            <div className="pending-order-sub">
                                {o.nhanVien?.TENNV || '—'} · {o.chiTiets?.length || 0} sản phẩm
                            </div>
                            <div className="pending-order-total">{fmtVND(o.TONG_THANHTOAN)}</div>
                        </div>
                    ))}
                </div>

                {/* Right: payment info */}
                <div className="payment-panel">
                    <div className="payment-panel-title">Thông tin thanh toán</div>
                    {!selectedOrder
                        ? <div className="payment-placeholder"></div>
                        : (
                            <>
                                <div className="pay-detail-row">
                                    <span className="pay-detail-label">Mã đơn (MAHD)</span>
                                    <span className="pay-detail-value">ORD-{String(selectedOrder.MAHD).padStart(3, '0')}</span>
                                </div>
                                <div className="pay-detail-row">
                                    <span className="pay-detail-label">Ngày lập (NGAYHD)</span>
                                    <span className="pay-detail-value">{fmtDate(selectedOrder.NGAYHD)}</span>
                                </div>
                                <div className="pay-detail-row">
                                    <span className="pay-detail-label">Tổng tiền hàng (TONGTIEN_HANG)</span>
                                    <span className="pay-detail-value">{fmtVND(selectedOrder.TONGTIEN_HANG)}</span>
                                </div>
                                <div className="pay-detail-row">
                                    <span className="pay-detail-label">Giảm voucher (TIEN_GIAM_VOUCHER)</span>
                                    <span className="pay-detail-value" style={{ color: 'var(--c-red)' }}>
                                        -{fmtVND(selectedOrder.TIEN_GIAM_VOUCHER || 0)}
                                    </span>
                                </div>
                                <div className="pay-total-row">
                                    <span>Tổng thanh toán</span>
                                    <span>{fmtVND(selectedOrder.TONG_THANHTOAN)}</span>
                                </div>

                                {/* HINHTHUC: phương thức thanh toán */}
                                <div style={{ marginTop: 20, fontSize: 13, color: 'var(--c-text-muted)', marginBottom: 8 }}>
                                    Hình thức thanh toán (HINHTHUC)
                                </div>
                                <div className="pay-method-grid">
                                    {Object.entries(HINHTHUC_MAP).map(([key, val]) => (
                                        <button
                                            key={key}
                                            className={`pay-method-btn${hinhThuc === key ? ' selected' : ''}`}
                                            onClick={() => setHinhThuc(key)}
                                        >
                                            {val.label}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    className="btn-primary"
                                    disabled={!hinhThuc}
                                    onClick={handleConfirmPayment}
                                >
                                    Xác nhận thanh toán
                                </button>
                            </>
                        )
                    }
                </div>
            </div>
        </>
    );
};

// ════════════════════════════════════════════════════════════
// LAYOUT
// ════════════════════════════════════════════════════════════
const MENU_ITEMS = [
    { id: 'create', label: 'Tạo đơn hàng' },
    { id: 'stock', label: 'Xem tồn kho' },
    { id: 'orders', label: 'Danh sách đơn' },
    { id: 'payment', label: 'Thanh toán' },
];

// TODO: thay bằng dữ liệu từ auth context
// NhanVien: MANV, TENNV, chucVu.TENCHUCVU
const CURRENT_CASHIER = {
    MANV: null,
    TENNV: '...',
    chucVu: { TENCHUCVU: 'Thu ngân' },
};

const Cashier = () => {
    const [page, setPage] = useState('create');
    const user = CURRENT_CASHIER;

    const userInitials = (user.TENNV || '??').trim().split(' ').pop().slice(0, 2).toUpperCase();

    const dateStr = new Date().toLocaleDateString('vi-VN', {
        weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric',
    });

    const renderPage = () => {
        switch (page) {
            case 'stock': return <TonKhoPage />;
            case 'orders': return <DanhSachDonPage />;
            case 'payment': return <ThanhToanPage />;
            default: return <TaoDoPage onOrderCreated={() => setPage('orders')} />;
        }
    };

    return (
        <div className="cashier-app">
            <Header />
            <div className="cashier-layout">
                {/* ── Sidebar ─────────────────────────────────────────────── */}
                <aside className="cashier-sidebar">
                    {/* Nav */}
                    <nav className="c-sidebar-nav">
                        {MENU_ITEMS.map(item => (
                            <button
                                key={item.id}
                                className={`c-nav-item${page === item.id ? ' active' : ''}`}
                                onClick={() => setPage(item.id)}
                            >
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* ── Main ────────────────────────────────────────────────── */}
                <div className="cashier-main">
                    <main className="cashier-body">
                        {renderPage()}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Cashier;
