import React, { useState, useEffect } from 'react';
import { Ico } from '../../components/Manage/Icons';
import api from '../../services/api';

export const emptyPromotion = {
    MASP: [],
    TEN_CHUONG_TRINH: '',
    LOAI_GIAM: 0,
    GIATRI_GIAM: '',
    NGAYBD: '',
    NGAYKT: '',
    TRANGTHAI: true
};

export const PromotionForm = ({ form, hc, setForm }) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        api.get('/products')
            .then(res => setProducts(res.data.data || res.data))
            .catch(console.error);
    }, []);

    const toggleProduct = (masp) => {
        setForm(prev => {
            const cur = prev.MASP || [];
            const next = cur.includes(masp)
                ? cur.filter(x => x !== masp)
                : [...cur, masp];
            return { ...prev, MASP: next };
        });
    };

    const selected = form.MASP || [];

    return (
        <div className="form-grid">
            {/* ── Section: Tên chương trình ── */}
            <div className="form-section-title">
                {Ico.tag} Thông tin chương trình
            </div>

            <div className="form-group">
                <label className="form-label">Tên chương trình khuyến mãi *</label>
                <input
                    className="form-input"
                    name="TEN_CHUONG_TRINH"
                    value={form.TEN_CHUONG_TRINH}
                    onChange={hc}
                    placeholder="VD: Khuyến mãi hè 2026, Xả kho cuối năm..."
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Loại giảm giá</label>
                    <select
                        className="form-select"
                        name="LOAI_GIAM"
                        value={form.LOAI_GIAM}
                        onChange={e => setForm(p => ({ ...p, LOAI_GIAM: parseInt(e.target.value) }))}
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
                        className="form-input"
                        type="number"
                        name="GIATRI_GIAM"
                        value={form.GIATRI_GIAM}
                        onChange={hc}
                        placeholder={form.LOAI_GIAM === 0 ? 'VD: 10, 20, 50' : 'VD: 50000'}
                        min="0"
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Ngày bắt đầu *</label>
                    <input
                        className="form-input"
                        type="datetime-local"
                        name="NGAYBD"
                        value={form.NGAYBD}
                        onChange={hc}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Ngày kết thúc *</label>
                    <input
                        className="form-input"
                        type="datetime-local"
                        name="NGAYKT"
                        value={form.NGAYKT}
                        onChange={hc}
                    />
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

                {selected.length === 0 && products.length > 0 && (
                    <div className="form-help" style={{ color: 'var(--red)', marginBottom: 10, fontSize: 13, display: 'block', width: '100%' }}>
                        Chọn ít nhất 1 sản phẩm để áp dụng khuyến mãi.
                    </div>
                )}

                <div className="product-picker" style={{ width: '100%', display: 'grid' }}>
                    {products.length === 0 && (
                        <div className="form-empty-hint">Đang tải danh sách sản phẩm...</div>
                    )}
                    {products.map(p => {
                        const isSelected = selected.includes(p.MASP);
                        return (
                            <label
                                key={p.MASP}
                                className={`product-pick-item${isSelected ? ' selected' : ''}`}
                            >
                                <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => toggleProduct(p.MASP)}
                                    className="product-pick-chk"
                                />
                                <div className="product-pick-info">
                                    <span className="product-pick-name">{p.TENSP}</span>
                                    <span className="product-pick-price">
                                        {parseInt(p.GIABAN).toLocaleString('vi-VN')} ₫
                                    </span>
                                </div>
                            </label>
                        );
                    })}
                </div>
            </div>

            {/* ── Toggle: Kích hoạt ngay ── */}
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
        </div>
    );
};
