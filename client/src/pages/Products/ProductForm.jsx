import React, { useEffect, useMemo, useState } from 'react';
import api from '../../services/api';

export const emptyProduct = {
    MASP: '',
    BARCODE: '',
    TENSP: '',
    MOTA: '',
    DVT: 'cái',
    HINHANH: '',
    GIABAN: '',
    MALOAI: '',
    MANCC: '',
    LOAISP: null,
    NHACC: null,
    IS_DELETED: false,
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

export const ProductForm = ({ form, hc, setForm, readOnly = false, errors = {}, mode }) => {
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [loadingCats, setLoadingCats] = useState(false);
    const [loadingSup, setLoadingSup] = useState(false);

    useEffect(() => {
        setLoadingCats(true);
        api.get('/categories', { params: { per_page: 500 } })
            .then(res => setCategories(res.data?.data || res.data || []))
            .catch(() => setCategories([]))
            .finally(() => setLoadingCats(false));
    }, []);

    useEffect(() => {
        setLoadingSup(true);
        api.get('/suppliers', { params: { per_page: 500 } })
            .then(res => setSuppliers(res.data?.data || res.data || []))
            .catch(() => setSuppliers([]))
            .finally(() => setLoadingSup(false));
    }, []);

    const maloai = form.MALOAI ?? form.LOAISP?.MALOAI ?? '';
    const mancc = form.MANCC ?? form.NHACC?.MANCC ?? '';

    const categoryName = useMemo(() => {
        if (form.LOAISP?.TENLOAI) return form.LOAISP.TENLOAI;
        const match = categories.find(c => String(c.MALOAI) === String(maloai));
        return match?.TENLOAI || '';
    }, [categories, form.LOAISP, maloai]);

    const supplierName = useMemo(() => {
        if (form.NHACC?.TENNCC) return form.NHACC.TENNCC;
        const match = suppliers.find(s => String(s.MANCC) === String(mancc));
        return match?.TENNCC || '';
    }, [suppliers, form.NHACC, mancc]);

    return (
        <>
            {readOnly && (
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Mã sản phẩm</label>
                        <input className="form-input" value={form.MASP || '—'} readOnly />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Trạng thái</label>
                        <input className="form-input" value={form.IS_DELETED ? 'Ngừng bán' : 'Đang bán'} readOnly />
                    </div>
                </div>
            )}

            <div className="form-group">
                <label className="form-label">Tên sản phẩm</label>
                <input
                    className="form-input"
                    name="TENSP"
                    value={form.TENSP || ''}
                    onChange={hc}
                    placeholder="Nước ngọt Coca-Cola 330ml"
                    readOnly={readOnly}
                    style={errStyle(errors, 'TENSP')}
                />
                <FieldError errors={errors} name="TENSP" />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Barcode</label>
                    <input
                        className="form-input"
                        name="BARCODE"
                        value={form.BARCODE || ''}
                        onChange={hc}
                        placeholder="8934588..."
                        readOnly={readOnly}
                        style={errStyle(errors, 'BARCODE')}
                    />
                    <FieldError errors={errors} name="BARCODE" />
                </div>
                <div className="form-group">
                    <label className="form-label">Đơn vị tính</label>
                    <input
                        className="form-input"
                        name="DVT"
                        value={form.DVT || ''}
                        onChange={hc}
                        placeholder="cái / hộp / kg"
                        readOnly={readOnly}
                        style={errStyle(errors, 'DVT')}
                    />
                    <FieldError errors={errors} name="DVT" />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Giá bán (₫)</label>
                    <input
                        className="form-input"
                        type="number"
                        name="GIABAN"
                        value={form.GIABAN || ''}
                        onChange={hc}
                        placeholder="15000"
                        readOnly={readOnly}
                        style={errStyle(errors, 'GIABAN')}
                    />
                    <FieldError errors={errors} name="GIABAN" />
                </div>
                {!readOnly && (
                    <div className="form-group">
                        <label className="form-label">Trạng thái</label>
                        <select
                            className="form-select"
                            name="IS_DELETED"
                            value={form.IS_DELETED ? 'true' : 'false'}
                            onChange={e => setForm(p => ({ ...p, IS_DELETED: e.target.value === 'true' }))}
                        >
                            <option value="false">Đang bán</option>
                            <option value="true">Ngừng bán</option>
                        </select>
                    </div>
                )}
            </div>

            <div className="form-group">
                <label className="form-label">Mô tả</label>
                <textarea
                    className="form-input"
                    name="MOTA"
                    value={form.MOTA || ''}
                    onChange={hc}
                    placeholder="Mô tả sản phẩm"
                    readOnly={readOnly}
                    style={{ minHeight: 90, resize: 'vertical', ...errStyle(errors, 'MOTA') }}
                />
                <FieldError errors={errors} name="MOTA" />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Loại sản phẩm</label>
                    {readOnly ? (
                        <input className="form-input" value={categoryName ? `${categoryName}${maloai ? ` (#${maloai})` : ''}` : '—'} readOnly />
                    ) : (
                        <select
                            className="form-select"
                            name="MALOAI"
                            value={maloai}
                            onChange={hc}
                            disabled={loadingCats}
                            style={errStyle(errors, 'MALOAI')}
                        >
                            <option value="">
                                {loadingCats ? 'Đang tải...' : '-- Chọn loại --'}
                            </option>
                            {categories.map(c => (
                                <option key={c.MALOAI} value={c.MALOAI}>#{c.MALOAI} · {c.TENLOAI}</option>
                            ))}
                        </select>
                    )}
                    <FieldError errors={errors} name="MALOAI" />
                </div>

                <div className="form-group">
                    <label className="form-label">Nhà cung cấp</label>
                    {readOnly ? (
                        <input className="form-input" value={supplierName ? `${supplierName}${mancc ? ` (#${mancc})` : ''}` : '—'} readOnly />
                    ) : (
                        <select
                            className="form-select"
                            name="MANCC"
                            value={mancc}
                            onChange={hc}
                            disabled={loadingSup}
                            style={errStyle(errors, 'MANCC')}
                        >
                            <option value="">
                                {loadingSup ? 'Đang tải...' : '-- Chọn NCC --'}
                            </option>
                            {suppliers.map(s => (
                                <option key={s.MANCC} value={s.MANCC}>#{s.MANCC} · {s.TENNCC}</option>
                            ))}
                        </select>
                    )}
                    <FieldError errors={errors} name="MANCC" />
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">Hình ảnh (URL)</label>
                <input
                    className="form-input"
                    name="HINHANH"
                    value={form.HINHANH || ''}
                    onChange={hc}
                    placeholder="https://..."
                    readOnly={readOnly}
                    style={errStyle(errors, 'HINHANH')}
                />
                <FieldError errors={errors} name="HINHANH" />
                {form.HINHANH && (
                    <div style={{ marginTop: 10 }}>
                        <img
                            src={form.HINHANH}
                            alt={form.TENSP || 'Hình ảnh sản phẩm'}
                            style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)' }}
                        />
                    </div>
                )}
            </div>
        </>
    );
};
