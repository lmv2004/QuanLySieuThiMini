import React from 'react';
import { SimplePage } from '../../components/Manage/SimplePage';
import { Ico } from '../../components/Manage/Icons';
import { fmtVND, fmtDate, totalStock, earliestHSD, latestGiaNhap, avatarColor, STOCK_MAX } from '../../components/Manage/Shared';
import { ProductForm, emptyProduct } from './ProductForm';
import { ProductActions } from './ProductActions';
import { ProductGridItem } from './ProductGridItem';
import { ProductImportExport } from './ProductImportExport';
import './ProductsPage.css';

export const ProductsPage = () => (
    <div className="products-page">
        <SimplePage
            title="Sản phẩm" icon={Ico.box} apiEndpoint="/products"
            primaryKey="MASP"
            subtitle={(l) => `${l.filter(s => !s.IS_DELETED).length} đang bán · ${l.length} tổng`}
            emptyTitle="Chưa có sản phẩm" emptyDesc="Nhấn + Thêm để bắt đầu"
            cols={['Mã SP', 'Hình ảnh', 'Barcode', 'Tên sản phẩm', 'Mô tả', 'ĐVT', 'Giá bán']}
            emptyForm={emptyProduct}
            transformBeforeSave={(payload) => {
                const { LOAISP, NHACC, ...rest } = payload;
                return rest;
            }}
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
            renderRow={(sp, i) => (
                [
                    <td key="1" style={{ color: 'var(--text-muted)', fontSize: 12 }}>{sp.MASP ?? '—'}</td>,
                    <td key="2">
                        <div className="cell-entity">
                            <div className="entity-avatar" style={{ background: avatarColor(i), borderRadius: 8, overflow: 'hidden' }}>
                                {sp.HINHANH ? (
                                    <img src={sp.HINHANH} alt={sp.TENSP} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <span>{(sp.TENSP?.[0] || '?').toUpperCase()}</span>
                                )}
                            </div>
                        </div>
                    </td>,
                    <td key="3" className="entity-sub">{sp.BARCODE || '—'}</td>,
                    <td key="4"><div className="entity-name">{sp.TENSP || '—'}</div></td>,
                    <td key="5" style={{ color: 'var(--text-muted)', fontSize: 12 }}>{sp.MOTA || '—'}</td>,
                    <td key="6" style={{ fontSize: 12 }}>{sp.DVT || '—'}</td>,
                    <td key="7" className="price-main">{fmtVND(sp.GIABAN)}</td>,
                ]
            )}
            renderActions={(item, openEdit, del, i, list, setList, addToast, openView) => (
                <ProductActions item={item} openEdit={openEdit} del={del} list={list} setList={setList} addToast={addToast} openView={openView} />
            )}
            renderGridItem={(item, openEdit, del, i, list, setList, addToast, openView) => (
                <ProductGridItem item={item} openEdit={openEdit} del={del} idx={i} list={list} setList={setList} addToast={addToast} openView={openView} />
            )}
            renderForm={(form, hc, setForm, readOnly, errors, mode) => (
                <ProductForm form={form} hc={hc} setForm={setForm} readOnly={readOnly} errors={errors} mode={mode} />
            )}
        />
    </div>
);
