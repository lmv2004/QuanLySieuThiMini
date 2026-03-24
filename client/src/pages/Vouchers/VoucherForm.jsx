import React from 'react';
import { Ico } from '../../components/Manage/Icons';
import { fmtInputNumber, parseInputNumber } from '../../components/Manage/Shared';
import { EliteSelect } from '../../components/Manage/EliteSelect';
import { FaCheckCircle, FaLock, FaClock, FaBan } from 'react-icons/fa';

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
    SOLUOTSD_DADUNG: 0,
    TRANGTHAI: 2, // 2: Hết hạn
};

/* ── Validation function ────────────────────────────── */
export const validateVoucher = (form) => {
    const errs = {};
    const isFixed = form.PTGIAM === 0;

    // Mã voucher
    if (!form.MAVOUCHER || !form.MAVOUCHER.trim()) {
        errs.MAVOUCHER = 'Mã voucher không được để trống.';
    } else if (form.MAVOUCHER.trim().length < 3) {
        errs.MAVOUCHER = 'Mã voucher phải có ít nhất 3 ký tự.';
    } else if (!/^[A-Z0-9_-]+$/i.test(form.MAVOUCHER.trim())) {
        errs.MAVOUCHER = 'Mã voucher chỉ được chứa chữ, số, dấu _ hoặc -.';
    }

    // Ngày bắt đầu & kết thúc
    if (!form.NGAYBD) {
        errs.NGAYBD = 'Vui lòng chọn ngày bắt đầu.';
    }
    if (!form.NGAYKT) {
        errs.NGAYKT = 'Vui lòng chọn ngày kết thúc.';
    }
    if (form.NGAYBD && form.NGAYKT && new Date(form.NGAYKT) <= new Date(form.NGAYBD)) {
        errs.NGAYKT = 'Ngày kết thúc phải sau ngày bắt đầu.';
    }

    // Giá trị đơn hàng tối thiểu
    if (form.GIATRITOITHIEU < 0) {
        errs.GIATRITOITHIEU = 'Giá trị đơn hàng tối thiểu không được âm.';
    }

    // Phần trăm giảm
    if (!isFixed) {
        if (!form.PTGIAM || form.PTGIAM <= 0) {
            errs.PTGIAM = 'Phần trăm giảm phải lớn hơn 0.';
        } else if (form.PTGIAM > 100) {
            errs.PTGIAM = 'Phần trăm giảm không được vượt quá 100%.';
        }
        // Giảm tối thiểu & tối đa
        if (form.KMTOITHIEU < 0) {
            errs.KMTOITHIEU = 'Giảm tối thiểu không được âm.';
        }
        if (form.KMTOIDA <= 0) {
            errs.KMTOIDA = 'Giảm tối đa phải lớn hơn 0.';
        }
        if (form.KMTOITHIEU > 0 && form.KMTOIDA > 0 && form.KMTOITHIEU > form.KMTOIDA) {
            errs.KMTOITHIEU = 'Giảm tối thiểu không được lớn hơn giảm tối đa.';
        }
    } else {
        // Số tiền cố định
        if (form.KMTOIDA <= 0) {
            errs.KMTOIDA = 'Số tiền giảm phải lớn hơn 0.';
        }
        if (form.GIATRITOITHIEU > 0 && form.KMTOIDA >= form.GIATRITOITHIEU) {
            errs.KMTOIDA = 'Số tiền giảm phải nhỏ hơn đơn hàng tối thiểu.';
        }
    }

    // Lượt sử dụng
    if (!form.SOLUOTSD || form.SOLUOTSD <= 0) {
        errs.SOLUOTSD = 'Tổng lượt sử dụng phải lớn hơn 0.';
    }

    return errs;
};

/* ── Helper: hiển thị thông báo lỗi ────────────────── */
const ErrMsg = ({ msg }) =>
    msg ? (
        <span style={{ fontSize: 11, color: '#ef4444', display: 'block', marginTop: 4, fontWeight: 600 }}>
            ⚠ {msg}
        </span>
    ) : null;

