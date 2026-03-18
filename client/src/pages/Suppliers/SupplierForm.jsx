import React from 'react';

export const emptySupplier = { TENNCC: '', SDT: '', EMAIL: '', DIACHI: '', IS_DELETED: false };

export const SupplierForm = ({ form, hc, setForm }) => (
    <>
        <div className="form-group"><label className="form-label">Tên công ty</label><input className="form-input" name="TENNCC" value={form.TENNCC} onChange={hc} placeholder="Công ty TNHH ABC" /></div>
        <div className="form-row"><div className="form-group"><label className="form-label">Số điện thoại</label><input className="form-input" name="SDT" value={form.SDT} onChange={hc} /></div><div className="form-group"><label className="form-label">Email</label><input className="form-input" name="EMAIL" value={form.EMAIL} onChange={hc} /></div></div>
        <div className="form-group"><label className="form-label">Địa chỉ</label><input className="form-input" name="DIACHI" value={form.DIACHI} onChange={hc} /></div>
        <div className="form-group"><label className="form-label">Trạng thái</label><select className="form-select" name="IS_DELETED" value={form.IS_DELETED ? 'true' : 'false'} onChange={e => setForm(p => ({ ...p, IS_DELETED: e.target.value === 'true' }))}><option value="false">Hoạt động</option><option value="true">Ngừng</option></select></div>
    </>
);
