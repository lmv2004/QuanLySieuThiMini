import React from 'react';
import { SimplePage } from '../../components/Manage/SimplePage';
import { Ico } from '../../components/Manage/Icons';
import { fmtDate, fmtVND, STATUS_MAP } from '../../components/Manage/Shared';
import { InvoiceForm, emptyInvoice } from './InvoiceForm';
import { InvoiceActions } from './InvoiceActions';
import { InvoiceGridItem } from './InvoiceGridItem';
import { InvoiceImportExport } from './InvoiceImportExport';

export const InvoicesPage = () => <SimplePage
    title="Hóa đơn / Bán hàng" icon={Ico.receipt} apiEndpoint="/invoices"
    subtitle={(l) => `${l.length} hóa đơn`}
    emptyTitle="Chưa có hóa đơn" emptyDesc="Dữ liệu hóa đơn sẽ hiển thị ở đây"
    cols={['Mã HD', 'Ngày', 'Khách hàng', 'Tổng tiền', 'Trạng thái', 'Hành động']}
    emptyForm={emptyInvoice}
    tabs={[
        { id: 'all', label: 'Tất cả' },
        { id: 'completed', label: 'Đã hoàn thành', filter: (x) => x.TRANGTHAI === 'COMPLETED' },
        { id: 'pending', label: 'Chờ xử lý', filter: (x) => x.TRANGTHAI === 'PENDING' },
        { id: 'cancelled', label: 'Đã hủy', filter: (x) => x.TRANGTHAI === 'CANCELLED' },
    ]}
    renderToolbarActions={(fetchData, addToast, list) => (
        <InvoiceImportExport onRefresh={fetchData} addToast={addToast} data={list} />
    )}
    renderRow={(item) => [
        <td key="1"><span className="code-link">{item.MAHD || `HD-${String(item._id).slice(-4)}`}</span></td>,
        <td key="2" style={{ color: 'var(--text-muted)' }}>{fmtDate(item.NGAY)}</td>,
        <td key="3">{item.KHACHHANG || '—'}</td>,
        <td key="4" className="price-main">{item.TONGTIEN ? fmtVND(item.TONGTIEN) : '—'}</td>,
        <td key="5"><span className={(STATUS_MAP[item.TRANGTHAI] || { cls: 'badge' }).cls}>{(STATUS_MAP[item.TRANGTHAI] || { label: item.TRANGTHAI }).label}</span></td>,
    ]}
    renderActions={(item, openEdit, del, i, list, setList, addToast, openView) => (
        <InvoiceActions item={item} openEdit={openEdit} del={del} list={list} setList={setList} addToast={addToast} openView={openView} />
    )}
    renderGridItem={(item, openEdit, del, i, list, setList, addToast, openView) => (
        <InvoiceGridItem item={item} openEdit={openEdit} del={del} idx={i} list={list} setList={setList} addToast={addToast} openView={openView} />
    )}
    renderForm={(form, hc, setForm) => (
        <InvoiceForm form={form} hc={hc} setForm={setForm} />
    )}
/>;
