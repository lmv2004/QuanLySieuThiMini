import React, { useState, useEffect } from 'react';
import { Ico } from '../../components/Manage/Icons';
import api from '../../services/api';
import { fmtDate, fmtVND } from '../../components/Manage/Shared';

export const emptyPromotion = {
    ID: null,
    _items: [],
    MASP: [],
    TEN_CHUONG_TRINH: '',
    LOAI_GIAM: 0,
    GIATRI_GIAM: 0,
    NGAYBD: '',
    NGAYKT: '',
    TRANGTHAI: true
};

export const validatePromotion = (form) => {
    const errs = {};
    if (!form.TEN_CHUONG_TRINH || !form.TEN_CHUONG_TRINH.trim()) {
        errs.TEN_CHUONG_TRINH = 'Vui lòng nhập tên chương trình khuyến mãi.';
    }

    if (!form.GIATRI_GIAM || form.GIATRI_GIAM <= 0) {
        errs.GIATRI_GIAM = 'Giá trị giảm phải lớn hơn 0.';
    } else if (form.LOAI_GIAM === 0 && form.GIATRI_GIAM > 100) {
        errs.GIATRI_GIAM = 'Phần trăm giảm không được vượt quá 100%.';
    }

    const now = new Date();
    now.setSeconds(0, 0);

    if (!form.NGAYBD) {
        errs.NGAYBD = 'Vui lòng chọn ngày bắt đầu.';
    }

    if (!form.NGAYKT) {
        errs.NGAYKT = 'Vui lòng chọn ngày kết thúc.';
    } else if (new Date(form.NGAYKT) < now) {
        errs.NGAYKT = 'Thời gian kết thúc không thể bé hơn hiện tại.';
    } else if (form.NGAYBD && new Date(form.NGAYKT) <= new Date(form.NGAYBD)) {
        errs.NGAYKT = 'Thời gian kết thúc phải sau thời gian bắt đầu.';
    }

    if (!form.MASP || form.MASP.length === 0) {
        errs.MASP = 'Vui lòng chọn ít nhất 1 sản phẩm để áp dụng.';
    }

    return errs;
};

const ErrMsg = ({ msg }) =>
    msg ? (
        <span style={{ fontSize: 11, color: '#ef4444', display: 'block', marginTop: 4, fontWeight: 600 }}>
            ⚠ {msg}
        </span>
    ) : null;

