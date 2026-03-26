import React from 'react';
import { Ico } from '../../components/Manage/Icons';
import { fmtInputNumber, parseInputNumber, fmtVND, fmtDate } from '../../components/Manage/Shared';
import { EliteSelect } from '../../components/Manage/EliteSelect';
import { FaCheckCircle, FaLock, FaClock, FaBan, FaStore, FaDiceSix } from 'react-icons/fa';

/* ── Voucher Preview (User Perspective) ──────────────── */
/* ── Voucher Preview (User Perspective) ──────────────── */
const VoucherPreview = ({ form, currTime }) => {
    const isFixed = parseInt(form.PTGIAM || 0) === 0;
    const amountStr = isFixed ? fmtVND(form.KMTOIDA || 0) : `${form.PTGIAM || 0}%`;

    // Timer Logic
    const getCtd = (st, en) => {
        const s = st ? new Date(st) : null;
        const e = en ? new Date(en) : null;

        if (s && currTime < s) {
            const diff = s - currTime;
            const d = Math.floor(diff / 864e5), h = Math.floor((diff % 864e5) / 36e5), m = Math.floor((diff % 36e5) / 6e4), s_ = Math.floor((diff % 6e4) / 1000);
            return { text: `Sắp bắt đầu: ${d} ngày ${h}h ${m}m ${s_}s`, type: 'future' };
        }

        if (!e) return { text: "Chưa chọn hạn sử dụng", type: 'none' };
        if (s && e < s) return { text: "Lỗi: Ngày kết thúc không hợp lệ", type: 'none' };

        if (currTime < e) {
            const diff = e - currTime;
            const d = Math.floor(diff / 864e5), h = Math.floor((diff % 864e5) / 36e5), m = Math.floor((diff % 36e5) / 6e4), s_ = Math.floor((diff % 6e4) / 1000);
            return { text: `Còn lại: ${d} ngày ${h}h ${m}m ${s_}s`, type: 'active' };
        }
        return { text: "Voucher đã hết hạn sử dụng", type: 'expired' };
    };

    const ctd = getCtd(form.NGAYBD, form.NGAYKT);
    const isExpired = ctd.type === 'expired' || form.TRANGTHAI === 2;
    const isFuture = ctd.type === 'future';
    const isLocked = form.TRANGTHAI === 0;
    const isActive = form.TRANGTHAI === 1 && !isExpired && !isFuture;

    // Determine theme and badge info
    let themeClass = 'status-active', sLabel = 'Hoạt động', sClass = 'badge-active';
    if (isLocked) {
        themeClass = 'status-locked'; sLabel = 'Bị khóa'; sClass = 'badge-inactive';
    } else if (isExpired) {
        themeClass = 'status-expired'; sLabel = 'Hết hạn'; sClass = 'badge-warning';
    } else if (isFuture) {
        themeClass = 'status-future'; sLabel = 'Chưa phát hành'; sClass = 'badge-info';
    }

    return (
        <div className="voucher-preview-side">
            <div className="preview-title-minimal">Xem trước voucher</div>

            <div className={`consumer-voucher ${themeClass}`}>
                <div className={`voucher-status-badge ${sClass}`}>
                    {sLabel}
                </div>

                <div className="voucher-main-section">
                    <div className="voucher-brand-sm">SIÊU THỊ MINI</div>
                    <div className="voucher-amount">{amountStr}</div>
                    <div className="voucher-min-order">
                        Đơn tối thiểu {fmtVND(form.GIATRITOITHIEU || 0)}
                    </div>
                </div>

                <div className="voucher-perforation" />

                <div className="voucher-bottom-section">
                    <div className="voucher-code-styled">{form.MAVOUCHER || 'VOUCHER_CODE'}</div>
                    <div className="preview-expiry-sm">
                        <FaClock size={10} />
                        HSD: {form.NGAYKT ? fmtDate(form.NGAYKT) : 'Chưa thiết lập'}
                    </div>
                </div>
            </div>

            {/* Countdown section below the ticket */}
            <div className={`preview-countdown-card ${sClass}`}>
                <FaClock size={14} style={{ marginRight: 8, opacity: 0.8 }} />
                <span>{ctd.text}</span>
            </div>

            <div className="preview-hint-minimal">
                Voucher hiện {sLabel.toLowerCase()}. Màu sắc và trạng thái cập nhật theo thời gian thực.
            </div>
        </div>
    );
};

