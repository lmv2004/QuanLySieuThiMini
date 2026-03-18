import React from 'react';

export const CHUCVU_LIST = [
    { MACHUCVU: 1, TENCHUCVU: 'Quản lý' }, 
    { MACHUCVU: 2, TENCHUCVU: 'Thu ngân' }, 
    { MACHUCVU: 3, TENCHUCVU: 'Thủ kho' }
];

export const emptyEmployee = { 
    TENNV: '', SODIENTHOAI: '', EMAIL: '', DIACHI: '', MACHUCVU: '', IS_DELETED: false 
};

export const EmployeeForm = ({ form, hc, setForm }) => (
    <>
        <div className="form-group">
            <label className="form-label">Họ tên</label>
            <input className="form-input" name="TENNV" value={form.TENNV} onChange={hc} placeholder="Nguyễn Văn A" />
        </div>
        <div className="form-row">
            <div className="form-group">
                <label className="form-label">Số điện thoại</label>
                <input className="form-input" name="SODIENTHOAI" value={form.SODIENTHOAI} onChange={hc} placeholder="0901 234 567" />
            </div>
            <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" name="EMAIL" value={form.EMAIL} onChange={hc} placeholder="email@gmail.com" />
            </div>
        </div>
        <div className="form-row">
            <div className="form-group">
                <label className="form-label">Chức vụ</label>
                <select className="form-select" name="MACHUCVU" value={form.MACHUCVU} onChange={(e) => {
                    const val = Number(e.target.value);
                    const cv = CHUCVU_LIST.find(c => c.MACHUCVU === val);
                    hc(e);
                    setForm(p => ({ ...p, chucVu: cv }));
                }}>
                    <option value="">-- Chọn --</option>
                    {CHUCVU_LIST.map(cv => <option key={cv.MACHUCVU} value={cv.MACHUCVU}>{cv.TENCHUCVU}</option>)}
                </select>
            </div>
            <div className="form-group">
                <label className="form-label">Trạng thái</label>
                <select className="form-select" name="IS_DELETED" value={form.IS_DELETED ? 'true' : 'false'} onChange={e => setForm(p => ({ ...p, IS_DELETED: e.target.value === 'true' }))}>
                    <option value="false">Hoạt động</option>
                    <option value="true">Ngừng</option>
                </select>
            </div>
        </div>
        <div className="form-group">
            <label className="form-label">Địa chỉ</label>
            <input className="form-input" name="DIACHI" value={form.DIACHI} onChange={hc} placeholder="123 Nguyễn Huệ, Q.1" />
        </div>
    </>
);