/* ── Form Component ─────────────────────────────────── */
export const VoucherForm = ({ form, hc, setForm, readOnly, errors = {} }) => {
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

    const fieldStyle = (field) => ({
        border: errors[field] ? '1.5px solid #ef4444' : undefined,
        background: errors[field] ? '#fff5f5' : undefined,
    });

    const [currTime, setCurrTime] = React.useState(new Date());

    // Cập nhật đồng hồ mỗi giây
    React.useEffect(() => {
        const timer = setInterval(() => setCurrTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Tự động cập nhật trạng thái khi dữ liệu thay đổi
    React.useEffect(() => {
        if (readOnly) return;
        
        const isAv = (!form.NGAYKT || new Date(form.NGAYKT) >= currTime) &&
                     ((form.SOLUOTSD || 0) > (form.SOLUOTSD_DADUNG || 0));
        
        if (form.TRANGTHAI === 1 && !isAv) {
            setForm(prev => ({ ...prev, TRANGTHAI: 2 }));
        } else if (form.TRANGTHAI === 2 && isAv) {
            setForm(prev => ({ ...prev, TRANGTHAI: 1 }));
        }
    }, [form.NGAYKT, form.SOLUOTSD, form.SOLUOTSD_DADUNG, readOnly, currTime]);

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
                        style={{ textTransform: 'uppercase', ...fieldStyle('MAVOUCHER') }}
                    />
                    <ErrMsg msg={errors.MAVOUCHER} />
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
                        style={fieldStyle('GIATRITOITHIEU')}
                    />
                    <ErrMsg msg={errors.GIATRITOITHIEU} />
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
                            style={fieldStyle('PTGIAM')}
                        />
                        <ErrMsg msg={errors.PTGIAM} />
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
                            style={fieldStyle('KMTOIDA')}
                        />
                        <ErrMsg msg={errors.KMTOIDA} />
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
                                style={fieldStyle('KMTOITHIEU')}
                            />
                            <ErrMsg msg={errors.KMTOITHIEU} />
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
                                style={fieldStyle('KMTOIDA')}
                            />
                            <ErrMsg msg={errors.KMTOIDA} />
                        </div>
                    </>
                )}
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Tổng lượt sử dụng</label>
                    <input
                        className="form-input"
                        type="number"
                        name="SOLUOTSD"
                        value={form.SOLUOTSD}
                        onChange={hc}
                        min="0"
                        disabled={readOnly}
                        style={fieldStyle('SOLUOTSD')}
                    />
                    <ErrMsg msg={errors.SOLUOTSD} />
                </div>
                <div className="form-group">
                    <label className="form-label">Thiết lập trạng thái</label>
                    <EliteSelect
                        options={[
                            { value: 1, label: 'Hoạt động', icon: <FaCheckCircle />, iconClass: 'opt-icon-active' },
                            { value: 0, label: 'Bị khóa', icon: <FaLock />, iconClass: 'opt-icon-locked' },
                            { value: 2, label: 'Hết hạn', icon: <FaClock />, iconClass: 'opt-icon-expired' },
                        ]}
                        value={form.TRANGTHAI}
                        onChange={(val) => hc({ target: { name: 'TRANGTHAI', value: val } })}
                        disabled={readOnly}
                        placeholder="Chọn trạng thái..."
                    />
                </div>
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Thời gian hiệu lực (Đếm ngược)</label>
                {(() => {
                    const getCtd = (st, en) => {
                        if (!en) return "0 (Chưa chọn hạn)";
                        const s = new Date(st);
                        const e = new Date(en);
                        if (e < s) return "Lỗi: Ngày kết thúc < Ngày bắt đầu";
                        
                        if (currTime < s) {
                            const diff = s - currTime;
                            const d = Math.floor(diff / 864e5);
                            const h = Math.floor((diff % 864e5) / 36e5);
                            const m = Math.floor((diff % 36e5) / 6e4);
                            const sec = Math.floor((diff % 6e4) / 1000);
                            return `Sắp diễn ra (trong: ${d} ngày ${h} giờ ${m} phút ${sec} giây)`;
                        }
                        if (currTime < e) {
                            const diff = e - currTime;
                            const d = Math.floor(diff / 864e5);
                            const h = Math.floor((diff % 864e5) / 36e5);
                            const m = Math.floor((diff % 36e5) / 6e4);
                            const sec = Math.floor((diff % 6e4) / 1000);
                            return `Còn lại: ${d} ngày, ${h} giờ, ${m} phút, ${sec} giây`;
                        }
                        return "0 (Đã quá thời hạn)";
                    };
                    const text = getCtd(form.NGAYBD, form.NGAYKT);
                    const isError = text.includes("Lỗi");
                    const isExpired = text.includes("0 (") || isError;
                    const isFuture = text.includes("Sắp diễn ra");
                    const isAv = form.TRANGTHAI === 1 && !isExpired && !isError;

                    return (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <div style={{
                                height: 42,
                                display: 'flex',
                                alignItems: 'center',
                                padding: '0 15px',
                                background: isExpired ? 'var(--amber-bg)' : (isFuture ? '#f0f9ff' : 'var(--green-bg)'),
                                border: '1px solid ' + (isExpired ? 'var(--amber-bd)' : (isFuture ? '#bae6fd' : 'var(--green-bd)')),
                                borderRadius: 8,
                                fontSize: 14,
                                color: isExpired ? 'var(--amber)' : (isFuture ? '#0369a1' : 'var(--green)'),
                                fontWeight: 700,
                                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
                            }}>
                                <FaClock style={{ marginRight: 10, fontSize: 16, animation: !isExpired ? 'spin 2s linear infinite' : 'none', opacity: 0.8 }} className={!isExpired ? 'fa-spin-slow' : ''} />
                                <span style={{ fontFamily: 'monospace', letterSpacing: '0.3px' }}>{text}</span>
                            </div>

                            {form.TRANGTHAI === 1 && (
                                isAv ? (
                                    <div style={{ 
                                        fontSize: 12, color: 'var(--green)', fontWeight: 700, 
                                        display: 'flex', alignItems: 'center', gap: 8, 
                                        padding: '10px 15px', background: 'var(--green-bg)',
                                        borderRadius: '10px', border: '1px solid var(--green-bd)',
                                        marginTop: 4
                                    }}>
                                        <FaCheckCircle size={14} />
                                        <span>Voucher hiện <b>Hợp lệ</b> (Đang chờ hoặc đang sử dụng).</span>
                                    </div>
                                ) : (
                                    <div style={{ 
                                        fontSize: 12, color: 'var(--amber)', fontWeight: 700, 
                                        display: 'flex', alignItems: 'center', gap: 8, 
                                        padding: '10px 15px', background: 'var(--amber-bg)',
                                        borderRadius: '10px', border: '1px solid var(--amber-bd)',
                                        marginTop: 4
                                    }}>
                                        <FaBan size={14} />
                                        <span>Voucher này hiện <b>Hết hạn</b> (Quá hạn hoặc hết lượt).</span>
                                    </div>
                                )
                            )}
                            {form.TRANGTHAI === 2 && (
                                <div style={{ 
                                    fontSize: 12, color: 'var(--amber)', fontWeight: 700, 
                                    display: 'flex', alignItems: 'center', gap: 8, 
                                    padding: '10px 15px', background: 'var(--amber-bg)',
                                    borderRadius: '10px', border: '1px solid var(--amber-bd)',
                                    marginTop: 4
                                }}>
                                    <FaClock size={14} />
                                    <span>Hệ thống ghi nhận trạng thái: <b>Hết hạn</b> (Thiết lập thủ công).</span>
                                </div>
                            )}
                        </div>
                    );
                })()}
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
                        style={fieldStyle('NGAYBD')}
                    />
                    <ErrMsg msg={errors.NGAYBD} />
                </div>
                <div className="form-group">
                    <label className="form-label">Kết thúc vào *</label>
                    <input
                        className="form-input"
                        type="datetime-local"
                        name="NGAYKT"
                        value={form.NGAYKT}
                        onChange={hc}
                        disabled={readOnly || !form.NGAYBD}
                        min={form.NGAYBD}
                        style={{
                            ...fieldStyle('NGAYKT'),
                            opacity: !form.NGAYBD ? 0.6 : 1,
                            cursor: !form.NGAYBD ? 'not-allowed' : 'auto'
                        }}
                    />
                    <ErrMsg msg={errors.NGAYKT} />
                    {!form.NGAYBD && !readOnly && (
                        <span style={{ fontSize: 10, color: 'var(--amber)', marginTop: 4, display: 'block' }}>
                            (Vui lòng chọn ngày bắt đầu trước)
                        </span>
                    )}
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
