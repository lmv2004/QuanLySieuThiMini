import React from 'react';

export const emptyPosition = { 
    TENCHUCVU: '', MOTA: '', LUONGCOBAN: 0, IS_DELETED: false 
};

export const PositionForm = ({ form, hc, setForm }) => (
    <>
        <div className="form-group">
            <label className="form-label">Tên chức vụ</label>
            <input className="form-input" name="TENCHUCVU" value={form.TENCHUCVU || ''} onChange={hc} placeholder="Thu ngân, Thủ kho..." />
        </div>
        <div className="form-group">
            <label className="form-label">Lương cơ bản</label>
            <input type="number" className="form-input" name="LUONGCOBAN" value={form.LUONGCOBAN || 0} onChange={hc} placeholder="5000000" />
        </div>
        <div className="form-group">
            <label className="form-label">Mô tả</label>
            <input className="form-input" name="MOTA" value={form.MOTA || ''} onChange={hc} placeholder="Mô tả công việc" />
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
