import React from 'react';
import { EliteSelect } from '../../components/Manage/EliteSelect';
import { FaCheckCircle, FaBan } from 'react-icons/fa';

export const emptySupplier = { TENNCC: '', SDT: '', EMAIL: '', DIACHI: '', IS_DELETED: false };

export const SupplierForm = ({ form, hc, setForm, formErrors = {} }) => (
    <>
        <div className="form-group">
            <label className="form-label">Tên công ty *</label>
            <input className="form-input" name="TENNCC" value={form.TENNCC || ''} onChange={hc} placeholder="Công ty TNHH ABC" />
            {formErrors.TENNCC && <span className="form-error">{formErrors.TENNCC}</span>}
        </div>

        <div className="form-row">
            <div className="form-group">
                <label className="form-label">Số điện thoại *</label>
                <input className="form-input" name="SDT" value={form.SDT || ''} onChange={hc} placeholder="0281234567" />
                {formErrors.SDT && <span className="form-error">{formErrors.SDT}</span>}
            </div>
            <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" name="EMAIL" value={form.EMAIL || ''} onChange={hc} placeholder="contact@company.com" />
                {formErrors.EMAIL && <span className="form-error">{formErrors.EMAIL}</span>}
            </div>
        </div>

        <div className="form-group">
            <label className="form-label">Địa chỉ</label>
            <input className="form-input" name="DIACHI" value={form.DIACHI || ''} onChange={hc} placeholder="123 Đường ABC, Quận 1, TP.HCM" />
        </div>

        <div className="form-group">
            <label className="form-label">Trạng thái</label>
            <EliteSelect
                options={[
                    { value: 'false', label: 'Hoạt động',       icon: <FaCheckCircle />, iconClass: 'opt-icon-active' },
                    { value: 'true',  label: 'Ngừng hợp tác',   icon: <FaBan />,         iconClass: 'opt-icon-locked' },
                ]}
                value={form.IS_DELETED ? 'true' : 'false'}
                onChange={(val) => setForm(p => ({ ...p, IS_DELETED: val === 'true' }))}
            />
        </div>
    </>
);
