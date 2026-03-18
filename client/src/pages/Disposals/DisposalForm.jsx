import React, { useState, useEffect } from 'react';
import { Ico } from '../../components/Manage/Icons';
import api from '../../services/api';

export const emptyDisposal = {
    NGAYLAP: new Date().toISOString().slice(0, 16),
    LYDO: '',
    MANV: '',
    chiTiets: []
};

export const DisposalForm = ({ form, hc, setForm }) => {
    const [employees, setEmployees] = useState([]);
    const [inventories, setInventories] = useState([]);

    useEffect(() => {
        api.get('/employees')
            .then(res => setEmployees(res.data.data || res.data))
            .catch(console.error);
        api.get('/inventories')
            .then(res => setInventories(res.data.data || res.data))
            .catch(console.error);
    }, []);

    const addDetailRow = () => {
        if ((form.chiTiets || []).length >= 20) return;
        setForm(prev => ({
            ...prev,
            chiTiets: [...(prev.chiTiets || []), { MASP: '', ID_TONKHO: '', SOLUONG: 1 }]
        }));
    };

    const removeDetailRow = (index) => {
        setForm(prev => ({
            ...prev,
            chiTiets: (prev.chiTiets || []).filter((_, i) => i !== index)
        }));
    };

    const updateDetailRow = (index, field, value) => {
        const newDetails = [...(form.chiTiets || [])];
        if (field === 'ID_TONKHO') {
            const inv = inventories.find(x => x.ID == value);
            newDetails[index] = { ...newDetails[index], ID_TONKHO: value, MASP: inv ? inv.MASP : '' };
        } else {
            newDetails[index] = { ...newDetails[index], [field]: value };
        }
        setForm(prev => ({ ...prev, chiTiets: newDetails }));
    };

    const details = form.chiTiets || [];
    const atLimit = details.length >= 20;

    return (
        <div className="form-grid">
            {/* ── Section: Thông tin phiếu ── */}
            <div className="form-section-title">
                {Ico.trash} Thông tin phiếu hủy
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Ngày lập phiếu *</label>
                    <input
                        className="form-input"
                        type="datetime-local"
                        name="NGAYLAP"
                        value={form.NGAYLAP}
                        onChange={hc}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Nhân viên lập phiếu *</label>
                    <select
                        className="form-select"
                        name="MANV"
                        value={form.MANV}
                        onChange={hc}
                    >
                        <option value="">-- Chọn nhân viên --</option>
                        {employees.map(e => (
                            <option key={e.MANV} value={e.MANV}>#{e.MANV} · {e.TENNV}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">Lý do xuất hủy *</label>
                <textarea
                    className="form-input"
                    name="LYDO"
                    value={form.LYDO}
                    onChange={hc}
                    placeholder="VD: Sản phẩm cận date, hỏng hóc, không đạt tiêu chuẩn..."
                    rows="2"
                    style={{ resize: 'vertical', minHeight: 60 }}
                />
            </div>

            {/* ── Section: Danh sách hàng hủy ── */}
            <div className="form-section-title" style={{ marginTop: 4 }}>
                {Ico.package} Chi tiết hàng hóa cần hủy
                <span className="form-section-badge">{details.length}/20 lô</span>
            </div>

            {details.length === 0 && (
                <div className="form-empty-hint">
                    Chưa có mặt hàng. Nhấn <strong>+ Thêm lô</strong> bên dưới để bắt đầu.
                </div>
            )}

            {details.length > 0 && (
                <div className="detail-list">
                    {/* Header row */}
                    <div className="detail-header-row">
                        <span>Lô hàng trong kho</span>
                        <span>SL hủy</span>
                        <span></span>
                    </div>

                    <div className="detail-scroll">
                        {details.map((row, index) => (
                            <div key={index} className="detail-row">
                                <select
                                    className="form-select"
                                    value={row.ID_TONKHO}
                                    onChange={e => updateDetailRow(index, 'ID_TONKHO', parseInt(e.target.value))}
                                >
                                    <option value="">-- Chọn lô hàng --</option>
                                    {inventories
                                        .filter(inv => inv.SOLUONG_CON_LAI > 0)
                                        .map(inv => (
                                            <option key={inv.ID} value={inv.ID}>
                                                Lô #{inv.ID} · {inv.san_pham?.TENSP || `SP ${inv.MASP}`} (Còn: {inv.SOLUONG_CON_LAI} {inv.san_pham?.DVT || ''})
                                            </option>
                                        ))
                                    }
                                </select>

                                <input
                                    type="number"
                                    className="form-input"
                                    min="1"
                                    value={row.SOLUONG}
                                    onChange={e => updateDetailRow(index, 'SOLUONG', parseInt(e.target.value) || 1)}
                                    placeholder="SL"
                                    style={{ textAlign: 'center' }}
                                />

                                <button
                                    type="button"
                                    className="btn-action-ico btn-del"
                                    title="Xóa dòng"
                                    onClick={() => removeDetailRow(index)}
                                >
                                    {Ico.trash}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <button
                type="button"
                className={`btn-add-detail${atLimit ? ' disabled' : ''}`}
                onClick={addDetailRow}
                disabled={atLimit}
            >
                {Ico.plus}
                {atLimit ? 'Đã đạt giới hạn 20 lô' : 'Thêm lô hàng'}
            </button>
        </div>
    );
};
