import React, { useState, useMemo } from 'react';
import { SimplePage } from '../../components/Manage/SimplePage';
import { Ico } from '../../components/Manage/Icons';
import { fmtVND, fmtDate, totalStock, earliestHSD, latestGiaNhap, avatarColor, STOCK_MAX } from '../../components/Manage/Shared';
import { EmptyState } from '../../components/Manage/EmptyState';
import { Modal } from '../../components/Manage/Modal';

const SP_EMPTY = { BARCODE: '', TENSP: '', DVT: 'cái', GIABAN: '', MALOAI: '', IS_DELETED: false };

export const ProductsPage = () => <SimplePage
    title="Sản phẩm" icon={Ico.box}
    subtitle={(l) => `${l.filter(s => !s.IS_DELETED).length} đang bán · ${l.length} tổng`}
    emptyTitle="Chưa có sản phẩm" emptyDesc="Nhấn + Thêm để bắt đầu"
    cols={['Sản phẩm', 'Giá bán', 'Giá vốn', 'Tồn kho', 'HSD', 'Trạng thái']}
    emptyForm={SP_EMPTY}
    tabs={[
        { id: 'all', label: 'Tất cả' },
        { id: 'selling', label: 'Đang bán', filter: (x) => !x.IS_DELETED },
        { id: 'low-stock', label: 'Sắp hết hàng', filter: (x) => totalStock(x.tonKhos) > 0 && totalStock(x.tonKhos) < 10 },
        { id: 'out-of-stock', label: 'Hết hàng', filter: (x) => totalStock(x.tonKhos) === 0 },
        { id: 'inactive', label: 'Ngừng bán', filter: (x) => x.IS_DELETED },
    ]}
    renderRow={(sp, i) => {
        const stock = totalStock(sp.tonKhos), hsd = earliestHSD(sp.tonKhos), gn = latestGiaNhap(sp.tonKhos), pct = Math.min(100, Math.round((stock / STOCK_MAX) * 100));
        return [
            <td key="1"><div className="cell-entity"><div className="entity-avatar" style={{ background: avatarColor(i), borderRadius: 8 }}>{(sp.TENSP[0] || '?').toUpperCase()}</div><div><div className="entity-name">{sp.TENSP}</div><div className="entity-sub">{sp.BARCODE}</div></div></div></td>,
            <td key="2" className="price-main">{fmtVND(sp.GIABAN)}</td>,
            <td key="3" className="price-cost">{gn ? fmtVND(gn) : '—'}</td>,
            <td key="4"><div className="stock-cell"><div className="stock-bar"><div className="stock-fill" style={{ width: `${pct}%`, background: stock === 0 ? 'var(--red)' : undefined }} /></div><span className="stock-count" style={{ color: stock === 0 ? 'var(--red)' : undefined }}>{stock}</span></div></td>,
            <td key="5" style={{ color: 'var(--text-muted)', fontSize: 12 }}>{fmtDate(hsd)}</td>,
            <td key="6"><span className={sp.IS_DELETED ? 'badge badge-inactive' : 'badge badge-active'}>{sp.IS_DELETED ? 'Ngừng' : 'Đang bán'}</span></td>,
        ];
    }}
    renderActions={(sp, openEdit, del, i, list, setList) => {
        const toggle = () => setList(prev => prev.map(x => x.MASP === sp.MASP ? { ...x, IS_DELETED: !x.IS_DELETED } : x));
        return (
            <>
                <button className="btn-action-ico btn-toggle" title={sp.IS_DELETED ? "Mở bán" : "Ngừng bán"} onClick={toggle}>
                    {sp.IS_DELETED ? Ico.power : Ico.ban}
                </button>
                <button className="btn-action-ico btn-edit" title="Sửa" onClick={() => openEdit(sp)}>{Ico.edit}</button>
                <button className="btn-action-ico btn-del" title="Xóa" onClick={() => del(sp.MASP)}>{Ico.trash}</button>
            </>
        );
    }}
    renderGridItem={(sp, openEdit, del, i, list, setList) => {
        const stock = totalStock(sp.tonKhos), pct = Math.min(100, Math.round((stock / STOCK_MAX) * 100));
        const toggle = () => setList(prev => prev.map(x => x.MASP === sp.MASP ? { ...x, IS_DELETED: !x.IS_DELETED } : x));
        return (
            <div key={sp.MASP} className="voucher-card">
                <div className="voucher-card-top">
                    <div className="voucher-icon-box" style={{ background: avatarColor(i), color: '#fff', fontSize: 18, fontWeight: 800 }}>{(sp.TENSP[0] || '?').toUpperCase()}</div>
                    <span className={sp.IS_DELETED ? 'badge badge-inactive' : 'badge badge-active'}>{sp.IS_DELETED ? 'Ngừng' : 'Đang bán'}</span>
                </div>
                <div className="voucher-card-mid" style={{ flex: 1 }}>
                    <div className="voucher-code" style={{ fontFamily: 'var(--font)', fontSize: 15 }}>{sp.TENSP}</div>
                    <div className="voucher-label">{sp.BARCODE}</div>
                    <div className="stock-cell" style={{ marginTop: 12 }}>
                        <div className="stock-bar" style={{ flex: 1 }}><div className="stock-fill" style={{ width: `${pct}%`, background: stock === 0 ? 'var(--red)' : undefined }} /></div>
                        <span className="stock-count" style={{ fontSize: 11 }}>{stock} tồn</span>
                    </div>
                </div>
                <div className="ticket-divider" />
                <div className="voucher-card-bottom">
                    <div className="voucher-value" style={{ fontSize: 18 }}>{fmtVND(sp.GIABAN)}</div>
                    <div className="voucher-label">{sp.DVT}</div>
                </div>
                <div className="voucher-actions">
                    <button className="btn-edit" style={{ background: 'var(--amber-bg)', color: 'var(--amber)', borderColor: 'var(--amber-bd)' }} onClick={toggle}>{sp.IS_DELETED ? Ico.power : Ico.ban}</button>
                    <button className="btn-edit" onClick={() => openEdit(sp)}>{Ico.edit}</button>
                    <button className="btn-del" onClick={() => del(sp.MASP)}>{Ico.trash}</button>
                </div>
            </div>
        );
    }}
    renderForm={(form, hc, setForm) => <>
        <div className="form-group"><label className="form-label">Tên sản phẩm</label><input className="form-input" name="TENSP" value={form.TENSP} onChange={hc} placeholder="Nước ngọt Coca-Cola 330ml" /></div>
        <div className="form-row"><div className="form-group"><label className="form-label">Barcode</label><input className="form-input" name="BARCODE" value={form.BARCODE} onChange={hc} placeholder="8934588..." /></div><div className="form-group"><label className="form-label">Đơn vị tính</label><input className="form-input" name="DVT" value={form.DVT} onChange={hc} placeholder="cái / hộp / kg" /></div></div>
        <div className="form-row"><div className="form-group"><label className="form-label">Giá bán (₫)</label><input className="form-input" type="number" name="GIABAN" value={form.GIABAN} onChange={hc} placeholder="15000" /></div><div className="form-group"><label className="form-label">Trạng thái</label><select className="form-select" name="IS_DELETED" value={form.IS_DELETED ? 'true' : 'false'} onChange={e => setForm(p => ({ ...p, IS_DELETED: e.target.value === 'true' }))}><option value="false">Đang bán</option><option value="true">Ngừng bán</option></select></div></div>
    </>}
/>;
