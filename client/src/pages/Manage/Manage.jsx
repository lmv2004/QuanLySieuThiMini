import React, { useState } from 'react';
import Header from '../../components/layout/Header/Header.jsx';
import './Manage.css';

// ════════════════════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════════════════════
const fmtVND = (v) => Number(v).toLocaleString('vi-VN') + ' ₫';
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '—';

const avatarColor = (i) => ['linear-gradient(135deg,#7c3aed,#4f46e5)', 'linear-gradient(135deg,#06b6d4,#0891b2)', 'linear-gradient(135deg,#f59e0b,#d97706)', 'linear-gradient(135deg,#10b981,#059669)', 'linear-gradient(135deg,#ef4444,#dc2626)'][i % 5];
const catStyle = (i) => [{ color: '#a78bfa', bg: 'rgba(167,139,250,.15)' }, { color: '#06b6d4', bg: 'rgba(6,182,212,.15)' }, { color: '#f59e0b', bg: 'rgba(245,158,11,.15)' }, { color: '#10b981', bg: 'rgba(16,185,129,.15)' }, { color: '#f472b6', bg: 'rgba(244,114,182,.15)' }][i % 5];
const roleBadge = (ten = '') => ten.toLowerCase().includes('quản') ? 'badge badge-role' : ten.toLowerCase().includes('thu') ? 'badge badge-role-cashier' : 'badge badge-role-warehouse';

