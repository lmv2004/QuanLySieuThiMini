import React from 'react';

export const emptyCustomer = { 
    TENKH: '', SODIENTHOAI: '', DIACHI: '', DIEMTHUONG: 0, IS_DELETED: false 
};

export const CustomerForm = ({ form, hc, setForm }) => (
    <>
        <div className="form-group">
            <label className="form-label">Tên khách hàng</label>
            <input className="form-input" name="TENKH" value={form.TENKH || ''} onChange={hc} placeholder="Nguyễn Văn A" />
        </div>
        <div className="form-row">
            <div className="form-group">
                <label className="form-label">Số điện thoại</label>
                <input className="form-input" name="SODIENTHOAI" value={form.SODIENTHOAI || ''} onChange={hc} placeholder="0901 234 567" />
            </div>
            <div className="form-group">
                <label className="form-label">Điểm thưởng</label>
                <input type="number" className="form-input" name="DIEMTHUONG" value={form.DIEMTHUONG || 0} onChange={hc} />
            </div>
        </div>
        <div className="form-group">
            <label className="form-label">Địa chỉ</label>
            <input className="form-input" name="DIACHI" value={form.DIACHI || ''} onChange={hc} placeholder="123 Nguyễn Huệ, Quận 1" />
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
