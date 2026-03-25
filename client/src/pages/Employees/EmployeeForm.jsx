import React, { useEffect, useState } from 'react';
import api from '../../services/api';

export const emptyEmployee = { 
    TENNV: '', SODIENTHOAI: '', EMAIL: '', DIACHI: '', MACHUCVU: '',
};

export const EmployeeForm = ({ form, hc, setForm }) => {
    const [chucVuList, setChucVuList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/positions', { params: { per_page: 100 } })
            .then(res => {
                const data = res?.data ?? [];
                setChucVuList(data);
            })
            .catch(() => setChucVuList([]))
            .finally(() => setLoading(false));
    }, []);

    return (
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
            <div className="form-group">
                <label className="form-label">Chức vụ</label>
                <select
                    className="form-select"
                    name="MACHUCVU"
                    value={form.MACHUCVU}
                    onChange={(e) => {
                        const val = Number(e.target.value);
                        const cv = chucVuList.find(c => c.MACHUCVU === val);
                        hc(e);
                        setForm(p => ({ ...p, chucVu: cv }));
                    }}
                    disabled={loading}
                >
                    <option value="">
                        {loading ? 'Đang tải...' : '-- Chọn chức vụ --'}
                    </option>
                    {chucVuList.map(cv => (
                        <option key={cv.MACHUCVU} value={cv.MACHUCVU}>
                            {cv.TENCHUCVU}{cv.CODE ? ` (${cv.CODE})` : ''}
                        </option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label className="form-label">Địa chỉ</label>
                <input className="form-input" name="DIACHI" value={form.DIACHI} onChange={hc} placeholder="123 Nguyễn Huệ, Q.1" />
            </div>
        </>
    );
};
