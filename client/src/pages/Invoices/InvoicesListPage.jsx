import React from 'react';
import { SimplePage } from '../../components/Manage/SimplePage';
import { Ico } from '../../components/Manage/Icons';
import { fmtDateTime, fmtVND } from '../../components/Manage/Shared';
import { InvoiceForm, emptyInvoice } from './InvoiceForm';
import { InvoiceActions } from './InvoiceActions';
import { InvoiceGridItem } from './InvoiceGridItem';
import { InvoiceImportExport } from './InvoiceImportExport';
import './InvoicesListPage.css';

const STATUS_LABEL = {
    0: { text: 'Chờ thanh toán', cls: 'badge badge-pending' },
    1: { text: 'Đã thanh toán', cls: 'badge badge-approved' },
};

const normalizePayload = (form) => ({
    NGAYHD: form.NGAYHD || null,
    HINHTHUC: form.HINHTHUC || 'Tiền mặt',
    TONGTIEN_HANG: Number(form.TONGTIEN_HANG || 0),
    TIEN_GIAM_VOUCHER: Number(form.TIEN_GIAM_VOUCHER || 0),
    TONG_THANHTOAN: Number(form.TONG_THANHTOAN || 0),
    TRANGTHAI: Number(form.TRANGTHAI || 0),
    MANV: form.MANV || null,
    MAKH: form.MAKH || null,
    SOVOUCHER: form.SOVOUCHER || null,
    items: (form.chiTiets || []).map(ct => ({
        MASP: ct.MASP,
        SOLUONG: Number(ct.SOLUONG || 0),
        GIABAN_THUCTE: Number(ct.GIABAN_THUCTE || 0),
    })),
});

const validateInvoice = (form) => {
    const errors = {};
    if (!form.NGAYHD) errors.NGAYHD = 'Vui lòng chọn ngày lập.';
    if (!form.MANV) errors.MANV = 'Vui lòng chọn nhân viên.';
    if (Number(form.TONGTIEN_HANG || 0) < 0) errors.TONGTIEN_HANG = 'Tổng tiền hàng không hợp lệ.';
    if (Number(form.TIEN_GIAM_VOUCHER || 0) < 0) errors.TIEN_GIAM_VOUCHER = 'Tiền giảm không hợp lệ.';
    if (Number(form.TONG_THANHTOAN || 0) < 0) errors.TONG_THANHTOAN = 'Tổng thanh toán không hợp lệ.';
    return errors;
};

export const InvoicesListPage = () => (
    <div className="invoices-list-page">
        <SimplePage
            title="Hóa đơn"
            icon={Ico.receipt}
            apiEndpoint="/invoices"
            primaryKey="MAHD"
            subtitle={(list) => `${list.filter((x) => !x.IS_DELETED).length} hóa đơn đang hiển thị`}
            emptyTitle="Chưa có hóa đơn"
            emptyDesc="Hóa đơn sẽ xuất hiện tại đây sau khi bán hàng"
            cols={['Mã HD', 'Ngày lập', 'Khách hàng', 'Thu ngân', 'Hình thức', 'Tổng thanh toán', 'Trạng thái']}
            emptyForm={emptyInvoice}
            validate={validateInvoice}
            transformBeforeSave={normalizePayload}
            hideAdd={true}
            tabs={[
                { id: 'all', label: 'Tất cả' },
                { id: 'pending', label: 'Chờ thanh toán', filter: (x) => Number(x.TRANGTHAI) === 0 && !x.IS_DELETED },
                { id: 'paid', label: 'Đã thanh toán', filter: (x) => Number(x.TRANGTHAI) === 1 && !x.IS_DELETED },
                { id: 'deleted', label: 'Đã xóa', filter: (x) => !!x.IS_DELETED },
            ]}
            renderToolbarActions={(fetchData, addToast, list) => (
                <InvoiceImportExport onRefresh={fetchData} addToast={addToast} data={list} />
            )}
            renderRow={(item) => {
                const status = STATUS_LABEL[Number(item.TRANGTHAI)] || { text: String(item.TRANGTHAI ?? '—'), cls: 'badge' };
                return [
                    <td key="mahd" className="inv-code">#{item.MAHD ?? '—'}</td>,
                    <td key="date" className="entity-sub">{fmtDateTime(item.NGAYHD)}</td>,
                    <td key="customer"><div className="entity-name invoice-customer-name">{item.khachHang?.TENKH || 'Khách lẻ'}</div></td>,
                    <td key="employee" className="entity-sub">{item.nhanVien?.TENNV || '—'}</td>,
                    <td key="method" className="entity-sub">{item.HINHTHUC || '—'}</td>,
                    <td key="total" className="price-main">{fmtVND(item.TONG_THANHTOAN || 0)}</td>,
                    <td key="status"><span className={status.cls}>{status.text}</span></td>,
                ];
            }}
            renderActions={(item, openEdit, del, i, list, setList, addToast, openView) => (
                <InvoiceActions
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
                <InvoiceGridItem
                    item={item}
                    openEdit={openEdit}
                    del={del}
                    idx={i}
                    list={list}
                    setList={setList}
                    addToast={addToast}
                    openView={openView}
                />
            )}
            renderForm={(form, hc, setForm, readOnly, errors, mode) => (
                <InvoiceForm
                    form={form}
                    hc={hc}
                    setForm={setForm}
                    readOnly={readOnly}
                    errors={errors}
                    mode={mode}
                />
            )}
        />
    </div>
);