import React, { useState, useMemo } from 'react';
import Header from '../../components/layout/Header/Header.jsx';
import './Warehouse.css';

// ════════════════════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════════════════════
const fmtVND = (v) => Number(v || 0).toLocaleString('vi-VN') + ' ₫';
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '—';
const STOCK_MAX = 300;
const LOW_THRESHOLD = 10;   // dưới 10 = sắp hết
// HSD sắp hết trong vòng 30 ngày
const HSD_WARN_DAYS = 30;

const totalStock = (tonKhos = []) =>
    tonKhos.filter(t => t.IS_ACTIVE !== false)
        .reduce((s, t) => s + (t.SOLUONG_CON_LAI || 0), 0);

const earliestHSD = (tonKhos = []) => {
    const active = tonKhos.filter(t => t.IS_ACTIVE !== false && t.HANSUDUNG);
    if (!active.length) return null;
    return active.sort((a, b) => new Date(a.HANSUDUNG) - new Date(b.HANSUDUNG))[0].HANSUDUNG;
};

const hsdStatus = (hsdStr) => {
    if (!hsdStr) return 'unknown';
    const diff = Math.ceil((new Date(hsdStr) - Date.now()) / 86400000);
    if (diff < 0) return 'expired';
    if (diff <= HSD_WARN_DAYS) return 'soon';
    return 'ok';
};

const hsdText = (hsdStr) => {
    if (!hsdStr) return '—';
    const diff = Math.ceil((new Date(hsdStr) - Date.now()) / 86400000);
    const base = fmtDate(hsdStr);
    if (diff < 0) return `${base} (${diff}d)`;
    if (diff <= HSD_WARN_DAYS) return `${base} (+${diff}d)`;
    return base;
};

