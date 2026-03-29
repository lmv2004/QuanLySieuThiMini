import React from 'react';
import { SimplePage } from '../../components/Manage/SimplePage';
import { Ico } from '../../components/Manage/Icons';
import { fmtDate, fmtVND } from '../../components/Manage/Shared';
import { VoucherForm, emptyVoucher, validateVoucher } from './VoucherForm';
import { VoucherGridItem } from './VoucherGridItem';
import { VoucherActions } from './VoucherActions';
import { VoucherImportExport } from './VoucherImportExport';
import './Vouchers.css';

export const VouchersPage = () => {
    return (
        <SimplePage
            title="Voucher"
            icon={Ico.ticket}
            subtitle={(l) => {
                const now = new Date();
                const activeCount = l.filter(x => x.IS_AVAILABLE && x.TRANGTHAI === 1 && new Date(x.NGAYBD) <= now).length;
                return `${activeCount} đang hoạt động · ${l.length} tổng`;
            }}
            emptyTitle="Chưa có voucher"
            emptyDesc="Nhấn + Thêm để tạo voucher mới"
            cols={['Mã voucher', 'Loại giảm', 'Giá trị', 'Hạn dùng', 'Trạng thái']}
            apiEndpoint="/vouchers"
            primaryKey="SOVOUCHER"
            validate={validateVoucher}
            tabs={[
                { id: 'all', label: 'Tất cả' },
                { id: 'active', label: 'Đang hoạt động', filter: (x) => x.TRANGTHAI !== 0 && x.IS_AVAILABLE && new Date(x.NGAYBD) <= new Date() },
                { id: 'future', label: 'Chưa phát hành', filter: (x) => x.TRANGTHAI !== 0 && new Date(x.NGAYBD) > new Date() },
                { id: 'locked', label: 'Đã khóa', filter: (x) => x.TRANGTHAI === 0 },
                { id: 'expired', label: 'Hết hạn', filter: (x) => x.TRANGTHAI !== 0 && !x.IS_AVAILABLE && new Date(x.NGAYBD) <= new Date() },
            ]}
            renderRow={(item) => {
                const now = new Date();
                const isFuture = new Date(item.NGAYBD) > now;
                const status = item.TRANGTHAI === 0 ? { t: 'Bị khóa', c: 'badge-inactive' } 
                             : (isFuture ? { t: 'Chưa phát hành', c: 'badge-info' } 
                             : (item.IS_AVAILABLE ? { t: 'Hoạt động', c: 'badge-active' } : { t: 'Hết hạn', c: 'badge-warning' }));
                
                return [
                    <td key="1" style={{ fontFamily: 'var(--mono)', fontSize: 13 }}>{item.MAVOUCHER}</td>,
                    <td key="2"><span className="badge badge-info">{Number(item.PTGIAM || 0) > 0 ? 'Phần trăm' : 'Số tiền'}</span></td>,
                    <td key="3" className="price-main">{Number(item.PTGIAM || 0) > 0 ? `${item.PTGIAM}%` : fmtVND(item.KMTOIDA)}</td>,
                    <td key="4" style={{ fontSize: 13 }}>{fmtDate(item.NGAYKT)}</td>,
                    <td key="5">
                        <span className={`badge ${status.c}`}>{status.t}</span>
                    </td>,
                ];
            }}
            renderActions={(item, openEdit, del, idx, list, setList, addToast, openView) => (
                <VoucherActions
                    item={item} openEdit={openEdit} del={del}
                    list={list} setList={setList} addToast={addToast} openView={openView}
                />
            )}
            renderGridItem={(item, openEdit, del, idx, list, setList, addToast, openView) => (
                <VoucherGridItem
                    item={item} openEdit={openEdit} del={del}
                    list={list} setList={setList} addToast={addToast} openView={openView}
                />
            )}
            renderToolbarActions={(fetchData, addToast, list) => (
                <VoucherImportExport onRefresh={fetchData} addToast={addToast} data={list} />
            )}
            emptyForm={emptyVoucher}
            renderForm={(form, hc, setForm, readOnly, errors) => (
                <VoucherForm form={form} hc={hc} setForm={setForm} readOnly={readOnly} errors={errors} />
            )}
            modalSize="xl"
        />
    );
};
