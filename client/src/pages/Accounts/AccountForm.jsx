import React, { useState, useEffect } from 'react';
import { Ico } from '../../components/Manage/Icons';
import api from '../../services/api';

export const emptyAccount = {
    TENTK: '',
    EMAIL: '',
    MANV: '',
    KHOA_TK: false,
    MATKHAU: '',
    MATKHAU_XAC_NHAN: '',   // chỉ dùng phía client, không gửi lên server
};

// ── Validators ──────────────────────────────────────────────────
const isEmpty = (v) => !v || String(v).trim() === '';
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim());
const isSlug = (v) => /^[a-zA-Z0-9_.]+$/.test(String(v).trim());

export const validateAccount = (form, isEdit = false) => {
    const errs = {};

    if (isEmpty(form.TENTK))
        errs.TENTK = 'Tên đăng nhập không được để trống.';
    else if (!isSlug(form.TENTK))
        errs.TENTK = 'Tên đăng nhập chỉ gồm chữ, số, dấu chấm và gạch dưới (không dấu, không cách).';
    else if (form.TENTK.length < 4)
        errs.TENTK = 'Tên đăng nhập phải từ 4 ký tự trở lên.';
    else if (form.TENTK.length > 32)
        errs.TENTK = 'Tên đăng nhập không được quá 32 ký tự.';

    if (isEmpty(form.EMAIL))
        errs.EMAIL = 'Email là bắt buộc.';
    else if (!isEmail(form.EMAIL))
        errs.EMAIL = 'Email không đúng định dạng.';

    if (!isEdit) {
        // Tạo mới: mật khẩu bắt buộc
        if (isEmpty(form.MATKHAU))
            errs.MATKHAU = 'Vui lòng nhập mật khẩu mới.';
        else if (form.MATKHAU.length < 6)
            errs.MATKHAU = 'Mật khẩu yếu, cần tối thiểu 6 ký tự.';

        if (isEmpty(form.MATKHAU_XAC_NHAN))
            errs.MATKHAU_XAC_NHAN = 'Vui lòng xác nhận lại mật khẩu.';
        else if (form.MATKHAU !== form.MATKHAU_XAC_NHAN)
            errs.MATKHAU_XAC_NHAN = 'Mật khẩu xác nhận chưa khớp.';
    } else {
        // Sửa: mật khẩu không bắt buộc, nhưng nếu nhập phải hợp lệ
        if (form.MATKHAU && form.MATKHAU.length < 6)
            errs.MATKHAU = 'Mật khẩu phải có ít nhất 6 ký tự.';
        if (form.MATKHAU && form.MATKHAU !== form.MATKHAU_XAC_NHAN)
            errs.MATKHAU_XAC_NHAN = 'Mật khẩu xác nhận không khớp.';
    }

    if (isEmpty(form.MANV))
        errs.MANV = 'Vui lòng chọn nhân viên sở hữu tài khoản.';

    return errs;
};

// ── FieldError helper ─────────────────────────────────────────
const FieldError = ({ errors, name }) => {
    if (!errors?.[name]) return null;
    return (
        <span style={{ display: 'block', color: '#dc2626', fontSize: 11.5, marginTop: 4, fontWeight: 500 }}>
            {errors[name]}
        </span>
    );
};
const errStyle = (errors, name) =>
    errors?.[name] ? { borderColor: '#f87171', background: '#fff8f8' } : {};

