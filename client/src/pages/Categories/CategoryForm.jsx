import React from 'react';

export const emptyCategory = { 
    TENLOAI: '', MOTA: ''
};

export const CategoryForm = ({ form, hc, setForm, formErrors = {} }) => (
    <>
        <div className="form-group">
            <label className="form-label">Tên loại sản phẩm *</label>
            <input className="form-input" name="TENLOAI" value={form.TENLOAI || ''} onChange={hc} placeholder="Đồ uống, Thực phẩm..." />
            {formErrors.TENLOAI && <span className="form-error">{formErrors.TENLOAI}</span>}
        </div>
        <div className="form-group">
            <label className="form-label">Mô tả</label>
            <input className="form-input" name="MOTA" value={form.MOTA || ''} onChange={hc} placeholder="Mô tả bổ sung" />
            {formErrors.MOTA && <span className="form-error">{formErrors.MOTA}</span>}
        </div>
    </>
);
