import React from 'react';

export const emptyCategory = { 
    TENLOAI: '', MOTA: ''
};

export const CategoryForm = ({ form, hc, setForm }) => (
    <>
        <div className="form-group">
            <label className="form-label">Tên loại sản phẩm</label>
            <input className="form-input" name="TENLOAI" value={form.TENLOAI || ''} onChange={hc} placeholder="Đồ uống, Thực phẩm..." />
        </div>
        <div className="form-group">
            <label className="form-label">Mô tả</label>
            <input className="form-input" name="MOTA" value={form.MOTA || ''} onChange={hc} placeholder="Mô tả bổ sung" />
        </div>
    </>
);