const initials = (name = '') => {
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const totalStock = (tonKhos = []) =>
    tonKhos.reduce((s, t) => s + (t.IS_ACTIVE !== false ? (t.SOLUONG_CON_LAI || 0) : 0), 0);

const earliestHSD = (tonKhos = []) => {
    const active = tonKhos.filter(t => t.IS_ACTIVE !== false && t.HANSUDUNG);
    if (!active.length) return null;
    return active.sort((a, b) => new Date(a.HANSUDUNG) - new Date(b.HANSUDUNG))[0].HANSUDUNG;
};

const latestGiaNhap = (tonKhos = []) => {
    const active = tonKhos.filter(t => t.GIANHAP);
    if (!active.length) return null;
    return active[active.length - 1].GIANHAP;
};

const STATUS_MAP = {
    APPROVED: { label: 'Đã duyệt', cls: 'badge badge-approved' },
    PENDING: { label: 'Chờ duyệt', cls: 'badge badge-pending' },
};

// ════════════════════════════════════════════════════════════
// NHÂN VIÊN
// NhanVien: MANV, TENNV, GIOITINH, CCCD, NGAYSINH, SODIENTHOAI,
//           EMAIL, DIACHI, NGAYTHAMGIA, MACHUCVU, IS_DELETED
// ChucVu:   MACHUCVU, TENCHUCVU
// ════════════════════════════════════════════════════════════
const NV_EMPTY = { TENNV: '', GIOITINH: true, SODIENTHOAI: '', EMAIL: '', DIACHI: '', MACHUCVU: '', IS_DELETED: false };

const NhanVienPage = () => {
    // TODO: thay useState([]) bằng dữ liệu fetch từ API /employees
    const [list, setList] = useState([]);
    // TODO: thay useState([]) bằng dữ liệu fetch từ API /positions
    const [chucVuList] = useState([]);
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState(NV_EMPTY);
    const [editingId, setEditingId] = useState(null);

    const openAdd = () => { setForm(NV_EMPTY); setModal('add'); };
    const openEdit = (nv) => {
        setForm({
            TENNV: nv.TENNV, GIOITINH: nv.GIOITINH ?? true, SODIENTHOAI: nv.SODIENTHOAI || '',
            EMAIL: nv.EMAIL || '', DIACHI: nv.DIACHI || '', MACHUCVU: nv.MACHUCVU, IS_DELETED: nv.IS_DELETED
        });
        setEditingId(nv.MANV);
        setModal('edit');
    };
    const closeModal = () => { setModal(null); setEditingId(null); };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(p => ({ ...p, [name]: value }));
    };

    const handleSave = () => {
        // TODO: gọi API POST /employees hoặc PUT /employees/:id rồi refetch
        const cv = chucVuList.find(c => c.MACHUCVU === Number(form.MACHUCVU));
        if (modal === 'add') {
            setList(p => [...p, { ...form, MANV: Date.now(), MACHUCVU: Number(form.MACHUCVU), chucVu: cv }]);
        } else {
            setList(p => p.map(nv => nv.MANV === editingId ? { ...nv, ...form, MACHUCVU: Number(form.MACHUCVU), chucVu: cv } : nv));
        }
        closeModal();
    };

    const handleDelete = (MANV) => {
        // TODO: gọi API DELETE /employees/:id
        if (window.confirm('Xóa nhân viên này?')) setList(p => p.filter(nv => nv.MANV !== MANV));
    };

    const active = list.filter(nv => !nv.IS_DELETED).length;

    return (
        <>
            <div className="page-header">
                <div className="page-title-block">
                    <div>
                        <div className="page-title">Quản lý nhân viên</div>
                    </div>
                </div>
                <button className="btn-add" onClick={openAdd}>+ Thêm</button>
            </div>

            <div className="data-card">
                <table className="data-table">
                    <thead><tr><th>Nhân viên</th><th>SĐT</th><th>Vai trò</th><th>Trạng thái</th><th></th></tr></thead>
                    <tbody>
                        {list.length === 0 && <tr className="empty-row"><td colSpan={5}>Chưa có nhân viên nào</td></tr>}
                        {list.map((nv, idx) => (
                            <tr key={nv.MANV}>
                                <td>
                                    <div className="cell-entity">
                                        <div className="entity-avatar" style={{ background: avatarColor(idx) }}>
                                            {initials(nv.TENNV)}
                                        </div>
                                        <div>
                                            <div className="entity-name">{nv.TENNV}</div>
                                            <div className="entity-sub">{nv.EMAIL}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>{nv.SODIENTHOAI}</td>
                                <td><span className={roleBadge(nv.chucVu?.TENCHUCVU || '')}>{nv.chucVu?.TENCHUCVU || '—'}</span></td>
                                <td><span className={nv.IS_DELETED ? 'badge badge-inactive' : 'badge badge-active'}>{nv.IS_DELETED ? 'Ngừng' : 'Hoạt động'}</span></td>
                                <td>
                                    <div className="actions-cell">
                                        <button className="btn-edit" onClick={() => openEdit(nv)}>Sửa</button>
                                        <button className="btn-del" onClick={() => handleDelete(nv.MANV)}>Xóa</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {modal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <div className="modal-title">{modal === 'add' ? 'Thêm nhân viên' : 'Chỉnh sửa nhân viên'}</div>
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Họ tên (TENNV)</label>
                                <input className="form-input" name="TENNV" value={form.TENNV} onChange={handleChange} placeholder="" />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">SĐT (SODIENTHOAI)</label>
                                    <input className="form-input" name="SODIENTHOAI" value={form.SODIENTHOAI} onChange={handleChange} placeholder="" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email</label>
                                    <input className="form-input" name="EMAIL" value={form.EMAIL} onChange={handleChange} placeholder="" />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Chức vụ (MACHUCVU)</label>
                                    <select className="form-select" name="MACHUCVU" value={form.MACHUCVU} onChange={handleChange}>
                                        <option value="">-- Chọn chức vụ --</option>
                                        {chucVuList.map(cv => <option key={cv.MACHUCVU} value={cv.MACHUCVU}>{cv.TENCHUCVU}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Trạng thái</label>
                                    <select className="form-select" name="IS_DELETED"
                                        value={form.IS_DELETED ? 'true' : 'false'}
                                        onChange={e => setForm(p => ({ ...p, IS_DELETED: e.target.value === 'true' }))}>
                                        <option value="false">Hoạt động</option>
                                        <option value="true">Ngừng</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Địa chỉ (DIACHI)</label>
                                <input className="form-input" name="DIACHI" value={form.DIACHI} onChange={handleChange} placeholder="" />
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={closeModal}>Hủy</button>
                            <button className="btn-primary" onClick={handleSave}>{modal === 'add' ? 'Thêm' : 'Lưu'}</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

// ════════════════════════════════════════════════════════════
// NHÀ CUNG CẤP
// NhaCungCap: MANCC, TENNCC, DIACHI, SDT, EMAIL, IS_DELETED
// ════════════════════════════════════════════════════════════
const NCC_EMPTY = { TENNCC: '', SDT: '', EMAIL: '', DIACHI: '', IS_DELETED: false };

const NhaCungCapPage = () => {
    // TODO: thay useState([]) bằng dữ liệu fetch từ API /suppliers
    const [list, setList] = useState([]);
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState(NCC_EMPTY);
    const [editingId, setEditingId] = useState(null);

    const openAdd = () => { setForm(NCC_EMPTY); setModal('add'); };
    const openEdit = (ncc) => {
        setForm({ TENNCC: ncc.TENNCC, SDT: ncc.SDT, EMAIL: ncc.EMAIL, DIACHI: ncc.DIACHI, IS_DELETED: ncc.IS_DELETED });
        setEditingId(ncc.MANCC);
        setModal('edit');
    };
    const closeModal = () => { setModal(null); setEditingId(null); };

    const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const handleSave = () => {
        // TODO: gọi API POST /suppliers hoặc PUT /suppliers/:id
        const isDeleted = form.IS_DELETED === 'true' || form.IS_DELETED === true;
        if (modal === 'add') {
            setList(p => [...p, { ...form, MANCC: Date.now(), IS_DELETED: isDeleted }]);
        } else {
            setList(p => p.map(n => n.MANCC === editingId ? { ...n, ...form, IS_DELETED: isDeleted } : n));
        }
        closeModal();
    };

    const handleDelete = (MANCC) => {
        // TODO: gọi API DELETE /suppliers/:id
        if (window.confirm('Xóa nhà cung cấp này?')) setList(p => p.filter(n => n.MANCC !== MANCC));
    };

    const active = list.filter(n => !n.IS_DELETED).length;

    return (
        <>
            <div className="page-header">
                <div className="page-title-block">
                    <div>
                        <div className="page-title">Nhà cung cấp</div>
                    </div>
                </div>
                <button className="btn-add" onClick={openAdd}>+ Thêm NCC</button>
            </div>

            <div className="data-card">
                <table className="data-table">
                    <thead><tr><th>Công ty</th><th>SĐT</th><th>Email</th><th>Địa chỉ</th><th>Trạng thái</th><th></th></tr></thead>
                    <tbody>
                        {list.length === 0 && <tr className="empty-row"><td colSpan={6}>Chưa có nhà cung cấp nào</td></tr>}
                        {list.map((ncc) => (
                            <tr key={ncc.MANCC}>
                                <td><div className="entity-name">{ncc.TENNCC}</div></td>
                                <td>{ncc.SDT}</td>
                                <td style={{ color: 'var(--m-teal)' }}>{ncc.EMAIL}</td>
                                <td style={{ color: 'var(--m-text-muted)' }}>{ncc.DIACHI}</td>
                                <td><span className={ncc.IS_DELETED ? 'badge badge-inactive' : 'badge badge-active'}>{ncc.IS_DELETED ? 'Ngừng' : 'Hoạt động'}</span></td>
                                <td>
                                    <div className="actions-cell">
                                        <button className="btn-edit" onClick={() => openEdit(ncc)}>Sửa</button>
                                        <button className="btn-del" onClick={() => handleDelete(ncc.MANCC)}>Xóa</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {modal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <div className="modal-title">{modal === 'add' ? 'Thêm nhà cung cấp' : 'Chỉnh sửa nhà cung cấp'}</div>
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Tên công ty (TENNCC)</label>
                                <input className="form-input" name="TENNCC" value={form.TENNCC} onChange={handleChange} placeholder="" />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Số điện thoại (SDT)</label>
                                    <input className="form-input" name="SDT" value={form.SDT} onChange={handleChange} placeholder="" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email</label>
                                    <input className="form-input" name="EMAIL" value={form.EMAIL} onChange={handleChange} placeholder="" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Địa chỉ (DIACHI)</label>
                                <input className="form-input" name="DIACHI" value={form.DIACHI} onChange={handleChange} placeholder="" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Trạng thái</label>
                                <select className="form-select" name="IS_DELETED"
                                    value={form.IS_DELETED ? 'true' : 'false'}
                                    onChange={e => setForm(p => ({ ...p, IS_DELETED: e.target.value === 'true' }))}>
                                    <option value="false">Hoạt động</option>
                                    <option value="true">Ngừng</option>
                                </select>
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={closeModal}>Hủy</button>
                            <button className="btn-primary" onClick={handleSave}>{modal === 'add' ? 'Thêm' : 'Lưu'}</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

// ════════════════════════════════════════════════════════════
// SẢN PHẨM
// SanPham: MASP, BARCODE, TENSP, MOTA, DVT, HINHANH,
//          GIABAN, MALOAI, MANCC, IS_DELETED
// TonKho (joined): SOLUONG_CON_LAI, GIANHAP, HANSUDUNG, IS_ACTIVE
// ════════════════════════════════════════════════════════════
const SP_EMPTY = { BARCODE: '', TENSP: '', DVT: 'cái', GIABAN: '', MALOAI: '', MANCC: '', IS_DELETED: false };
const STOCK_MAX = 300;

const SanPhamPage = () => {
    // TODO: thay useState([]) bằng dữ liệu fetch từ API /products (with tonKhos, loaiSanPham, nhaCungCap)
    const [list, setList] = useState([]);
    // TODO: fetch từ API /categories
    const [loaiList] = useState([]);
    // TODO: fetch từ API /suppliers
    const [nccList] = useState([]);
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState(SP_EMPTY);
    const [editingId, setEditingId] = useState(null);

    const openAdd = () => { setForm(SP_EMPTY); setModal('add'); };
    const openEdit = (sp) => {
        setForm({
            BARCODE: sp.BARCODE, TENSP: sp.TENSP, DVT: sp.DVT,
            GIABAN: sp.GIABAN, MALOAI: sp.MALOAI, MANCC: sp.MANCC, IS_DELETED: sp.IS_DELETED
        });
        setEditingId(sp.MASP);
        setModal('edit');
    };
    const closeModal = () => { setModal(null); setEditingId(null); };

    const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const handleSave = () => {
        // TODO: gọi API POST /products hoặc PUT /products/:id
        const loai = loaiList.find(l => l.MALOAI === Number(form.MALOAI));
        const ncc = nccList.find(n => n.MANCC === Number(form.MANCC));
        const payload = {
            ...form, GIABAN: Number(form.GIABAN), MALOAI: Number(form.MALOAI),
            MANCC: Number(form.MANCC), IS_DELETED: form.IS_DELETED === 'true' || form.IS_DELETED === true,
            loaiSanPham: loai, nhaCungCap: ncc
        };
        if (modal === 'add') {
            setList(p => [...p, { ...payload, MASP: Date.now(), tonKhos: [] }]);
        } else {
            setList(p => p.map(sp => sp.MASP === editingId ? { ...sp, ...payload } : sp));
        }
        closeModal();
    };

    const handleDelete = (MASP) => {
        // TODO: gọi API DELETE /products/:id
        if (window.confirm('Xóa sản phẩm này?')) setList(p => p.filter(sp => sp.MASP !== MASP));
    };

    return (
        <>
            <div className="page-header">
                <div className="page-title-block">
                    <div>
                        <div className="page-title">Sản phẩm</div>
                    </div>
                </div>
                <button className="btn-add" onClick={openAdd}>+ Thêm SP</button>
            </div>

            <div className="data-card">
                <table className="data-table">
                    <thead><tr><th>Sản phẩm</th><th>Danh mục</th><th>Giá bán</th><th>Giá vốn</th><th>Tồn</th><th>HSD</th><th></th></tr></thead>
                    <tbody>
                        {list.length === 0 && <tr className="empty-row"><td colSpan={7}>Chưa có sản phẩm nào</td></tr>}
                        {list.map((sp, idx) => {
                            const stock = totalStock(sp.tonKhos);
                            const hsd = earliestHSD(sp.tonKhos);
                            const giaNhap = latestGiaNhap(sp.tonKhos);
                            const cs = catStyle(sp.MALOAI - 1);
                            const pct = Math.min(100, Math.round((stock / STOCK_MAX) * 100));
                            return (
                                <tr key={sp.MASP}>
                                    <td>
                                        <div className="cell-entity">
                                            <div className="entity-avatar" style={{ background: avatarColor(idx), borderRadius: 8 }}>
                                                {(sp.TENSP[0] || '?').toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="entity-name">{sp.TENSP}</div>
                                                <div className="entity-sub">{sp.BARCODE}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span className="badge" style={{ background: cs.bg, color: cs.color }}>{sp.loaiSanPham?.TENLOAI || '—'}</span></td>
                                    <td className="price-main">{fmtVND(sp.GIABAN)}</td>
                                    <td className="price-cost">{giaNhap ? fmtVND(giaNhap) : '—'}</td>
                                    <td>
                                        <div className="stock-cell">
                                            <div className="stock-bar"><div className="stock-fill" style={{ width: `${pct}%` }} /></div>
                                            <span className="stock-count">{stock}</span>
                                        </div>
                                    </td>
                                    <td style={{ color: 'var(--m-text-muted)', fontSize: 13 }}>{fmtDate(hsd)}</td>
                                    <td>
                                        <div className="actions-cell">
                                            <button className="btn-edit" onClick={() => openEdit(sp)}>Sửa</button>
                                            <button className="btn-del" onClick={() => handleDelete(sp.MASP)}>Xóa</button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {modal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <div className="modal-title">{modal === 'add' ? 'Thêm sản phẩm' : 'Chỉnh sửa sản phẩm'}</div>
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Tên sản phẩm (TENSP)</label>
                                <input className="form-input" name="TENSP" value={form.TENSP} onChange={handleChange} placeholder="" />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Barcode</label>
                                    <input className="form-input" name="BARCODE" value={form.BARCODE} onChange={handleChange} placeholder="" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Đơn vị tính (DVT)</label>
                                    <input className="form-input" name="DVT" value={form.DVT} onChange={handleChange} placeholder="" />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Giá bán (GIABAN)</label>
                                    <input className="form-input" type="number" name="GIABAN" value={form.GIABAN} onChange={handleChange} placeholder="" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Loại sản phẩm (MALOAI)</label>
                                    <select className="form-select" name="MALOAI" value={form.MALOAI} onChange={handleChange}>
                                        <option value="">-- Chọn loại --</option>
                                        {loaiList.map(l => <option key={l.MALOAI} value={l.MALOAI}>{l.TENLOAI}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Nhà cung cấp (MANCC)</label>
                                    <select className="form-select" name="MANCC" value={form.MANCC} onChange={handleChange}>
                                        <option value="">-- Chọn NCC --</option>
                                        {nccList.map(n => <option key={n.MANCC} value={n.MANCC}>{n.TENNCC}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Trạng thái</label>
                                    <select className="form-select" name="IS_DELETED"
                                        value={form.IS_DELETED ? 'true' : 'false'}
                                        onChange={e => setForm(p => ({ ...p, IS_DELETED: e.target.value === 'true' }))}>
                                        <option value="false">Đang bán</option>
                                        <option value="true">Ngừng bán</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={closeModal}>Hủy</button>
                            <button className="btn-primary" onClick={handleSave}>{modal === 'add' ? 'Thêm' : 'Lưu'}</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

// ════════════════════════════════════════════════════════════
// PHIẾU NHẬP / PHIẾU HỦY
// PhieuNhap: MAPHIEU, NGAYLAP, MANV, TONGTIEN, GCHU, IS_DELETED
// PhieuHuy:  MAPHIEU, NGAYLAP, MANV, LYDO, IS_DELETED
// ════════════════════════════════════════════════════════════
const NHAP_EMPTY = { NGAYLAP: '', TONGTIEN: '', GCHU: '' };
const HUY_EMPTY = { NGAYLAP: '', LYDO: '' };

const PhieuNhapHuyPage = () => {
    const [tab, setTab] = useState('nhap');

    // TODO: thay useState([]) bằng dữ liệu fetch từ API /purchase-orders
    const [nhapList, setNhapList] = useState([]);
    const [nhapModal, setNhapModal] = useState(null);
    const [nhapForm, setNhapForm] = useState(NHAP_EMPTY);

    // TODO: thay useState([]) bằng dữ liệu fetch từ API /disposal-slips
    const [huyList, setHuyList] = useState([]);
    const [huyModal, setHuyModal] = useState(null);
    const [huyForm, setHuyForm] = useState(HUY_EMPTY);

    const openAddNhap = () => { setNhapForm(NHAP_EMPTY); setNhapModal('add'); };
    const closeNhapModal = () => setNhapModal(null);
    const handleNhapChange = (e) => setNhapForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const saveNhap = () => {
        // TODO: gọi API POST /purchase-orders
        setNhapList(p => [...p, {
            ...nhapForm, MAPHIEU: Date.now(), TONGTIEN: Number(nhapForm.TONGTIEN),
            IS_DELETED: false, TRANGTHAI: 'PENDING', nhaCungCap: null
        }]);
        closeNhapModal();
    };

    const approveNhap = (MAPHIEU) => {
        // TODO: gọi API PUT /purchase-orders/:id để cập nhật TRANGTHAI
        setNhapList(p => p.map(x => x.MAPHIEU === MAPHIEU ? { ...x, TRANGTHAI: 'APPROVED' } : x));
    };
    const cancelNhap = (MAPHIEU) => {
        if (window.confirm('Hủy phiếu nhập này?'))
            setNhapList(p => p.map(x => x.MAPHIEU === MAPHIEU ? { ...x, TRANGTHAI: 'CANCELLED', IS_DELETED: true } : x));
    };

    const openAddHuy = () => { setHuyForm(HUY_EMPTY); setHuyModal('add'); };
    const closeHuyModal = () => setHuyModal(null);
    const handleHuyChange = (e) => setHuyForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const saveHuy = () => {
        // TODO: gọi API POST /disposal-slips
        setHuyList(p => [...p, { ...huyForm, MAPHIEU: Date.now(), IS_DELETED: false, TRANGTHAI: 'PENDING' }]);
        closeHuyModal();
    };

    const approveHuy = (MAPHIEU) => {
        // TODO: gọi API PUT /disposal-slips/:id
        setHuyList(p => p.map(x => x.MAPHIEU === MAPHIEU ? { ...x, TRANGTHAI: 'APPROVED' } : x));
    };
    const cancelHuy = (MAPHIEU) => {
        if (window.confirm('Hủy phiếu này?')) setHuyList(p => p.filter(x => x.MAPHIEU !== MAPHIEU));
    };

    return (
        <>
            <div className="page-header">
                <div className="page-title-block">
                    <div>
                        <div className="page-title">Phiếu nhập / Phiếu hủy</div>
                    </div>
                </div>
                <button className="btn-add" onClick={tab === 'nhap' ? openAddNhap : openAddHuy}>+ Tạo phiếu</button>
            </div>

            <div className="tab-bar">
                <button className={`tab-btn ${tab === 'nhap' ? 'active' : ''}`} onClick={() => setTab('nhap')}>Phiếu nhập</button>
                <button className={`tab-btn ${tab === 'huy' ? 'active' : ''}`} onClick={() => setTab('huy')}>Phiếu hủy</button>
            </div>

            {tab === 'nhap' && (
                <div className="data-card">
                    <table className="data-table">
                        <thead><tr><th>Mã phiếu</th><th>Ngày lập</th><th>NCC</th><th>Tổng tiền</th><th>Trạng thái</th><th></th></tr></thead>
                        <tbody>
                            {nhapList.length === 0 && <tr className="empty-row"><td colSpan={6}>Chưa có phiếu nhập nào</td></tr>}
                            {nhapList.map((p) => {
                                const st = STATUS_MAP[p.TRANGTHAI] || { label: p.TRANGTHAI, cls: 'badge' };
                                return (
                                    <tr key={p.MAPHIEU}>
                                        <td><span className="code-link">IMP-{String(p.MAPHIEU).padStart(3, '0')}</span></td>
                                        <td style={{ color: 'var(--m-text-muted)' }}>{fmtDate(p.NGAYLAP)}</td>
                                        <td>{p.nhaCungCap?.TENNCC || <span style={{ color: 'var(--m-text-muted)' }}>—</span>}</td>
                                        <td className="price-main">{fmtVND(p.TONGTIEN)}</td>
                                        <td><span className={st.cls}>{st.label}</span></td>
                                        <td>
                                            {p.TRANGTHAI === 'PENDING' ? (
                                                <div className="actions-cell">
                                                    <button className="btn-approve" onClick={() => approveNhap(p.MAPHIEU)}>Duyệt</button>
                                                    <button className="btn-cancel" onClick={() => cancelNhap(p.MAPHIEU)}>Hủy</button>
                                                </div>
                                            ) : <span style={{ color: 'var(--m-text-muted)', fontSize: 13 }}>—</span>}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {tab === 'huy' && (
                <div className="data-card">
                    <table className="data-table">
                        <thead><tr><th>Mã phiếu</th><th>Ngày lập</th><th>Nhân viên</th><th>Lý do</th><th>Trạng thái</th><th></th></tr></thead>
                        <tbody>
                            {huyList.length === 0 && <tr className="empty-row"><td colSpan={6}>Chưa có phiếu hủy nào</td></tr>}
                            {huyList.map((p) => {
                                const st = STATUS_MAP[p.TRANGTHAI] || { label: p.TRANGTHAI, cls: 'badge' };
                                return (
                                    <tr key={p.MAPHIEU}>
                                        <td><span className="code-link">DSP-{String(p.MAPHIEU).padStart(3, '0')}</span></td>
                                        <td style={{ color: 'var(--m-text-muted)' }}>{fmtDate(p.NGAYLAP)}</td>
                                        <td>{p.nhanVien?.TENNV || '—'}</td>
                                        <td style={{ color: 'var(--m-text-muted)' }}>{p.LYDO || '—'}</td>
                                        <td><span className={st.cls}>{st.label}</span></td>
                                        <td>
                                            {p.TRANGTHAI === 'PENDING' ? (
                                                <div className="actions-cell">
                                                    <button className="btn-approve" onClick={() => approveHuy(p.MAPHIEU)}>Duyệt</button>
                                                    <button className="btn-cancel" onClick={() => cancelHuy(p.MAPHIEU)}>Hủy</button>
                                                </div>
                                            ) : <span style={{ color: 'var(--m-text-muted)', fontSize: 13 }}>—</span>}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal: Tạo phiếu nhập */}
            {nhapModal && (
                <div className="modal-overlay" onClick={closeNhapModal}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <div className="modal-title">Tạo phiếu nhập</div>
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Ngày lập (NGAYLAP)</label>
                                <input className="form-input" type="date" name="NGAYLAP" value={nhapForm.NGAYLAP} onChange={handleNhapChange} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Tổng tiền (TONGTIEN)</label>
                                <input className="form-input" type="number" name="TONGTIEN" value={nhapForm.TONGTIEN} onChange={handleNhapChange} placeholder="" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Ghi chú (GCHU)</label>
                                <input className="form-input" name="GCHU" value={nhapForm.GCHU} onChange={handleNhapChange} placeholder="" />
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={closeNhapModal}>Hủy</button>
                            <button className="btn-primary" onClick={saveNhap}>Tạo phiếu</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: Tạo phiếu hủy */}
            {huyModal && (
                <div className="modal-overlay" onClick={closeHuyModal}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <div className="modal-title">Tạo phiếu hủy</div>
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Ngày lập (NGAYLAP)</label>
                                <input className="form-input" type="date" name="NGAYLAP" value={huyForm.NGAYLAP} onChange={handleHuyChange} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Lý do hủy (LYDO)</label>
                                <input className="form-input" name="LYDO" value={huyForm.LYDO} onChange={handleHuyChange} placeholder="Hàng hết hạn / bị hỏng..." />
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={closeHuyModal}>Hủy</button>
                            <button className="btn-primary" onClick={saveHuy}>Tạo phiếu</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

// ════════════════════════════════════════════════════════════
// LAYOUT + ROUTING
// ════════════════════════════════════════════════════════════
const MENU_ITEMS = [
    { id: 'employees', label: 'Nhân viên' },
    { id: 'suppliers', label: 'Nhà cung cấp' },
    { id: 'products', label: 'Sản phẩm', },
    { id: 'vouchers', label: 'Phiếu nhập / hủy', },
    { id: 'reports', label: 'Báo cáo doanh thu', },
];

// TODO: thay CURRENT_USER bằng dữ liệu từ auth context / API /auth/me
const CURRENT_USER = {
    MANV: null,
    TENNV: '...',
    chucVu: { MACHUCVU: null, TENCHUCVU: '...' },
};

const Manage = () => {
    const [currentPage, setCurrentPage] = useState('employees');
    const user = CURRENT_USER;

    const renderContent = () => {
        switch (currentPage) {
            case 'suppliers': return <NhaCungCapPage />;
            case 'products': return <SanPhamPage />;
            case 'vouchers': return <PhieuNhapHuyPage />;
            default: return <NhanVienPage />;
        }
    };

    const dateStr = new Date().toLocaleDateString('vi-VN', {
        weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric',
    });

    return (
        <div className="manage-app">
            <Header />
            <div className="manage-layout">
                {/* ── Sidebar ─────────────────────────────────────────────── */}
                <aside className="manage-sidebar">
                    <nav className="sidebar-nav">
                        {MENU_ITEMS.map((item) => (
                            <button key={item.id}
                                className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
                                onClick={() => setCurrentPage(item.id)}>
                                <span className="nav-label">{item.label}</span>
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* ── Main ────────────────────────────────────────────────── */}
                <div className="manage-main">
                    <main className="manage-content">
                        {renderContent()}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Manage;