export const PromotionForm = ({ form, hc, setForm, readOnly, errors = {} }) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        api.get('/products')
            .then(res => setProducts(res.data.data || res.data))
            .catch(console.error);
    }, []);

    const toggleProduct = (masp) => {
        if (readOnly) return;
        setForm(prev => {
            const cur = Array.isArray(prev.MASP) ? prev.MASP : (prev.MASP ? [prev.MASP] : []);

            const next = cur.includes(masp)
                ? cur.filter(x => x !== masp)
                : [...cur, masp];
            return { ...prev, MASP: next };
        });
    };

    const selected = (Array.isArray(form.MASP) ? form.MASP : (form.MASP ? [form.MASP] : [])).map(x => String(x));

    // Hàm so sánh linh hoạt (không phân biệt string/number)
    const isItemSelected = (id) => selected.some(s => String(s) === String(id));

    const formatDTL = (d) => {
        if (!d) return '';
        try {
            const dt = new Date(d);
            if (isNaN(dt.getTime())) return String(d).slice(0, 16);
            const Y = dt.getFullYear();
            const M = String(dt.getMonth() + 1).padStart(2, '0');
            const D = String(dt.getDate()).padStart(2, '0');
            const h = String(dt.getHours()).padStart(2, '0');
            const m = String(dt.getMinutes()).padStart(2, '0');
            return `${Y}-${M}-${D}T${h}:${m}`;
        } catch (e) { return ''; }
    };

    return (
        <div className="promotion-form-single">
            <div className="form-grid" style={{ padding: '10px 5px' }}>
                {/* ── Section: Tên chương trình ── */}
                <div className="form-section-title">
                    {Ico.tag} Thông tin chương trình
                </div>

                <div className="form-group">
                    <label className="form-label">Tên chương trình khuyến mãi *</label>
                    <input
                        className={`form-input${errors.TEN_CHUONG_TRINH ? ' error' : ''}`}
                        name="TEN_CHUONG_TRINH"
                        value={form.TEN_CHUONG_TRINH}
                        onChange={hc}
                        placeholder="VD: Khuyến mãi hè 2026, Xả kho cuối năm..."
                        disabled={readOnly}
                        style={errors.TEN_CHUONG_TRINH ? { borderColor: '#ef4444', background: '#fff5f5' } : {}}
                    />
                    <ErrMsg msg={errors.TEN_CHUONG_TRINH} />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Loại giảm giá</label>
                        <select
                            className="form-select"
                            name="LOAI_GIAM"
                            value={form.LOAI_GIAM}
                            onChange={e => setForm(p => ({ ...p, LOAI_GIAM: parseInt(e.target.value) }))}
                            disabled={readOnly}
                        >
                            <option value={0}>Theo phần trăm (%)</option>
                            <option value={1}>Theo tiền mặt (VNĐ)</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">
                            Giá trị giảm {form.LOAI_GIAM === 0 ? '(%)' : '(₫)'}  *
                        </label>
                        <input
                            className={`form-input${errors.GIATRI_GIAM ? ' error' : ''}`}
                            type="number"
                            name="GIATRI_GIAM"
                            value={form.GIATRI_GIAM}
                            onChange={hc}
                            placeholder={form.LOAI_GIAM === 0 ? 'VD: 10, 20, 50' : 'VD: 50000'}
                            min="0"
                            disabled={readOnly}
                            style={errors.GIATRI_GIAM ? { borderColor: '#ef4444', background: '#fff5f5' } : {}}
                        />
                        <ErrMsg msg={errors.GIATRI_GIAM} />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Ngày bắt đầu *</label>
                        <input
                            className={`form-input${errors.NGAYBD ? ' error' : ''}`}
                            type="datetime-local"
                            name="NGAYBD"
                            value={formatDTL(form.NGAYBD)}
                            onChange={hc}
                            disabled={readOnly}
                            style={errors.NGAYBD ? { borderColor: '#ef4444', background: '#fff5f5' } : {}}
                        />
                        <ErrMsg msg={errors.NGAYBD} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Ngày kết thúc *</label>
                        <input
                            className={`form-input${errors.NGAYKT ? ' error' : ''}`}
                            type="datetime-local"
                            name="NGAYKT"
                            value={formatDTL(form.NGAYKT)}
                            onChange={hc}
                            disabled={readOnly}
                            style={errors.NGAYKT ? { borderColor: '#ef4444', background: '#fff5f5' } : {}}
                        />
                        <ErrMsg msg={errors.NGAYKT} />
                    </div>
                </div>

                {/* ── Section: Chọn sản phẩm ── */}
                <div style={{ width: '100%' }}>
                    <div className="form-section-title" style={{ marginTop: 4 }}>
                        {Ico.package} Sản phẩm áp dụng
                        {selected.length > 0 && (
                            <span className="form-section-badge">{selected.length} đã chọn</span>
                        )}
                    </div>

                    {!readOnly && selected.length === 0 && products.length > 0 && (
                        <div className="form-help" style={{ color: 'var(--red)', marginBottom: 10, fontSize: 13, display: 'block', width: '100%' }}>
                            Chọn ít nhất 1 sản phẩm để áp dụng khuyến mãi.
                        </div>
                    )}
                    <ErrMsg msg={errors.MASP} />

                    <div className="product-picker" style={{ width: '100%', display: 'grid', border: errors.MASP ? '1.5px solid #ef4444' : undefined }}>
                        {!Array.isArray(products) || products.length === 0 ? (
                            <div className="form-empty-hint">
                                {!Array.isArray(products) ? 'Lỗi dữ liệu sản phẩm' : 'Đang tải danh sách sản phẩm...'}
                            </div>
                        ) : (
                            [...products]
                                .sort((a, b) => {
                                    const selA = isItemSelected(a.MASP);
                                    const selB = isItemSelected(b.MASP);
                                    if (selA && !selB) return -1;
                                    if (!selA && selB) return 1;
                                    return 0;
                                })
                                .map(p => {
                                    const isSelected = isItemSelected(p.MASP);
                                    // Nếu ở chế độ readOnly, chỉ hiện những mốc đã chọn
                                    if (readOnly && !isSelected) return null;

                                    return (
                                        <label
                                            key={p.MASP}
                                            className={`product-pick-item${isSelected ? ' selected' : ''}${readOnly ? ' readonly' : ''}`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => !readOnly && toggleProduct(p.MASP)}
                                                className="product-pick-chk"
                                                disabled={readOnly}
                                            />
                                            <div className="product-pick-info">
                                                <span className="product-pick-name">{p.TENSP}</span>
                                                <span className="product-pick-price">
                                                    {parseInt(p.GIABAN).toLocaleString('vi-VN')} ₫
                                                </span>
                                            </div>
                                        </label>
                                    );
                                })
                        )}
                        {readOnly && selected.length === 0 && Array.isArray(products) && products.length > 0 && (
                            <div className="form-empty-hint">Không có sản phẩm nào được chọn.</div>
                        )}
                    </div>
                </div>

                {/* ── Toggle: Kích hoạt ngay ── */}
                {!readOnly && (
                    <label className="form-toggle-row" htmlFor="chk-promo-status">
                        <div className="form-toggle-info">
                            <span className="form-toggle-label">Kích hoạt ngay</span>
                            <span className="form-toggle-desc">Áp dụng khuyến mãi ngay sau khi lưu</span>
                        </div>
                        <input
                            type="checkbox"
                            id="chk-promo-status"
                            name="TRANGTHAI"
                            checked={!!form.TRANGTHAI}
                            onChange={hc}
                            className="form-checkbox"
                        />
                    </label>
                )}
            </div>
        </div>
    );
};
