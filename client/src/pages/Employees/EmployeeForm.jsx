import React, { useEffect, useState } from 'react';
import api from '../../services/api';

export const emptyEmployee = {
    TENNV: '', SODIENTHOAI: '', EMAIL: '', DIACHI: '', MACHUCVU: '', CCCD: '', NGAYSINH: '', NGAYTHAMGIA: '',
};

export const EmployeeForm = ({ form, hc, setForm, formErrors = {} }) => {
    const [chucVuList, setChucVuList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/positions', { params: { per_page: 100 } })
            .then(res => {
                const data = res?.data ?? [];
                setChucVuList(Array.isArray(data) ? data : (data?.data ?? []));
            })
            .catch(() => setChucVuList([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <>
            <div className="form-group">
                <label className="form-label">Họ tên *</label>
                <input className="form-input" name="TENNV" value={form.TENNV || ''} onChange={hc} placeholder="Nguyễn Văn A" />
                {formErrors.TENNV && <span className="form-error">{formErrors.TENNV}</span>}
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Số điện thoại *</label>
                    <input className="form-input" name="SODIENTHOAI" value={form.SODIENTHOAI || ''} onChange={hc} placeholder="0901 234 567" />
                    {formErrors.SODIENTHOAI && <span className="form-error">{formErrors.SODIENTHOAI}</span>}
                </div>
                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input className="form-input" name="EMAIL" value={form.EMAIL || ''} onChange={hc} placeholder="email@minimart.vn" />
                    {formErrors.EMAIL && <span className="form-error">{formErrors.EMAIL}</span>}
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">CCCD</label>
                    <input className="form-input" name="CCCD" value={form.CCCD || ''} onChange={hc} placeholder="012345678901" />
                    {formErrors.CCCD && <span className="form-error">{formErrors.CCCD}</span>}
                </div>
                <div className="form-group">
                    <label className="form-label">Ngày sinh</label>
                    <input className="form-input" type="date" name="NGAYSINH" value={form.NGAYSINH || ''} onChange={hc} />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Chức vụ *</label>
                    <select
                        className="form-select"
                        name="MACHUCVU"
                        value={form.MACHUCVU || ''}
                        onChange={(e) => {
                            const val = Number(e.target.value);
                            const cv = chucVuList.find(c => c.MACHUCVU === val);
                            hc(e);
                            setForm(p => ({ ...p, chucVu: cv }));
                        }}
                        disabled={loading}
                    >
                        <option value="">{loading ? 'Đang tải...' : '— Chọn chức vụ —'}</option>
                        {chucVuList.map(cv => (
                            <option key={cv.MACHUCVU} value={cv.MACHUCVU}>
                                {cv.TENCHUCVU}
                            </option>
                        ))}
                    </select>
                    {formErrors.MACHUCVU && <span className="form-error">{formErrors.MACHUCVU}</span>}
                </div>
                <div className="form-group">
                    <label className="form-label">Ngày tham gia</label>
                    <input className="form-input" type="date" name="NGAYTHAMGIA" value={form.NGAYTHAMGIA || ''} onChange={hc} />
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">Địa chỉ</label>
                <input className="form-input" name="DIACHI" value={form.DIACHI || ''} onChange={hc} placeholder="123 Nguyễn Huệ, Quận 1, TP.HCM" />
            </div>
        </>
    );
};
