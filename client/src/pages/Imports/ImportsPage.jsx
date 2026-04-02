import React, { useState, useEffect } from 'react';
import { SimplePage } from '../../components/Manage/SimplePage';
import { Ico } from '../../components/Manage/Icons';
import { fmtDate, fmtVND } from '../../components/Manage/Shared';
import { ImportForm, emptyImport } from './ImportForm';
import { ImportActions } from './ImportActions';
import { ImportGridItem } from './ImportGridItem';
import { ImportImportExport } from './ImportImportExport';
import api from '../../services/api';

const STATUS_MAP = {
    APPROVED:  { label: 'Đã duyệt', cls: 'badge badge-active' },
    PENDING:   { label: 'Chờ duyệt', cls: 'badge badge-pending' },
    CANCELLED: { label: 'Đã hủy',   cls: 'badge badge-inactive' },
};

export const ImportsPage = () => {
    const [suppliers, setSuppliers] = useState([]);

    // Fetch danh sách NCC một lần, truyền xuống form
    useEffect(() => {
        api.get('/suppliers', { params: { per_page: 1000 } })
            .then(res => {
                const data = res?.data ?? res;
                const items = Array.isArray(data) ? data : (data?.data ?? []);
                setSuppliers(items.filter(s => !s.IS_DELETED));
            })
            .catch(() => {});
    }, []);

    return (
        <SimplePage
            title="Phiếu nhập hàng"
            icon={Ico.file}
            apiEndpoint="/purchase-orders"
            primaryKey="MAPHIEU"
            subtitle={(l) => `${l.filter(x => x.TRANGTHAI === 'APPROVED').length} đã duyệt · ${l.filter(x => x.TRANGTHAI === 'PENDING').length} chờ duyệt · ${l.length} tổng`}
            emptyTitle="Chưa có phiếu nhập"
            emptyDesc="Nhấn + Thêm mới để tạo phiếu nhập"
            cols={['Mã phiếu', 'Ngày lập', 'Nhà cung cấp', 'NV lập', 'Tổng tiền', 'Trạng thái', 'Hành động']}
            emptyForm={emptyImport}
            tabs={[
                { id: 'all',       label: 'Tất cả' },
                { id: 'pending',   label: 'Chờ duyệt',  filter: (x) => x.TRANGTHAI === 'PENDING' },
                { id: 'approved',  label: 'Đã duyệt',   filter: (x) => x.TRANGTHAI === 'APPROVED' },
                { id: 'cancelled', label: 'Đã hủy',     filter: (x) => x.TRANGTHAI === 'CANCELLED' },
            ]}
            renderToolbarActions={(fetchData, addToast, list) => (
                <ImportImportExport onRefresh={fetchData} addToast={addToast} data={list} />
            )}
            renderRow={(p) => {
                const st = STATUS_MAP[p.TRANGTHAI] ?? STATUS_MAP.PENDING;
                const nccName = p.nhaCungCap?.TENNCC ?? suppliers.find(s => s.MANCC === p.MANCC)?.TENNCC ?? '—';
                return [
                    <td key="1">
                        <span className="code-link">
                            IMP-{String(p.MAPHIEU).padStart(3, '0')}
                        </span>
                    </td>,
                    <td key="2" style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                        {p.NGAYLAP ? fmtDate(p.NGAYLAP) : '—'}
                    </td>,
                    <td key="3" style={{ fontSize: 13 }}>{nccName}</td>,
                    <td key="4" style={{ fontSize: 13 }}>
                        {p.nhanVien?.TENNV ?? '—'}
                    </td>,
                    <td key="5" className="price-main">{fmtVND(p.TONGTIEN)}</td>,
                    <td key="6"><span className={st.cls}>{st.label}</span></td>,
                ];
            }}
            renderActions={(item, openEdit, del, i, list, setList, addToast, openView) => (
                <ImportActions
                    item={item}
                    openEdit={openEdit}
                    del={del}
                    list={list}
                    setList={setList}
                    addToast={addToast}
                    openView={openView}
                />
            )}
            renderGridItem={(item, openEdit, del, i, list, setList, addToast, openView) => (
                <ImportGridItem
                    item={item}
                    openEdit={openEdit}
                    del={del}
                    idx={i}
                    list={list}
                    setList={setList}
                    addToast={addToast}
                    openView={openView}
                    suppliers={suppliers}
                />
            )}
            validate={(form) => {
                const errs = {};
                if (!form.MANCC) errs.MANCC = 'Vui lòng chọn nhà cung cấp';
                const lines = Array.isArray(form.chiTiets) ? form.chiTiets : [];
                if (lines.length === 0) errs.chiTiets = 'Phiếu nhập phải có ít nhất 1 sản phẩm';
                else if (lines.some(l => !l.MASP || !l.SOLUONG || !l.DONGIANHAP))
                    errs.chiTiets = 'Vui lòng điền đầy đủ thông tin sản phẩm (SP, SL, đơn giá)';
                return errs;
            }}
            customSave={async (form, isEdit, setList, addToast, close) => {
                // NGAYLAP và MANV do server tự gán — không gửi lên
                const payload = {
                    MANCC:    form.MANCC,
                    GCHU:     form.GCHU || undefined,
                    chiTiets: (form.chiTiets ?? []).map(l => ({
                        MASP:       Number(l.MASP),
                        SOLUONG:    Number(l.SOLUONG),
                        DONGIANHAP: Number(l.DONGIANHAP),
                        HANSUDUNG:  l.HANSUDUNG || undefined,
                    })),
                };
                if (isEdit) {
                    const res = await api.put(`/purchase-orders/${form.MAPHIEU}`, payload);
                    const updated = res?.data?.data ?? res?.data ?? res;
                    setList(prev => prev.map(x =>
                        x.MAPHIEU === form.MAPHIEU
                            ? { ...x, ...updated, TRANGTHAI: updated.TRANGTHAI ?? form.TRANGTHAI }
                            : x
                    ));
                } else {
                    const res = await api.post('/purchase-orders', payload);
                    const created = res?.data?.data ?? res?.data ?? res;
                    setList(prev => [created, ...prev]);
                }
                addToast('success', isEdit ? 'Cập nhật phiếu nhập thành công!' : 'Tạo phiếu nhập thành công!');
                close();
            }}
            renderForm={(form, hc, setForm, isView, formErrors, modalMode) => (
                <ImportForm
                    form={form}
                    hc={hc}
                    setForm={setForm}
                    isView={isView}
                    formErrors={formErrors}
                    suppliers={suppliers}
                    modalMode={modalMode}
                />
            )}
            modalSize="xl"
        />
    );
};
