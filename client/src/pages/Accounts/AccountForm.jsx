import React, { useState, useEffect } from 'react';
import { Ico } from '../../components/Manage/Icons';
import api from '../../services/api';

export const emptyAccount = {
    TENTK: '',
    EMAIL: '',
    MANV: '',
    KHOA_TK: false,
    MATKHAU: ''
};

export const AccountForm = ({ form, hc, setForm }) => {
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        api.get('/employees')
            .then(res => setEmployees(res.data.data || res.data))
            .catch(console.error);
    }, []);

    return (
        <div className="form-grid">
            {/* ── Section: Thông tin đăng nhập ── */}
            <div className="form-section-title">
                {Ico.user} Thông tin đăng nhập
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Tên đăng nhập *</label>
                    <input
                        className="form-input"
                        name="TENTK"
                        value={form.TENTK}
                        onChange={hc}
                        placeholder="vd: nhanvien01"
                        autoComplete="off"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input
                        className="form-input"
                        type="email"
                        name="EMAIL"
                        value={form.EMAIL}
                        onChange={hc}
                        placeholder="vd: nv@sieuthi.vn"
                    />
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">Mật khẩu {form.TENTK ? '' : '*'}</label>
                <input
                    className="form-input"
                    type="password"
                    name="MATKHAU"
                    value={form.MATKHAU}
                    onChange={hc}
                    placeholder={form.TENTK ? '••••••• (bỏ trống = không đổi)' : '••••••• (ít nhất 6 ký tự)'}
                    autoComplete="new-password"
                />
            </div>

            {/* ── Section: Liên kết nhân viên ── */}
            <div className="form-section-title" style={{ marginTop: 4 }}>
                {Ico.user} Liên kết nhân viên
            </div>

            <div className="form-group">
                <label className="form-label">Nhân viên sở hữu tài khoản *</label>
                <select
                    className="form-select"
                    name="MANV"
                    value={form.MANV}
                    onChange={hc}
                >
                    <option value="">-- Chọn nhân viên --</option>
                    {employees.map(e => (
                        <option key={e.MANV} value={e.MANV}>
                            #{e.MANV} · {e.TENNV} {e.SODIENTHOAI ? `(${e.SODIENTHOAI})` : ''}
                        </option>
                    ))}
                </select>
            </div>

            {/* ── Toggle: Khoá tài khoản ── */}
            <label className="form-toggle-row" htmlFor="chk-lock">
                <div className="form-toggle-info">
                    <span className="form-toggle-label">Khoá tài khoản</span>
                    <span className="form-toggle-desc">Tài khoản bị khoá sẽ không thể đăng nhập</span>
                </div>
                <input
                    type="checkbox"
                    id="chk-lock"
                    name="KHOA_TK"
                    checked={!!form.KHOA_TK}
                    onChange={hc}
                    className="form-checkbox"
                />
            </label>
        </div>
    );
};
