import React from 'react';
import { Ico } from '../../components/Manage/Icons';
import { fmtInputNumber, parseInputNumber } from '../../components/Manage/Shared';

export const emptyVoucher = {
    MAVOUCHER: '',
    MOTA: '',
    NGAYBD: '',
    NGAYKT: '',
    GIATRITOITHIEU: 0,
    KMTOITHIEU: 0,
    KMTOIDA: 0,
    PTGIAM: 0,
    SOLUOTSD: 0,
    DADUNG: 0,
    TRANGTHAI: 1
};

export const VoucherForm = ({ form, hc, setForm, readOnly }) => {
    const isFixed = form.PTGIAM === 0;

    const handleTypeChange = (e) => {
        if (readOnly) return;
        const type = parseInt(e.target.value);
        hc({ target: { name: 'PTGIAM', value: type === 2 ? 0 : 10 } });
    };

    const handleNumChange = (e) => {
        if (readOnly) return;
        const { name, value } = e.target;
        const numVal = parseInputNumber(value);
        if (isFixed && (name === 'KMTOITHIEU' || name === 'KMTOIDA')) {
            hc({ target: { name: 'KMTOITHIEU', value: numVal } });
            hc({ target: { name: 'KMTOIDA', value: numVal } });
        } else {
            hc({ target: { name, value: numVal } });
        }
    };

    return (
        <div className="form-grid">
            {/* ── Section 1: Thông tin cơ bản ── */}
            <div className="form-section-title">
                {Ico.tag} Thông tin voucher
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Mã voucher *</label>
                    <input
                        className="form-input"
                        name="MAVOUCHER"
                        value={form.MAVOUCHER}
                        onChange={hc}
                        placeholder="VD: SALE2026"
                        disabled={readOnly}
                        style={{ textTransform: 'uppercase' }}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Loại giảm giá</label>
                    <select
                        className="form-select"
                        value={isFixed ? 2 : 1}
                        onChange={handleTypeChange}
                        disabled={readOnly}
                    >
                        <option value={1}>Theo phần trăm (%)</option>
                        <option value={2}>Số tiền cố định (₫)</option>
                    </select>
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Đơn hàng tối thiểu (₫)</label>
                    <input
                        className="form-input"
                        name="GIATRITOITHIEU"
                        value={fmtInputNumber(form.GIATRITOITHIEU)}
                        onChange={handleNumChange}
                        placeholder="0"
                        disabled={readOnly}
                    />
                </div>
                {!isFixed ? (
                    <div className="form-group">
                        <label className="form-label">Phần trăm giảm (%)</label>
                        <input
                            className="form-input"
                            type="number"
                            name="PTGIAM"
                            value={form.PTGIAM}
                            onChange={hc}
                            min="1" max="100"
                            disabled={readOnly}
                        />
                    </div>
                ) : (
                    <div className="form-group">
                        <label className="form-label">Số tiền giảm (₫)</label>
                        <input
                            className="form-input"
                            name="KMTOIDA"
                            value={fmtInputNumber(form.KMTOIDA)}
                            onChange={handleNumChange}
                            placeholder="0"
                            disabled={readOnly}
                        />
                    </div>
                )}
            </div>

            {/* ── Section 2: Cấu hình ── */}
            <div className="form-section-title" style={{ marginTop: 4 }}>
                {Ico.settings} Cấu hình & Giới hạn
            </div>

            <div className="form-row">
                {!isFixed && (
                    <>
                        <div className="form-group">
                            <label className="form-label">Giảm tối thiểu (₫)</label>
                            <input
                                className="form-input"
                                name="KMTOITHIEU"
                                value={fmtInputNumber(form.KMTOITHIEU)}
                                onChange={handleNumChange}
                                placeholder="0"
                                disabled={readOnly}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Giảm tối đa (₫)</label>
                            <input
                                className="form-input"
                                name="KMTOIDA"
                                value={fmtInputNumber(form.KMTOIDA)}
                                onChange={handleNumChange}
                                placeholder="0"
                                disabled={readOnly}
                            />
                        </div>
                    </>
                )}
                {isFixed && (
                    <div className="form-group">
                        <label className="form-label">Tổng lượt sử dụng</label>
                        <input
                            className="form-input"
                            type="number"
                            name="SOLUOTSD"
                            value={form.SOLUOTSD}
                            onChange={hc}
                            min="1"
                            disabled={readOnly}
                        />
                    </div>
                )}
                {!isFixed && (
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label className="form-label">Tổng lượt sử dụng</label>
                        <input
                            className="form-input"
                            type="number"
                            name="SOLUOTSD"
                            value={form.SOLUOTSD}
                            onChange={hc}
                            min="1"
                            disabled={readOnly}
                        />
                    </div>
                )}
            </div>

            {/* Trạng thái */}
            <div className="form-group">
                <label className="form-label">Trạng thái</label>
                <select
                    className="form-select"
                    name="TRANGTHAI"
                    value={form.TRANGTHAI}
                    onChange={hc}
                    disabled={readOnly}
                >
                    <option value={1}>✅ Hoạt động</option>
                    <option value={0}>🔒 Tạm khóa</option>
                </select>
            </div>

            {/* ── Section 3: Thời hạn ── */}
            <div className="form-section-title" style={{ marginTop: 4 }}>
                {Ico.calendar} Thời hạn & Mô tả
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Bắt đầu từ *</label>
                    <input
                        className="form-input"
                        type="datetime-local"
                        name="NGAYBD"
                        value={form.NGAYBD}
                        onChange={hc}
                        disabled={readOnly}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Kết thúc vào *</label>
                    <input
                        className="form-input"
                        type="datetime-local"
                        name="NGAYKT"
                        value={form.NGAYKT}
                        onChange={hc}
                        disabled={readOnly}
                    />
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">Mô tả</label>
                <textarea
                    className="form-input"
                    name="MOTA"
                    value={form.MOTA}
                    onChange={hc}
                    rows="2"
                    placeholder="Nhập mô tả chương trình ưu đãi..."
                    disabled={readOnly}
                    style={{ resize: 'vertical', minHeight: 60 }}
                />
            </div>
        </div>
    );
};
