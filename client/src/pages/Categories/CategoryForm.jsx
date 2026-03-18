import React from 'react';

export const emptyCategory = { 
    TENLOAI: '', MOTA: '', IS_DELETED: false 
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
        <div className="form-group">
            <label className="form-label">Trạng thái</label>
            <select className="form-select" name="IS_DELETED" value={form.IS_DELETED ? 'true' : 'false'} onChange={e => setForm(p => ({ ...p, IS_DELETED: e.target.value === 'true' }))}>
                <option value="false">Hoạt động</option>
                <option value="true">Bị khóa</option>
            </select>
        </div>
    </>
);