// ════════════════════════════════════════════════════════════
// PAGE 1: TRẠNG THÁI TỒN KHO
// SanPham: MASP, BARCODE, TENSP, DVT, GIABAN, MALOAI, IS_DELETED
//          → loaiSanPham.TENLOAI
//          → tonKhos[]: ID, SOLUONG_CON_LAI, GIANHAP, HANSUDUNG, IS_ACTIVE
// Tối thiểu: hiển thị DVT + ngưỡng LOW_THRESHOLD
// ════════════════════════════════════════════════════════════
const TonKhoPage = () => {
    // TODO: fetch từ API /products?with=tonKhos,loaiSanPham
    const [products] = useState([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');  // all | ok | low | out

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return products.filter(p => {
            if (p.IS_DELETED) return false;
            const match = p.TENSP.toLowerCase().includes(q) || p.BARCODE.toLowerCase().includes(q);
            if (!match) return false;
            const stock = totalStock(p.tonKhos);
            if (filter === 'ok') return stock > LOW_THRESHOLD;
            if (filter === 'low') return stock > 0 && stock <= LOW_THRESHOLD;
            if (filter === 'out') return stock === 0;
            return true;
        });
    }, [products, search, filter]);

    const totalSP = products.filter(p => !p.IS_DELETED).length;
    const sapHet = products.filter(p => { const s = totalStock(p.tonKhos); return s > 0 && s <= LOW_THRESHOLD; }).length;
    const hetHang = products.filter(p => totalStock(p.tonKhos) === 0 && !p.IS_DELETED).length;
    const sapHetHSD = products.filter(p => {
        const hsd = earliestHSD(p.tonKhos);
        return hsd && hsdStatus(hsd) !== 'ok';
    }).length;

    const FILTERS = [
        { key: 'all', label: 'Tất cả', cls: 'active-all' },
        { key: 'ok', label: '✓ Đủ', cls: 'active-ok' },
        { key: 'low', label: '⚠ Sáp', cls: 'active-low' },
        { key: 'out', label: '✕ Hết', cls: 'active-out' },
    ];

    const stockStatus = (stock) => {
        if (stock === 0) return { cls: 'badge-out', label: '✕ Hết hàng', fill: 'out' };
        if (stock <= LOW_THRESHOLD) return { cls: 'badge-low', label: '⚠ Sắp hết', fill: 'low' };
        return { cls: 'badge-ok', label: '✓ Đủ', fill: '' };
    };

    return (
        <>
            <div className="w-page-header">
                <div className="w-page-title-block">
                    <div>
                        <div className="w-page-title">Trạng thái tồn kho</div>
                        <div className="w-page-sub">Theo dõi hàng hóa trong kho</div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="w-stats-grid">
                <div className="w-stat-card">

                    <div>
                        <div className="w-stat-label">Tổng SP</div>
                        <div className="w-stat-value">{totalSP}</div>
                    </div>
                </div>
                <div className="w-stat-card warn">

                    <div>
                        <div className="w-stat-label">Sắp hết</div>
                        <div className="w-stat-value">{sapHet}</div>
                    </div>
                </div>
                <div className="w-stat-card danger">

                    <div>
                        <div className="w-stat-label">Hết hàng</div>
                        <div className="w-stat-value">{hetHang}</div>
                    </div>
                </div>
                <div className="w-stat-card info">

                    <div>
                        <div className="w-stat-label">Sắp hết HSD</div>
                        <div className="w-stat-value">{sapHetHSD}</div>
                    </div>
                </div>
            </div>

            {/* Search + filter */}
            <div className="w-filter-bar">
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm..." />
                <div className="w-filter-divider" />
                {FILTERS.map(f => (
                    <button
                        key={f.key}
                        className={`w-filter-btn${filter === f.key ? ' ' + f.cls : ''}`}
                        onClick={() => setFilter(f.key)}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="w-data-card">
                <table className="w-table">
                    <thead>
                        <tr>
                            <th>Sản phẩm</th>
                            <th>Danh mục</th>
                            <th>Tồn kho</th>
                            <th>Tối thiểu</th>
                            <th>HSD</th>
                            <th>Tình trạng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 && products.length === 0 && (
                            <tr className="empty-row"><td colSpan={6}></td></tr>
                        )}
                        {filtered.length === 0 && products.length > 0 && (
                            <tr className="empty-row"><td colSpan={6}>Không tìm thấy sản phẩm</td></tr>
                        )}
                        {filtered.map(sp => {
                            const stock = totalStock(sp.tonKhos);
                            const pct = Math.min(100, Math.round((stock / STOCK_MAX) * 100));
                            const st = stockStatus(stock);
                            const hsd = earliestHSD(sp.tonKhos);
                            const hSt = hsdStatus(hsd);
                            return (
                                <tr key={sp.MASP}>
                                    <td>
                                        <div className="entity-name">{sp.TENSP}</div>
                                        <div className="entity-sub">{sp.BARCODE}</div>
                                    </td>
                                    <td style={{ color: 'var(--w-text-sub)', fontSize: 13 }}>
                                        {sp.loaiSanPham?.TENLOAI || '—'}
                                    </td>
                                    <td>
                                        <div className="stock-bar-wrap">
                                            <div className="stock-bar">
                                                <div className={`stock-fill ${st.fill}`} style={{ width: `${pct}%` }} />
                                            </div>
                                            <span className="stock-count">{stock}</span>
                                        </div>
                                    </td>
                                    <td style={{ color: 'var(--w-text-muted)', fontSize: 13 }}>
                                        {LOW_THRESHOLD} {sp.DVT}
                                    </td>
                                    <td>
                                        <span className={
                                            hSt === 'expired' ? 'hsd-expired' :
                                                hSt === 'soon' ? 'hsd-soon' : 'hsd-ok'
                                        }>
                                            {hsdText(hsd)}
                                        </span>
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
// PAGE 2: TẠO ĐƠN NHẬP HÀNG
// PhieuNhap: MAPHIEU, NGAYLAP, MANV, TONGTIEN, GCHU, IS_DELETED
//   → nhanVien.TENNV
// CTPhieuNhap (per line): MAPHIEU, MASP, SOLUONG, DONGIANHAP, HANSUDUNG
//   → sanPham.TENSP  (via MASP)
// NhaCungCap: MANCC, TENNCC (hiển thị theo SP → nhaCungCap.TENNCC)
// ════════════════════════════════════════════════════════════
const NHAP_EMPTY_FORM = { NGAYLAP: '', GCHU: '' };
const CT_NHAP_EMPTY = { MASP: '', TENSP: '', SOLUONG: '', DONGIANHAP: '', HANSUDUNG: '' };

const PhieuNhapPage = () => {
    // TODO: fetch từ API /purchase-orders?with=nhanVien,chiTiets.sanPham
    const [phieuList, setPhieuList] = useState([]);
    // TODO: fetch từ API /products (for CT dropdowns)
    const [products] = useState([]);
    const [modal, setModal] = useState(null); // 'create' | 'view'
    const [form, setForm] = useState(NHAP_EMPTY_FORM);
    const [ctLines, setCtLines] = useState([{ ...CT_NHAP_EMPTY }]);
    const [viewPhieu, setViewPhieu] = useState(null);

    const handleFormChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const handleCtChange = (idx, field, value) => {
        setCtLines(prev => prev.map((line, i) => {
            if (i !== idx) return line;
            const updated = { ...line, [field]: value };
            if (field === 'MASP') {
                const sp = products.find(p => String(p.MASP) === String(value));
                updated.TENSP = sp?.TENSP || '';
                // Pre-fill DONGIANHAP nếu có giá nhập gần nhất từ TonKho
                const lastLot = sp?.tonKhos?.slice(-1)[0];
                updated.DONGIANHAP = lastLot?.GIANHAP || '';
            }
            return updated;
        }));
    };

    const addCtLine = () => setCtLines(p => [...p, { ...CT_NHAP_EMPTY }]);
    const removeCtLine = (idx) => setCtLines(p => p.filter((_, i) => i !== idx));

    const totalTongtien = ctLines.reduce(
        (s, l) => s + (Number(l.SOLUONG) * Number(l.DONGIANHAP) || 0), 0
    );

    const handleCreate = () => {
        // TODO: POST /purchase-orders với body:
        // { NGAYLAP: form.NGAYLAP, MANV: currentUser.MANV, GCHU: form.GCHU,
        //   TONGTIEN: totalTongtien,
        //   chiTiets: ctLines.map(l => ({
        //     MASP: l.MASP, SOLUONG: l.SOLUONG,
        //     DONGIANHAP: l.DONGIANHAP, HANSUDUNG: l.HANSUDUNG })) }
        const newPhieu = {
            MAPHIEU: Date.now(),
            NGAYLAP: form.NGAYLAP,
            MANV: null,
            TONGTIEN: totalTongtien,
            GCHU: form.GCHU,
            IS_DELETED: false,
            TRANGTHAI: 'PENDING',
            nhanVien: null,
            chiTiets: ctLines.map(l => ({
                MASP: l.MASP,
                SOLUONG: Number(l.SOLUONG),
                DONGIANHAP: Number(l.DONGIANHAP),
                HANSUDUNG: l.HANSUDUNG,
                sanPham: { TENSP: l.TENSP },
            })),
        };
        setPhieuList(p => [...p, newPhieu]);
        setModal(null);
        setForm(NHAP_EMPTY_FORM);
        setCtLines([{ ...CT_NHAP_EMPTY }]);
    };

    const getStatus = (ph) => {
        if (ph.IS_DELETED) return 'CANCELLED';
        return ph.TRANGTHAI || 'PENDING';
    };

    const STATUS_MAP = {
        APPROVED: { label: 'Đã duyệt', cls: 'badge-approved' },
        PENDING: { label: 'Chờ duyệt', cls: 'badge-pending' },
        CANCELLED: { label: 'Đã hủy', cls: 'badge-cancelled' },
    };

    return (
        <>
            <div className="w-page-header">
                <div className="w-page-title-block">
                    <div>
                        <div className="w-page-title">Đơn nhập hàng</div>
                        <div className="w-page-sub">Tạo phiếu nhập và theo dõi trạng thái</div>
                    </div>
                </div>
                <button className="btn-add-nhap" onClick={() => {
                    setForm(NHAP_EMPTY_FORM);
                    setCtLines([{ ...CT_NHAP_EMPTY }]);
                    setModal('create');
                }}>
                    + Tạo phiếu nhập
                </button>
            </div>

            <div className="w-data-card">
                <table className="w-table">
                    <thead>
                        <tr>
                            <th>Mã phiếu</th>
                            <th>Ngày</th>
                            <th>NCC</th>
                            <th>NV Tạo</th>
                            <th>Tổng</th>
                            <th>Trạng thái</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {phieuList.length === 0 && (
                            <tr className="empty-row"><td colSpan={7}></td></tr>
                        )}
                        {phieuList.map(ph => {
                            const st = STATUS_MAP[getStatus(ph)] || STATUS_MAP.PENDING;
                            // NCC lấy từ sản phẩm đầu trong chiTiets → nhaCungCap.TENNCC
                            const ncc = ph.chiTiets?.[0]?.sanPham?.nhaCungCap?.TENNCC || '—';
                            return (
                                <tr key={ph.MAPHIEU}>
                                    <td>
                                        <span className="w-code-link" onClick={() => { setViewPhieu(ph); setModal('view'); }}>
                                            IMP-{String(ph.MAPHIEU).padStart(3, '0')}
                                        </span>
                                    </td>
                                    <td style={{ color: 'var(--w-text-sub)', fontSize: 13 }}>{fmtDate(ph.NGAYLAP)}</td>
                                    <td style={{ fontSize: 14 }}>{ncc}</td>
                                    <td style={{ fontSize: 14 }}>{ph.nhanVien?.TENNV || '—'}</td>
                                    <td className="price-teal">{fmtVND(ph.TONGTIEN)}</td>
                                    <td><span className={`badge ${st.cls}`}>{st.label}</span></td>
                                    <td>
                                        <div className="actions-cell">
                                            <button className="btn-view" onClick={() => { setViewPhieu(ph); setModal('view'); }}>Xem</button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Modal: Tạo phiếu nhập */}
            {modal === 'create' && (
                <div className="modal-overlay" onClick={() => setModal(null)}>
                    <div className="modal-box wide" onClick={e => e.stopPropagation()}>
                        <div className="modal-title">Tạo phiếu nhập hàng</div>
                        <div className="form-grid">
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Ngày lập (NGAYLAP)</label>
                                    <input className="form-input" type="date" name="NGAYLAP"
                                        value={form.NGAYLAP} onChange={handleFormChange} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Ghi chú (GCHU)</label>
                                    <input className="form-input" name="GCHU"
                                        value={form.GCHU} onChange={handleFormChange}
                                        placeholder="" />
                                </div>
                            </div>
                        </div>

                        {/* Chi tiết phiếu nhập — CTPhieuNhap */}
                        <div className="section-label">Chi tiết sản phẩm (CTPhieuNhap)</div>
                        <table className="ct-table">
                            <thead>
                                <tr>
                                    <th>MASP</th>
                                    <th>Tên SP</th>
                                    <th>SL (SOLUONG)</th>
                                    <th>Đơn giá (DONGIANHAP)</th>
                                    <th>HSD (HANSUDUNG)</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {ctLines.map((line, idx) => (
                                    <tr key={idx}>
                                        <td>
                                            <input
                                                className="form-input"
                                                style={{ minWidth: 80 }}
                                                value={line.MASP}
                                                onChange={e => handleCtChange(idx, 'MASP', e.target.value)}
                                                placeholder="MASP"
                                            />
                                        </td>
                                        <td style={{ color: 'var(--w-text-sub)', fontSize: 12 }}>
                                            {line.TENSP || '—'}
                                        </td>
                                        <td>
                                            <input
                                                className="form-input"
                                                type="number" min="1"
                                                style={{ minWidth: 70 }}
                                                value={line.SOLUONG}
                                                onChange={e => handleCtChange(idx, 'SOLUONG', e.target.value)}
                                                placeholder="0"
                                            />
                                        </td>
                                        <td>
                                            <input
                                                className="form-input"
                                                type="number" min="0"
                                                style={{ minWidth: 100 }}
                                                value={line.DONGIANHAP}
                                                onChange={e => handleCtChange(idx, 'DONGIANHAP', e.target.value)}
                                                placeholder="0"
                                            />
                                        </td>
                                        <td>
                                            <input
                                                className="form-input"
                                                type="date"
                                                value={line.HANSUDUNG}
                                                onChange={e => handleCtChange(idx, 'HANSUDUNG', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <button className="btn-icon-del" onClick={() => removeCtLine(idx)}>✕</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button className="btn-icon-add" style={{ marginTop: 10, width: 'auto', padding: '6px 14px', borderRadius: 8, fontSize: 13, gap: 6, display: 'flex', alignItems: 'center' }}
                            onClick={addCtLine}>
                            + Thêm dòng
                        </button>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 14, fontSize: 15, fontWeight: 700, color: 'var(--w-teal)' }}>
                            Tổng tiền (TONGTIEN): {fmtVND(totalTongtien)}
                        </div>

                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={() => setModal(null)}>Hủy</button>
                            <button className="btn-primary" style={{ width: 'auto', padding: '11px 28px' }} onClick={handleCreate}>
                                Tạo phiếu
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: Xem chi tiết phiếu nhập */}
            {modal === 'view' && viewPhieu && (
                <div className="modal-overlay" onClick={() => setModal(null)}>
                    <div className="modal-box wide" onClick={e => e.stopPropagation()}>
                        <div className="modal-title">
                            IMP-{String(viewPhieu.MAPHIEU).padStart(3, '0')}
                        </div>
                        <div className="modal-detail-row">
                            <span className="modal-detail-label">Ngày lập (NGAYLAP)</span>
                            <span className="modal-detail-value">{fmtDate(viewPhieu.NGAYLAP)}</span>
                        </div>
                        <div className="modal-detail-row">
                            <span className="modal-detail-label">Nhân viên (MANV)</span>
                            <span className="modal-detail-value">{viewPhieu.nhanVien?.TENNV || '—'}</span>
                        </div>
                        <div className="modal-detail-row">
                            <span className="modal-detail-label">Ghi chú (GCHU)</span>
                            <span className="modal-detail-value">{viewPhieu.GCHU || '—'}</span>
                        </div>
                        <div className="modal-detail-row">
                            <span className="modal-detail-label">Tổng tiền (TONGTIEN)</span>
                            <span className="modal-detail-value" style={{ color: 'var(--w-teal)' }}>{fmtVND(viewPhieu.TONGTIEN)}</span>
                        </div>

                        <div className="section-label">Chi tiết sản phẩm (CTPhieuNhap)</div>
                        <table className="ct-table">
                            <thead>
                                <tr>
                                    <th>Sản phẩm</th>
                                    <th>SL</th>
                                    <th>Đơn giá nhập</th>
                                    <th>HSD</th>
                                    <th>Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(viewPhieu.chiTiets || []).map((ct, i) => (
                                    <tr key={i}>
                                        <td>{ct.sanPham?.TENSP || `SP #${ct.MASP}`}</td>
                                        <td>{ct.SOLUONG}</td>
                                        <td>{fmtVND(ct.DONGIANHAP)}</td>
                                        <td style={{ color: 'var(--w-text-muted)', fontSize: 13 }}>{fmtDate(ct.HANSUDUNG)}</td>
                                        <td className="price-teal">{fmtVND(ct.SOLUONG * ct.DONGIANHAP)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={() => setModal(null)}>Đóng</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

// ════════════════════════════════════════════════════════════
// PAGE 3: TẠO ĐƠN HỦY HÀNG
// PhieuHuy: MAPHIEU, NGAYLAP, MANV, LYDO, IS_DELETED
//   → nhanVien.TENNV
// CTPhieuHuy (per line): MAPHIEU, MASP, ID_TONKHO, SOLUONG
//   → sanPham.TENSP, tonKho.HANSUDUNG
// ════════════════════════════════════════════════════════════
const HUY_EMPTY_FORM = { NGAYLAP: '', LYDO: '' };
const CT_HUY_EMPTY = { MASP: '', TENSP: '', ID_TONKHO: '', SOLUONG: '' };

const PhieuHuyPage = () => {
    // TODO: fetch từ API /disposal-slips?with=nhanVien,chiTiets.sanPham
    const [phieuList, setPhieuList] = useState([]);
    // TODO: fetch từ API /products?with=tonKhos (để chọn lô hàng hủy)
    const [products] = useState([]);
    const [modal, setModal] = useState(null); // 'create' | 'view'
    const [form, setForm] = useState(HUY_EMPTY_FORM);
    const [ctLines, setCtLines] = useState([{ ...CT_HUY_EMPTY }]);
    const [viewPhieu, setViewPhieu] = useState(null);

    const handleFormChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const handleCtChange = (idx, field, value) => {
        setCtLines(prev => prev.map((line, i) => {
            if (i !== idx) return line;
            const updated = { ...line, [field]: value };
            if (field === 'MASP') {
                const sp = products.find(p => String(p.MASP) === String(value));
                updated.TENSP = sp?.TENSP || '';
                updated.ID_TONKHO = '';
            }
            return updated;
        }));
    };

    // Lấy các lô hàng còn hoạt động của MASP để chọn ID_TONKHO
    const getLots = (MASP) => {
        const sp = products.find(p => String(p.MASP) === String(MASP));
        return sp?.tonKhos?.filter(t => t.IS_ACTIVE !== false && t.SOLUONG_CON_LAI > 0) || [];
    };

    const addCtLine = () => setCtLines(p => [...p, { ...CT_HUY_EMPTY }]);
    const removeCtLine = (idx) => setCtLines(p => p.filter((_, i) => i !== idx));

    const totalSP = ctLines.filter(l => l.MASP).length;

    const handleCreate = () => {
        // TODO: POST /disposal-slips với body:
        // { NGAYLAP: form.NGAYLAP, MANV: currentUser.MANV, LYDO: form.LYDO,
        //   chiTiets: ctLines.map(l => ({
        //     MASP: l.MASP, ID_TONKHO: l.ID_TONKHO, SOLUONG: l.SOLUONG })) }
        const newPhieu = {
            MAPHIEU: Date.now(),
            NGAYLAP: form.NGAYLAP,
            MANV: null,
            LYDO: form.LYDO,
            IS_DELETED: false,
            TRANGTHAI: 'PENDING',
            nhanVien: null,
            chiTiets: ctLines.map(l => ({
                MASP: l.MASP,
                ID_TONKHO: l.ID_TONKHO,
                SOLUONG: Number(l.SOLUONG),
                sanPham: { TENSP: l.TENSP },
            })),
        };
        setPhieuList(p => [...p, newPhieu]);
        setModal(null);
        setForm(HUY_EMPTY_FORM);
        setCtLines([{ ...CT_HUY_EMPTY }]);
    };

    const STATUS_MAP = {
        APPROVED: { label: 'Đã duyệt', cls: 'badge-approved' },
        PENDING: { label: 'Chờ duyệt', cls: 'badge-pending' },
        CANCELLED: { label: 'Đã hủy', cls: 'badge-cancelled' },
    };

    const getStatus = (ph) => {
        if (ph.IS_DELETED) return 'CANCELLED';
        return ph.TRANGTHAI || 'PENDING';
    };

    return (
        <>
            <div className="w-page-header">
                <div className="w-page-title-block">
                    <div>
                        <div className="w-page-title">Đơn hủy hàng</div>
                        <div className="w-page-sub">Tạo phiếu hủy hàng hỏng, hết hạn</div>
                    </div>
                </div>
                <button className="btn-add-huy" onClick={() => {
                    setForm(HUY_EMPTY_FORM);
                    setCtLines([{ ...CT_HUY_EMPTY }]);
                    setModal('create');
                }}>
                    + Tạo phiếu hủy
                </button>
            </div>

            <div className="w-data-card">
                <table className="w-table">
                    <thead>
                        <tr>
                            <th>Mã phiếu</th>
                            <th>Ngày</th>
                            <th>NV Kho</th>
                            <th>Số SP</th>
                            <th>Ghi chú</th>
                            <th>Trạng thái</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {phieuList.length === 0 && (
                            <tr className="empty-row"><td colSpan={7}></td></tr>
                        )}
                        {phieuList.map(ph => {
                            const st = STATUS_MAP[getStatus(ph)] || STATUS_MAP.PENDING;
                            const soSP = ph.chiTiets?.length || 0;
                            return (
                                <tr key={ph.MAPHIEU}>
                                    <td>
                                        <span className="w-code-link cancel"
                                            onClick={() => { setViewPhieu(ph); setModal('view'); }}>
                                            CAN-{String(ph.MAPHIEU).padStart(3, '0')}
                                        </span>
                                    </td>
                                    <td style={{ color: 'var(--w-text-sub)', fontSize: 13 }}>{fmtDate(ph.NGAYLAP)}</td>
                                    <td style={{ fontSize: 14 }}>{ph.nhanVien?.TENNV || '—'}</td>
                                    <td style={{ fontWeight: 600 }}>{soSP} loại</td>
                                    <td style={{ color: 'var(--w-text-muted)', fontSize: 13 }}>
                                        {ph.LYDO?.length > 40 ? ph.LYDO.substring(0, 40) + '…' : ph.LYDO || '—'}
                                    </td>
                                    <td><span className={`badge ${st.cls}`}>{st.label}</span></td>
                                    <td>
                                        <div className="actions-cell">
                                            <button className="btn-view" onClick={() => { setViewPhieu(ph); setModal('view'); }}>Xem</button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Modal: Tạo phiếu hủy */}
            {modal === 'create' && (
                <div className="modal-overlay" onClick={() => setModal(null)}>
                    <div className="modal-box wide" onClick={e => e.stopPropagation()}>
                        <div className="modal-title">Tạo phiếu hủy hàng</div>
                        <div className="form-grid">
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Ngày lập (NGAYLAP)</label>
                                    <input className="form-input" type="date" name="NGAYLAP"
                                        value={form.NGAYLAP} onChange={handleFormChange} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Lý do hủy (LYDO)</label>
                                    <input className="form-input" name="LYDO"
                                        value={form.LYDO} onChange={handleFormChange}
                                        placeholder="" />
                                </div>
                            </div>
                        </div>

                        {/* Chi tiết phiếu hủy — CTPhieuHuy */}
                        <div className="section-label">Danh sách hàng hủy (CTPhieuHuy)</div>
                        <table className="ct-table">
                            <thead>
                                <tr>
                                    <th>MASP</th>
                                    <th>Tên SP</th>
                                    <th>Lô hàng (ID_TONKHO)</th>
                                    <th>SL hủy (SOLUONG)</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {ctLines.map((line, idx) => {
                                    const lots = getLots(line.MASP);
                                    return (
                                        <tr key={idx}>
                                            <td>
                                                <input
                                                    className="form-input"
                                                    style={{ minWidth: 80 }}
                                                    value={line.MASP}
                                                    onChange={e => handleCtChange(idx, 'MASP', e.target.value)}
                                                    placeholder="MASP"
                                                />
                                            </td>
                                            <td style={{ color: 'var(--w-text-sub)', fontSize: 12 }}>
                                                {line.TENSP || '—'}
                                            </td>
                                            <td>
                                                <select
                                                    className="form-select"
                                                    style={{ minWidth: 120 }}
                                                    value={line.ID_TONKHO}
                                                    onChange={e => handleCtChange(idx, 'ID_TONKHO', e.target.value)}
                                                >
                                                    <option value="">-- Chọn lô --</option>
                                                    {lots.map(lot => (
                                                        <option key={lot.ID} value={lot.ID}>
                                                            Lô #{lot.ID} — {lot.SOLUONG_CON_LAI} sp — HSD: {fmtDate(lot.HANSUDUNG)}
                                                        </option>
                                                    ))}
                                                    {lots.length === 0 && line.MASP && (
                                                        <option disabled>Nhập MASP hợp lệ</option>
                                                    )}
                                                </select>
                                            </td>
                                            <td>
                                                <input
                                                    className="form-input"
                                                    type="number" min="1"
                                                    style={{ minWidth: 70 }}
                                                    value={line.SOLUONG}
                                                    onChange={e => handleCtChange(idx, 'SOLUONG', e.target.value)}
                                                    placeholder="0"
                                                />
                                            </td>
                                            <td>
                                                <button className="btn-icon-del" onClick={() => removeCtLine(idx)}>✕</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        <button
                            className="btn-icon-add"
                            style={{ marginTop: 10, width: 'auto', padding: '6px 14px', borderRadius: 8, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}
                            onClick={addCtLine}>
                            + Thêm dòng
                        </button>

                        <div style={{ marginTop: 10, fontSize: 13, color: 'var(--w-text-muted)' }}>
                            Tổng {totalSP} loại hàng cần hủy
                        </div>

                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={() => setModal(null)}>Hủy</button>
                            <button className="btn-primary" style={{ width: 'auto', padding: '11px 28px' }} onClick={handleCreate}>
                                Tạo phiếu
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: Xem chi tiết phiếu hủy */}
            {modal === 'view' && viewPhieu && (
                <div className="modal-overlay" onClick={() => setModal(null)}>
                    <div className="modal-box wide" onClick={e => e.stopPropagation()}>
                        <div className="modal-title">
                            CAN-{String(viewPhieu.MAPHIEU).padStart(3, '0')}
                        </div>
                        <div className="modal-detail-row">
                            <span className="modal-detail-label">Ngày lập (NGAYLAP)</span>
                            <span className="modal-detail-value">{fmtDate(viewPhieu.NGAYLAP)}</span>
                        </div>
                        <div className="modal-detail-row">
                            <span className="modal-detail-label">Nhân viên (MANV)</span>
                            <span className="modal-detail-value">{viewPhieu.nhanVien?.TENNV || '—'}</span>
                        </div>
                        <div className="modal-detail-row">
                            <span className="modal-detail-label">Lý do (LYDO)</span>
                            <span className="modal-detail-value">{viewPhieu.LYDO || '—'}</span>
                        </div>

                        <div className="section-label">Danh sách hàng hủy (CTPhieuHuy)</div>
                        <table className="ct-table">
                            <thead>
                                <tr>
                                    <th>Sản phẩm</th>
                                    <th>Lô (ID_TONKHO)</th>
                                    <th>SL hủy</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(viewPhieu.chiTiets || []).map((ct, i) => (
                                    <tr key={i}>
                                        <td>{ct.sanPham?.TENSP || `SP #${ct.MASP}`}</td>
                                        <td style={{ color: 'var(--w-text-muted)', fontSize: 13 }}>Lô #{ct.ID_TONKHO || '—'}</td>
                                        <td><strong>{ct.SOLUONG}</strong></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={() => setModal(null)}>Đóng</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

// ════════════════════════════════════════════════════════════
// LAYOUT
// ════════════════════════════════════════════════════════════
const MENU_ITEMS = [
    { id: 'stock', label: 'Tồn kho' },
    { id: 'import', label: 'Tạo đơn nhập hàng' },
    { id: 'dispose', label: 'Tạo đơn hủy hàng' },
];

// TODO: thay bằng dữ liệu từ auth context
// NhanVien: MANV, TENNV, chucVu.TENCHUCVU
const CURRENT_WAREHOUSE = {
    MANV: null,
    TENNV: '...',
    chucVu: { TENCHUCVU: 'NV Kho' },
};

const Warehouse = () => {
    const [page, setPage] = useState('stock');
    const currentPageTitle = MENU_ITEMS.find(item => item.id === page)?.label || 'Warehouse';

    const renderPage = () => {
        switch (page) {
            case 'import': return <PhieuNhapPage />;
            case 'dispose': return <PhieuHuyPage />;
            default: return <TonKhoPage />;
        }
    };

    return (
        <div className="warehouse-app">
            <Header pageTitle={currentPageTitle} homeTo="/warehouse" />
            <div className="warehouse-layout">
                {/* ── Sidebar ─────────────────────────────────────────────── */}
                <aside className="warehouse-sidebar">
                    {/* Nav */}
                    <nav className="w-sidebar-nav">
                        {MENU_ITEMS.map(item => (
                            <button
                                key={item.id}
                                className={`w-nav-item${page === item.id ? ' active' : ''}`}
                                onClick={() => setPage(item.id)}
                            >
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* ── Main ────────────────────────────────────────────────── */}
                <div className="warehouse-main">
                    <main className="warehouse-body">
                        {renderPage()}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Warehouse;
