import React from 'react';

export const emptyProduct = { BARCODE: '', TENSP: '', DVT: 'cái', GIABAN: '', MALOAI: '', IS_DELETED: false };

export const ProductForm = ({ form, hc, setForm }) => (
    <>
        <div className="form-group">
            <label className="form-label">Tên sản phẩm</label>
            <input className="form-input" name="TENSP" value={form.TENSP} onChange={hc} placeholder="Nước ngọt Coca-Cola 330ml" />
        </div>
        <div className="form-row">
            <div className="form-group">
                <label className="form-label">Barcode</label>
                <input className="form-input" name="BARCODE" value={form.BARCODE} onChange={hc} placeholder="8934588..." />
            </div>
            <div className="form-group">
                <label className="form-label">Đơn vị tính</label>
                <input className="form-input" name="DVT" value={form.DVT} onChange={hc} placeholder="cái / hộp / kg" />
            </div>
        </div>
        <div className="form-row">
            <div className="form-group">
                <label className="form-label">Giá bán (₫)</label>
                <input className="form-input" type="number" name="GIABAN" value={form.GIABAN} onChange={hc} placeholder="15000" />
            </div>
            <div className="form-group">
                <label className="form-label">Trạng thái</label>
                <select className="form-select" name="IS_DELETED" value={form.IS_DELETED ? 'true' : 'false'} onChange={e => setForm(p => ({ ...p, IS_DELETED: e.target.value === 'true' }))}>
                    <option value="false">Đang bán</option>
                    <option value="true">Ngừng bán</option>
                </select>
            </div>
        </div>
    </>
);