export const emptyVoucher = {
    MAVOUCHER: '',
    MOTA: '',
    NGAYBD: '',
    NGAYKT: '',
    GIATRITOITHIEU: '',
    KMTOITHIEU: '',
    KMTOIDA: '',
    PTGIAM: 0,
    SOLUOTSD: '',
    SOLUOTSD_DADUNG: 0,
    TRANGTHAI: 2, // Mặc định là hết hạn
    KICHHOAT: true, // Thêm flag kích hoạt thủ công
};

/* ── Validation function ────────────────────────────── */
export const validateVoucher = (form) => {
    const errs = {};
    const isFixed = parseInt(form.PTGIAM || 0) === 0;

    if (!form.MAVOUCHER || !form.MAVOUCHER.trim()) {
        errs.MAVOUCHER = 'Mã voucher không được để trống.';
    } else if (form.MAVOUCHER.trim().length < 3) {
        errs.MAVOUCHER = 'Mã voucher phải có ít nhất 3 ký tự.';
    } else if (!/^[A-Z0-9_-]+$/i.test(form.MAVOUCHER.trim())) {
        errs.MAVOUCHER = 'Mã voucher chỉ được chứa chữ, số, dấu _ hoặc -.';
    }

    if (!form.MOTA || !form.MOTA.trim()) {
        errs.MOTA = 'Vui lòng nhập mô tả cho voucher.';
    } else if (form.MOTA.trim().length < 5) {
        errs.MOTA = 'Mô tả phải có ít nhất 5 ký tự.';
    }

    const now = new Date();
    now.setSeconds(0, 0); // Ignore seconds/ms for comparison to allow current minute

    if (!form.NGAYBD) {
        errs.NGAYBD = 'Vui lòng chọn ngày bắt đầu.';
    }
    // Cho phép ngày bắt đầu nhỏ hơn hiện tại theo yêu cầu người dùng

    if (!form.NGAYKT) {
        errs.NGAYKT = 'Vui lòng chọn ngày kết thúc.';
    } else if (new Date(form.NGAYKT) < now) {
        errs.NGAYKT = 'Thời gian kết thúc không thể bé hơn hiện tại.';
    } else if (form.NGAYBD && new Date(form.NGAYKT) <= new Date(form.NGAYBD)) {
        errs.NGAYKT = 'Thời gian kết thúc phải sau thời gian bắt đầu.';
    }

    const minOrder = parseInt(form.GIATRITOITHIEU || 0);
    if (minOrder < 0) {
        errs.GIATRITOITHIEU = 'Giá trị đơn hàng tối thiểu không được âm.';
    }

    if (!isFixed) {
        const pt = parseInt(form.PTGIAM || 0);
        if (!pt || pt <= 0) errs.PTGIAM = 'Phần trăm giảm phải lớn hơn 0.';
        else if (pt > 100) errs.PTGIAM = 'Phần trăm giảm không được vượt quá 100%.';

        const kmMin = parseInt(form.KMTOITHIEU || 0);
        const kmMax = parseInt(form.KMTOIDA || 0);
        if (kmMin < 0) errs.KMTOITHIEU = 'Giảm tối thiểu không được âm.';
        if (!kmMax || kmMax <= 0) errs.KMTOIDA = 'Giảm tối đa phải lớn hơn 0.';
        if (kmMin > 0 && kmMax > 0 && kmMin > kmMax) {
            errs.KMTOITHIEU = 'Giảm tối thiểu không được lớn hơn giảm tối đa.';
        }
    } else {
        const kmAmount = parseInt(form.KMTOIDA || 0);
        if (!kmAmount || kmAmount <= 0) errs.KMTOIDA = 'Số tiền giảm phải lớn hơn 0.';
        if (minOrder > 0 && kmAmount >= minOrder) {
            errs.KMTOIDA = 'Số tiền giảm phải nhỏ hơn đơn hàng tối thiểu.';
        }
    }

    const uses = parseInt(form.SOLUOTSD || 0);
    if (!uses || uses <= 1) {
        errs.SOLUOTSD = 'Tổng lượt sử dụng phải là số lớn hơn 1.';
    }

    return errs;
};

