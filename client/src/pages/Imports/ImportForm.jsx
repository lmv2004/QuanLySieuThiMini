import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export const emptyImport = {
    MAPHIEU: null,   // cần để customSave biết ID khi edit
    NGAYLAP: '',
    MANV: '',
    MANCC: '',
    GCHU: '',
    TRANGTHAI: '',   // QUAN TRỌNG: phải có để SimplePage không drop field này
    chiTiets: [],
};

const emptyLine = { MASP: '', TENSP: '', SOLUONG: '', DONGIANHAP: '', HANSUDUNG: '' };

const fmtVND = (v) => Number(v || 0).toLocaleString('vi-VN') + ' ₫';

export const ImportForm = ({ form, hc, setForm, isView, formErrors = {}, suppliers = [], modalMode }) => {
    const [products, setProducts] = useState([]);
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        api.get('/products', { params: { per_page: 1000 } })
            .then(res => {
                const data = res?.data ?? res;
                const items = Array.isArray(data) ? data : (data?.data ?? []);
                setProducts(items.filter(p => !p.IS_DELETED));
            })
            .catch(() => {});

        api.get('/employees', { params: { per_page: 1000 } })
            .then(res => {
                const data = res?.data ?? res;
                const items = Array.isArray(data) ? data : (data?.data ?? []);
                setEmployees(items.filter(e => !e.IS_DELETED));
            })
            .catch(() => {});
    }, []);

    // Đảm bảo chiTiets luôn là array
    const lines = Array.isArray(form.chiTiets) ? form.chiTiets : [];

    const setLines = (updater) => {
        setForm(prev => ({
            ...prev,
            chiTiets: typeof updater === 'function' ? updater(prev.chiTiets ?? []) : updater,
        }));
    };

    const handleLineChange = (idx, field, value) => {
        setLines(prev => prev.map((line, i) => {
            if (i !== idx) return line;
            const updated = { ...line, [field]: value };
            if (field === 'MASP') {
                const sp = products.find(p => String(p.MASP) === String(value));
                updated.TENSP = sp?.TENSP ?? '';
                updated.DONGIANHAP = sp?.tonKhos?.slice(-1)[0]?.GIANHAP ?? '';
            }
            return updated;
        }));
    };

    const addLine = () => setLines(prev => [...prev, { ...emptyLine }]);
    const removeLine = (idx) => setLines(prev => prev.filter((_, i) => i !== idx));

    const totalTien = lines.reduce(
        (s, l) => s + (Number(l.SOLUONG) * Number(l.DONGIANHAP) || 0), 0
    );

    const isPending = !form.TRANGTHAI || form.TRANGTHAI === 'PENDING';
    const canEdit = !isView && isPending;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Thông tin chung */}
            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Ngày lập *</label>
                    <input
                        className="form-input"
                        type="datetime-local"
                        name="NGAYLAP"
                        value={form.NGAYLAP || ''}
                        onChange={hc}
                        disabled={!canEdit}
                    />
                    {formErrors.NGAYLAP && <span className="form-error">{formErrors.NGAYLAP}</span>}
                </div>
                <div className="form-group">
                    <label className="form-label">Nhân viên lập</label>
                    <select
                        className="form-select"
                        name="MANV"
                        value={form.MANV || ''}
                        onChange={hc}
                        disabled={!canEdit}
                    >
                        <option value="">— Chọn nhân viên —</option>
                        {employees.map(e => (
                            <option key={e.MANV} value={e.MANV}>{e.TENNV}</option>
                        ))}
                    </select>
                    {formErrors.MANV && <span className="form-error">{formErrors.MANV}</span>}
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Nhà cung cấp *</label>
                    <select
                        className="form-select"
                        name="MANCC"
                        value={form.MANCC || ''}
                        onChange={hc}
                        disabled={!canEdit}
                    >
                        <option value="">— Chọn nhà cung cấp —</option>
                        {suppliers.map(s => (
                            <option key={s.MANCC} value={s.MANCC}>{s.TENNCC}</option>
                        ))}
                    </select>
                    {formErrors.MANCC && <span className="form-error">{formErrors.MANCC}</span>}
                </div>
                <div className="form-group">
                    <label className="form-label">Ghi chú</label>
                    <input
                        className="form-input"
                        name="GCHU"
                        value={form.GCHU || ''}
                        onChange={hc}
                        placeholder="Ghi chú..."
                        disabled={!canEdit}
                    />
                </div>
            </div>

            {/* Trạng thái (chỉ hiển thị khi xem/sửa) */}
            {form.TRANGTHAI && (
                <div className="form-group">
                    <label className="form-label">Trạng thái</label>
                    <div style={{ paddingTop: 4 }}>
                        <span className={
                            form.TRANGTHAI === 'APPROVED'  ? 'badge badge-active' :
                            form.TRANGTHAI === 'CANCELLED' ? 'badge badge-inactive' :
                            'badge badge-pending'
                        }>
                            {form.TRANGTHAI === 'APPROVED'  ? 'Đã duyệt' :
                             form.TRANGTHAI === 'CANCELLED' ? 'Đã hủy' : 'Chờ duyệt'}
                        </span>
                        {!isPending && (
                            <span style={{ marginLeft: 10, fontSize: 12, color: 'var(--text-muted)' }}>
                                Phiếu đã {form.TRANGTHAI === 'APPROVED' ? 'duyệt' : 'hủy'}, không thể chỉnh sửa.
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Chi tiết sản phẩm */}
            <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <label className="form-label" style={{ margin: 0 }}>Chi tiết sản phẩm *</label>
                    {canEdit && (
                        <button
                            type="button"
                            className="btn-secondary"
                            style={{ padding: '4px 12px', fontSize: 12, width: 'auto' }}
                            onClick={addLine}
                        >
                            + Thêm dòng
                        </button>
                    )}
                </div>
                {formErrors.chiTiets && (
                    <span className="form-error" style={{ display: 'block', marginBottom: 6 }}>
                        {formErrors.chiTiets}
                    </span>
                )}
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '6px 8px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>Sản phẩm</th>
                            <th style={{ padding: '6px 8px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', width: 80 }}>SL</th>
                            <th style={{ padding: '6px 8px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', width: 120 }}>Đơn giá nhập</th>
                            <th style={{ padding: '6px 8px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', width: 130 }}>Hạn sử dụng</th>
                            <th style={{ padding: '6px 8px', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', width: 110 }}>Thành tiền</th>
                            {canEdit && <th style={{ width: 36 }}></th>}
                        </tr>
                    </thead>
                    <tbody>
                        {lines.length === 0 && (
                            <tr>
                                <td colSpan={canEdit ? 6 : 5} style={{ padding: '16px 8px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                                    Chưa có sản phẩm nào
                                </td>
                            </tr>
                        )}
                        {lines.map((line, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '6px 8px' }}>
                                    {canEdit ? (
                                        <select
                                            className="form-select"
                                            style={{ fontSize: 13, padding: '6px 8px' }}
                                            value={line.MASP || ''}
                                            onChange={e => handleLineChange(idx, 'MASP', e.target.value)}
                                        >
                                            <option value="">— Chọn SP —</option>
                                            {products.map(p => (
                                                <option key={p.MASP} value={p.MASP}>{p.TENSP}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <span>{line.sanPham?.TENSP ?? line.TENSP ?? `SP #${line.MASP}`}</span>
                                    )}
                                </td>
                                <td style={{ padding: '6px 8px' }}>
                                    {canEdit ? (
                                        <input
                                            className="form-input"
                                            type="number" min="1"
                                            style={{ fontSize: 13, padding: '6px 8px' }}
                                            value={line.SOLUONG || ''}
                                            onChange={e => handleLineChange(idx, 'SOLUONG', e.target.value)}
                                            placeholder="0"
                                        />
                                    ) : (
                                        <span>{line.SOLUONG}</span>
                                    )}
                                </td>
                                <td style={{ padding: '6px 8px' }}>
                                    {canEdit ? (
                                        <input
                                            className="form-input"
                                            type="number" min="0"
                                            style={{ fontSize: 13, padding: '6px 8px' }}
                                            value={line.DONGIANHAP || ''}
                                            onChange={e => handleLineChange(idx, 'DONGIANHAP', e.target.value)}
                                            placeholder="0"
                                        />
                                    ) : (
                                        <span>{fmtVND(line.DONGIANHAP)}</span>
                                    )}
                                </td>
                                <td style={{ padding: '6px 8px' }}>
                                    {canEdit ? (
                                        <input
                                            className="form-input"
                                            type="date"
                                            style={{ fontSize: 13, padding: '6px 8px' }}
                                            value={line.HANSUDUNG ? line.HANSUDUNG.split('T')[0] : ''}
                                            onChange={e => handleLineChange(idx, 'HANSUDUNG', e.target.value)}
                                        />
                                    ) : (
                                        <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                                            {line.HANSUDUNG ? new Date(line.HANSUDUNG).toLocaleDateString('vi-VN') : '—'}
                                        </span>
                                    )}
                                </td>
                                <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 600, color: 'var(--accent)' }}>
                                    {fmtVND(Number(line.SOLUONG) * Number(line.DONGIANHAP) || 0)}
                                </td>
                                {canEdit && (
                                    <td style={{ padding: '6px 4px', textAlign: 'center' }}>
                                        <button
                                            type="button"
                                            onClick={() => removeLine(idx)}
                                            style={{ background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.3)', borderRadius: 6, color: '#ef4444', width: 26, height: 26, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        >✕</button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Tổng tiền */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10, fontSize: 15, fontWeight: 700, color: 'var(--accent)' }}>
                    Tổng tiền: {fmtVND(totalTien)}
                </div>
            </div>
        </div>
    );
};