// ── Component ─────────────────────────────────────────────────
export const AccountForm = ({ form, hc, setForm, readOnly, errors = {}, isEdit = false }) => {
    const [employees, setEmployees] = useState([]);
    const [loadingNV, setLoadingNV] = useState(true);
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        const params = { per_page: 200 };
        if (!isEdit) {
            params.without_account = 1;
        }

        api.get('/employees', { params })
            .then(res => setEmployees(res.data?.data || res.data || []))
            .catch(() => setEmployees([]))
            .finally(() => setLoadingNV(false));
    }, [isEdit]);

    const eyeBtn = (show, toggle) => (
        <button
            type="button"
            onClick={toggle}
            tabIndex={-1}
            style={{
                position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text-muted)', padding: 2, lineHeight: 0,
            }}
        >
            {show ? Ico.eyeOff ?? '🙈' : Ico.eye ?? '👁'}
        </button>
    );

    const [viewEmployee, setViewEmployee] = useState(null);

    useEffect(() => {
        // Fallback: Nếu xem chi tiết hoặc sửa mà chưa có object NHANVIEN, tự động đi lấy từ API
        if ((readOnly || isEdit) && form.MANV && !form.NHANVIEN) {
            api.get(`/employees/${form.MANV}`)
                .then(res => setViewEmployee(res.data?.data || res.data))
                .catch(() => setViewEmployee(null));
        }
    }, [readOnly, isEdit, form.MANV, form.NHANVIEN]);

    if (readOnly) {
        const emp = form.NHANVIEN || viewEmployee;
        return (
            <div className="view-container" style={{ padding: '10px 0' }}>
                {/* Header: Avatar & Info chính */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 30 }}>
                    <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(emp?.TENNV || 'NV')}&background=0D8ABC&color=fff&size=200&bold=true`}
                        alt="Avatar"
                        style={{ width: 64, height: 64, borderRadius: 16, objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)' }}>{emp?.TENNV || 'Đang tải...'}</div>
                                <div style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600, marginTop: 2 }}>{emp?.chucVu?.TENCHUCVU || 'Nhân viên'}</div>
                            </div>
                            <span className={form.KHOA_TK ? 'badge badge-inactive' : 'badge badge-active'} style={{ fontSize: 11, padding: '4px 10px' }}>
                                {form.KHOA_TK ? 'Bị khóa' : 'Hoạt động'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Grid thông tin cốt lõi */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, padding: '20px 0', borderTop: '1px solid var(--border-light)' }}>
                    <div className="view-item">
                        <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>Tên đăng nhập</label>
                        <div style={{ fontSize: 15, fontWeight: 600 }}>{form.TENTK}</div>
                    </div>
                    <div className="view-item">
                        <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>Mã nhân viên</label>
                        <div style={{ fontSize: 15, fontWeight: 600 }}>#{form.MANV}</div>
                    </div>
                    <div className="view-item">
                        <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>Email tài khoản</label>
                        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--primary)' }}>{form.EMAIL}</div>
                    </div>
                    <div className="view-item">
                        <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>Số điện thoại</label>
                        <div style={{ fontSize: 15, fontWeight: 600 }}>{emp?.SODIENTHOAI || '—'}</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="form-grid">

            {/* ── Section: Thông tin đăng nhập ── */}
            <div className="form-section-title">{Ico.user} Thông tin đăng nhập</div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">
                        Tên đăng nhập <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <input
                        className="form-input"
                        name="TENTK"
                        value={form.TENTK}
                        onChange={hc}
                        placeholder="vd: nhanvien01"
                        autoComplete="off"
                        style={errStyle(errors, 'TENTK')}
                    />
                    <FieldError errors={errors} name="TENTK" />
                </div>

                <div className="form-group">
                    <label className="form-label">
                        Email <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <input
                        className="form-input"
                        type="email"
                        name="EMAIL"
                        value={form.EMAIL}
                        onChange={hc}
                        placeholder="vd: nv@sieuthi.vn"
                        autoComplete="off"
                        style={errStyle(errors, 'EMAIL')}
                    />
                    <FieldError errors={errors} name="EMAIL" />
                </div>
            </div>

            {/* Mật khẩu */}
            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">
                        Mật khẩu {!isEdit && <span style={{ color: '#dc2626' }}>*</span>}
                        {isEdit && <span style={{ color: 'var(--text-muted)', fontSize: 11, marginLeft: 6 }}>(bỏ trống = không đổi)</span>}
                    </label>
                    <div style={{ position: 'relative' }}>
                        <input
                            className="form-input"
                            type={showPass ? 'text' : 'password'}
                            name="MATKHAU"
                            value={form.MATKHAU}
                            onChange={hc}
                            placeholder={isEdit ? '••••••• (không đổi)' : '••••••• (ít nhất 6 ký tự)'}
                            autoComplete="new-password"
                            style={{ paddingRight: 36, ...errStyle(errors, 'MATKHAU') }}
                        />
                        {eyeBtn(showPass, () => setShowPass(p => !p))}
                    </div>
                    <FieldError errors={errors} name="MATKHAU" />
                </div>

                <div className="form-group">
                    <label className="form-label">
                        Xác nhận mật khẩu {!isEdit && <span style={{ color: '#dc2626' }}>*</span>}
                    </label>
                    <div style={{ position: 'relative' }}>
                        <input
                            className="form-input"
                            type={showConfirm ? 'text' : 'password'}
                            name="MATKHAU_XAC_NHAN"
                            value={form.MATKHAU_XAC_NHAN || ''}
                            onChange={hc}
                            placeholder="Nhập lại mật khẩu"
                            autoComplete="new-password"
                            style={{ paddingRight: 36, ...errStyle(errors, 'MATKHAU_XAC_NHAN') }}
                        />
                        {eyeBtn(showConfirm, () => setShowConfirm(p => !p))}
                    </div>
                    <FieldError errors={errors} name="MATKHAU_XAC_NHAN" />
                </div>
            </div>

            {/* ── Section: Liên kết nhân viên ── */}
            <div className="form-section-title" style={{ marginTop: 4 }}>{Ico.user} Liên kết nhân viên</div>

            <div className="form-group">
                <label className="form-label">
                    Nhân viên sở hữu tài khoản <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <select
                    className="form-select"
                    name="MANV"
                    value={form.MANV}
                    onChange={hc}
                    disabled={isEdit || loadingNV}
                    style={errStyle(errors, 'MANV')}
                >
                    <option value="">
                        {loadingNV ? 'Đang tải...' : '-- Chọn nhân viên --'}
                    </option>
                    {(isEdit && (form.NHANVIEN || viewEmployee)) && (
                        <option value={form.MANV}>
                            #{form.MANV} · {(form.NHANVIEN || viewEmployee).TENNV} (Hiện tại)
                        </option>
                    )}
                    {employees.map(e => (
                        <option key={e.MANV} value={e.MANV}>
                            #{e.MANV} · {e.TENNV}{e.chucVu?.TENCHUCVU ? ` — ${e.chucVu.TENCHUCVU}` : ''}
                        </option>
                    ))}
                </select>
                <FieldError errors={errors} name="MANV" />
            </div>

            <label className="form-toggle-row" htmlFor="chk-lock" style={{ marginTop: 4 }}>
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