const ErrMsg = ({ msg }) =>
    msg ? (
        <span style={{ fontSize: 11, color: '#ef4444', display: 'block', marginTop: 4, fontWeight: 600 }}>
            ⚠ {msg}
        </span>
    ) : null;

/* ── Form Component ─────────────────────────────────── */
export const VoucherForm = ({ form, hc, setForm, readOnly, errors = {} }) => {
    const isFixed = parseInt(form.PTGIAM || 0) === 0;

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

    // Utility for input 'min' attribute
    const nowStr = new Date(currTime.getTime() - currTime.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

    React.useEffect(() => {
        const timer = setInterval(() => setCurrTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    React.useEffect(() => {
        if (readOnly) return;

        // Nếu người dùng tắt kích hoạt thủ công -> Khóa ngay lập tức
        if (form.KICHHOAT === false) {
            if (form.TRANGTHAI !== 0) {
                setForm(prev => ({ ...prev, TRANGTHAI: 0 }));
            }
            return;
        }

        // Tự động cập nhật TRANGTHAI dựa trên thời gian thực
        const now = currTime;
        const start = form.NGAYBD ? new Date(form.NGAYBD) : null;
        const end = form.NGAYKT ? new Date(form.NGAYKT) : null;

        const isOutOfS = (form.SOLUOTSD > 0) && (form.SOLUOTSD <= (form.SOLUOTSD_DADUNG || 0));
        const isExpired = (end && end < now) || isOutOfS;

        // Nếu đã có ngày bắt đầu và chưa hết hạn -> 1 (Hoạt động/Chưa phát hành)
        // Ngược lại -> 2 (Hết hạn)
        const targetSt = (start && !isExpired) ? 1 : 2;

        if (form.TRANGTHAI !== targetSt) {
            setForm(prev => ({ ...prev, TRANGTHAI: targetSt }));
        }
    }, [form.NGAYBD, form.NGAYKT, form.SOLUOTSD, form.SOLUOTSD_DADUNG, form.KICHHOAT, readOnly, currTime, setForm, form.TRANGTHAI]);

    const generateRandomCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let res = '';
        const rand = (n) => Math.floor(Math.random() * n);
        for (let i = 0; i < 8; i++) res += chars[rand(chars.length)];
        return "VC-" + res;
    };

    return (
        <div className="voucher-form-split">
            <div className="form-grid">
                <div className="form-section-title">{Ico.tag} Thông tin voucher</div>

                <div className="form-row">
                    <div className="form-group" style={{ flex: '1.2' }}>
                        <label className="form-label">Mã voucher *</label>
                        <div className="input-group-action">
                            <input
                                className="form-input"
                                name="MAVOUCHER"
                                value={form.MAVOUCHER}
                                onChange={(e) => {
                                    const val = e.target.value.toUpperCase();
                                    hc({ target: { name: 'MAVOUCHER', value: val } });
                                }}
                                placeholder="VD: SALE2026"
                                disabled={readOnly}
                                style={{ textTransform: 'uppercase', ...fieldStyle('MAVOUCHER'), flex: 1 }}
                            />
                            {!readOnly && (
                                <button
                                    type="button"
                                    className="btn-randomize"
                                    title="Tạo mã ngẫu nhiên"
                                    onClick={() => hc({ target: { name: 'MAVOUCHER', value: generateRandomCode() } })}
                                >
                                    <FaDiceSix size={18} />
                                </button>
                            )}
                        </div>
                        <ErrMsg msg={errors.MAVOUCHER} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Loại giảm giá</label>
                        <select className="form-select" value={isFixed ? 2 : 1} onChange={handleTypeChange} disabled={readOnly}>
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
                            placeholder="VD: 100.000"
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
                                placeholder="VD: 10"
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
                                placeholder="VD: 50.000"
                                disabled={readOnly}
                                style={fieldStyle('KMTOIDA')}
                            />
                            <ErrMsg msg={errors.KMTOIDA} />
                        </div>
                    )}
                </div>

                <div className="form-section-title" style={{ marginTop: 4 }}>{Ico.settings} Cấu hình & Giới hạn</div>

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
                                    placeholder="VD: 5.000"
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
                                    placeholder="VD: 30.000"
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
                            name="SOLUOTSD"
                            value={fmtInputNumber(form.SOLUOTSD)}
                            onChange={handleNumChange}
                            placeholder="VD: 100"
                            disabled={readOnly}
                            style={fieldStyle('SOLUOTSD')}
                        />
                        <ErrMsg msg={errors.SOLUOTSD} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Kích hoạt</label>
                        <div className="switch-container">
                            <label className={`switch ${readOnly ? 'disabled' : ''}`}>
                                <input
                                    type="checkbox"
                                    checked={form.KICHHOAT !== false}
                                    onChange={(e) => {
                                        if (readOnly) return;
                                        hc({ target: { name: 'KICHHOAT', value: e.target.checked } });
                                    }}
                                    disabled={readOnly}
                                />
                                <span className="slider"></span>
                            </label>
                            <span className="switch-label">
                                {form.KICHHOAT !== false ? 'Đang bật' : 'Đang tắt'}
                            </span>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Trạng thái hệ thống</label>
                        <div style={{ marginTop: 8 }}>
                            {(() => {
                                let sLabel = 'Hoạt động', sClass = 'badge-active';
                                const start = form.NGAYBD ? new Date(form.NGAYBD) : null;
                                const isFuture = start && start > currTime;

                                if (form.TRANGTHAI === 0) {
                                    sLabel = 'Bị khóa';
                                    sClass = 'badge-inactive';
                                }
                                else if (form.TRANGTHAI === 2) {
                                    sLabel = 'Hết hạn';
                                    sClass = 'badge-warning';
                                }
                                else if (isFuture) {
                                    sLabel = 'Chưa phát hành';
                                    sClass = 'badge-info';
                                }

                                return (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <span className={`voucher-badge ${sClass}`} style={{ fontSize: 12, padding: '4px 12px' }}>
                                            {sLabel}
                                        </span>
                                        <span style={{ fontSize: 11, color: 'var(--gray-500)' }}>
                                            {form.TRANGTHAI === 0 ? '(Thủ công)' : '(Tự động)'}
                                        </span>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                </div>

                <div className="form-section-title" style={{ marginTop: 4 }}>{Ico.calendar} Thời hạn & Mô tả</div>
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Bắt đầu từ *</label>
                        <input className="form-input" type="datetime-local" name="NGAYBD" value={form.NGAYBD} onChange={hc} disabled={readOnly} min={nowStr} style={fieldStyle('NGAYBD')} />
                        <ErrMsg msg={errors.NGAYBD} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Kết thúc vào *</label>
                        <input className="form-input" type="datetime-local" name="NGAYKT" value={form.NGAYKT} onChange={hc} disabled={readOnly} min={form.NGAYBD || nowStr} style={fieldStyle('NGAYKT')} />
                        <ErrMsg msg={errors.NGAYKT} />
                    </div>
                </div>
                <div className="form-group">
                    <label className="form-label">Mô tả</label>
                    <textarea className="form-input" name="MOTA" value={form.MOTA} onChange={hc} rows="2" placeholder="Nhập mô tả..." disabled={readOnly} style={fieldStyle('MOTA')} />
                    <ErrMsg msg={errors.MOTA} />
                </div>
            </div>
            <VoucherPreview form={form} currTime={currTime} />
        </div>
    );
};
