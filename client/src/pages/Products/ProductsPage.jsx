import React from 'react';
import { SimplePage } from '../../components/Manage/SimplePage';
import { Ico } from '../../components/Manage/Icons';
import { fmtVND, fmtDate, totalStock, earliestHSD, latestGiaNhap, avatarColor, STOCK_MAX } from '../../components/Manage/Shared';
import { ProductForm, emptyProduct } from './ProductForm';
import { ProductActions } from './ProductActions';
import { ProductGridItem } from './ProductGridItem';
import { ProductImportExport } from './ProductImportExport';

export const ProductsPage = () => <SimplePage
    title="Sản phẩm" icon={Ico.box} apiEndpoint="/products"
    subtitle={(l) => `${l.filter(s => !s.IS_DELETED).length} đang bán · ${l.length} tổng`}
    emptyTitle="Chưa có sản phẩm" emptyDesc="Nhấn + Thêm để bắt đầu"
    cols={['Sản phẩm', 'Giá bán', 'Giá vốn', 'Tồn kho', 'HSD', 'Trạng thái', 'Hành động']}
    emptyForm={emptyProduct}
    tabs={[
        { id: 'all', label: 'Tất cả' },
        { id: 'selling', label: 'Đang bán', filter: (x) => !x.IS_DELETED },
        { id: 'low-stock', label: 'Sắp hết hàng', filter: (x) => totalStock(x.tonKhos) > 0 && totalStock(x.tonKhos) < 10 },
        { id: 'out-of-stock', label: 'Hết hàng', filter: (x) => totalStock(x.tonKhos) === 0 },
        { id: 'inactive', label: 'Ngừng bán', filter: (x) => x.IS_DELETED },
    ]}
    renderToolbarActions={(fetchData, addToast, list) => (
        <ProductImportExport onRefresh={fetchData} addToast={addToast} data={list} />
    )}
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
    renderActions={(item, openEdit, del, i, list, setList, addToast, openView) => (
        <ProductActions item={item} openEdit={openEdit} del={del} list={list} setList={setList} addToast={addToast} openView={openView} />
    )}
    renderGridItem={(item, openEdit, del, i, list, setList, addToast, openView) => (
        <ProductGridItem item={item} openEdit={openEdit} del={del} idx={i} list={list} setList={setList} addToast={addToast} openView={openView} />
    )}
    renderForm={(form, hc, setForm) => (
        <ProductForm form={form} hc={hc} setForm={setForm} />
    )}
/>;
