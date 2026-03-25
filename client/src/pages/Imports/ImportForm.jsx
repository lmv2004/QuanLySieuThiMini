import React from 'react';

export const emptyImport = { 
    NGAYLAP: '', MANV: '', TONGTIEN: 0, GCHU: '', IS_DELETED: false 
};

export const ImportForm = ({ form, hc, setForm }) => (
    <>
        <div className="form-group">
            <label className="form-label">Ngày lập</label>
            <input className="form-input" type="datetime-local" name="NGAYLAP" value={form.NGAYLAP || ''} onChange={hc} />
        </div>
        <div className="form-row">
            <div className="form-group">
                <label className="form-label">Tổng tiền (₫)</label>
                <input className="form-input" type="number" name="TONGTIEN" value={form.TONGTIEN || 0} onChange={hc} placeholder="0" />
            </div>
            <div className="form-group">
                <label className="form-label">Mã NV</label>
                <input className="form-input" name="MANV" value={form.MANV || ''} onChange={hc} placeholder="Mã Nhân viên (Tùy chọn)" />
            </div>
        </div>
        <div className="form-group">
            <label className="form-label">Ghi chú</label>
            <input className="form-input" name="GCHU" value={form.GCHU || ''} onChange={hc} placeholder="Ghi chú..." />
        </div>
        <div className="form-group">
            <label className="form-label">Trạng thái</label>
            <select className="form-select" name="IS_DELETED" value={form.IS_DELETED ? 'true' : 'false'} onChange={e => setForm(p => ({ ...p, IS_DELETED: e.target.value === 'true' }))}>
                <option value="false">Hoạt động</option>
                <option value="true">Đã hủy</option>
            </select>
        </div>
    </>
);
