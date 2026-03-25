import React, { useState, useEffect } from 'react';
import { Ico } from '../../components/Manage/Icons';
import api from '../../services/api';
import { EliteSelect } from '../../components/Manage/EliteSelect';

export const emptyDisposal = {
    NGAYLAP: new Date().toISOString().slice(0, 16),
    LYDO: '',
    MANV: '',
    chiTiets: []
};

export const DisposalForm = ({ form, hc, setForm, isView, errors = {} }) => {
    const [employees, setEmployees] = useState([]);
    const [inventories, setInventories] = useState([]);

    useEffect(() => {
        api.get('/employees?per_page=100').then(res => setEmployees(res.data.data || res.data || []));
        api.get('/inventories?per_page=200').then(res => setInventories(res.data.data || res.data || []));
    }, []);

    // 🛡️ Auto-Sync: Tự động đổ dữ liệu từ các trường phụ (NHANVIEN, CHI_TIETS) vào trường chính (MANV, chiTiets)
    useEffect(() => {
        if (!form.MANV && form.NHANVIEN?.MANV) {
            setForm(p => ({ ...p, MANV: form.NHANVIEN.MANV }));
        }
    }, [form.NHANVIEN?.MANV]); 

    useEffect(() => {
        // Hỗ trợ cả 3 dạng tên trường chi tiết từ backend
        const sourceDetails = form.CHI_TIET_PHIEU_HUY || form.chi_tiet_phieu_huys || form.CHI_TIETS || [];
        if ((!form.chiTiets || form.chiTiets.length === 0) && sourceDetails.length > 0) {
            setForm(p => ({ ...p, chiTiets: sourceDetails }));
        }
    }, [form.CHI_TIETS, form.chi_tiet_phieu_huys, form.CHI_TIET_PHIEU_HUY]);

    const details = form.chiTiets || [];
    const selectedInvIds = details.map(d => d.ID_TONKHO);

    const updateDetailRow = (index, field, value) => {
        if (isView) return;
        const newDetails = [...details];
        if (field === 'ID_TONKHO') {
            const inv = inventories.find(x => x.ID == value);
            newDetails[index] = { ...newDetails[index], ID_TONKHO: value, MASP: inv ? inv.MASP : '' };
        } else {
            newDetails[index] = { ...newDetails[index], [field]: value };
        }
        setForm(p => ({ ...p, chiTiets: newDetails }));
    };

    const addDetailRow = () => {
        if (isView || details.length >= 20) return;
        setForm(p => ({
            ...p,
            chiTiets: [...details, { ID_TONKHO: '', SOLUONG: 1 }]
        }));
    };

    const removeDetailRow = (index) => {
        if (isView) return;
        setForm(p => ({
            ...p,
            chiTiets: details.filter((_, i) => i !== index)
        }));
    };

    const inventoryOptions = inventories
        .filter(inv => inv.SOLUONG_CON_LAI > 0 || selectedInvIds.includes(inv.ID))
        .map(inv => ({
            value: inv.ID,
            label: `${inv.san_pham?.TENSP || `Mã ${inv.MASP}`} (Có: ${inv.SOLUONG_CON_LAI})`,
            icon: Ico.package,
            iconClass: inv.SOLUONG_CON_LAI <= 0 ? 'opt-icon-muted' : 'opt-icon-active'
        }));

    return (
        <div className="premium-disposal-box">
            <div className="form-section-head">
                {Ico.info} Thông tin phiếu xuất hủy
            </div>

            <div className="form-row-grid">
                <div className="form-group">
                    <label className="form-label">Ngày lập phiếu *</label>
                    <div className="input-with-icon">
                        <span className="input-icon-left">{Ico.calendar}</span>
                        <input
                            className={`form-input has-icon-left ${errors.NGAYLAP ? 'has-error' : ''}`}
                            type="datetime-local"
                            name="NGAYLAP"
                            value={form.NGAYLAP?.replace(' ', 'T') || ''}
                            onChange={hc}
                            disabled={isView}
                        />
                    </div>
                    {errors.NGAYLAP && <span className="error-text">{errors.NGAYLAP}</span>}
                </div>
                <div className="form-group">
                    <label className="form-label">Nhân viên lập phiếu *</label>
                    <EliteSelect
                        options={employees.map(e => ({ value: e.MANV, label: e.TENNV, icon: Ico.user }))}
                        value={form.MANV || form.NHANVIEN?.MANV || ''}
                        onChange={(val) => setForm(p => ({ ...p, MANV: val }))}
                        disabled={isView}
                        placeholder="Chọn nhân viên..."
                    />
                    {errors.MANV && <span className="error-text">{errors.MANV}</span>}
                </div>
            </div>

            <div className="form-group" style={{ marginTop: 15 }}>
                <label className="form-label">Lý do tiêu hủy *</label>
                <div className="input-with-icon">
                    <span className="input-icon-left" style={{ top: 12 }}>{Ico.edit}</span>
                    <textarea
                        className={`form-input has-icon-left ${errors.LYDO ? 'has-error' : ''}`}
                        name="LYDO"
                        value={form.LYDO}
                        onChange={hc}
                        disabled={isView}
                        placeholder="Mô tả lý do..."
                        rows="2"
                    />
                </div>
                {errors.LYDO && <span className="error-text">{errors.LYDO}</span>}
            </div>

            <div className="form-section-head" style={{ marginTop: 20 }}>
                {Ico.package} Chi tiết danh mục hàng hóa
                <span className="badge-count">{details.length}/20</span>
            </div>

            <div className="detail-table-container">
                <div className="detail-header">
                    <span>Lô hàng trong kho</span>
                    <span style={{ textAlign: 'center' }}>Số lượng</span>
                    <span style={{ width: 40 }}></span>
                </div>

                <div className="detail-rows-container">
                    {details.length === 0 ? (
                        <div className="empty-state">Chưa có hàng hóa nào được chọn.</div>
                    ) : (
                        details.map((row, index) => (
                            <div key={index} className="detail-item-row">
                                <EliteSelect
                                    options={inventoryOptions}
                                    value={row.ID_TONKHO}
                                    onChange={(val) => updateDetailRow(index, 'ID_TONKHO', val)}
                                    disabled={isView}
                                    placeholder="Chọn lô hàng..."
                                />
                                <input
                                    type="number"
                                    className="form-input"
                                    value={row.SOLUONG}
                                    onChange={(e) => updateDetailRow(index, 'SOLUONG', e.target.value)}
                                    disabled={isView}
                                    min="1"
                                    style={{ textAlign: 'center' }}
                                />
                                {!isView && (
                                    <button type="button" className="btn-remove-item" onClick={() => removeDetailRow(index)}>
                                        {Ico.trash}
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {!isView && (
                    <button type="button" className="btn-append-row" onClick={addDetailRow}>
                        {Ico.plus} Thêm mặt hàng mới
                    </button>
                )}
            </div>

            {errors._global && <div className="error-banner-fixed">{Ico.alertCircle} {errors._global}</div>}
        </div>
    );
};
