import React from 'react';
import { SimplePage } from '../../components/Manage/SimplePage';
import { Ico } from '../../components/Manage/Icons';
import { fmtDate, fmtVND } from '../../components/Manage/Shared';
import { VoucherForm, emptyVoucher } from './VoucherForm';
import { VoucherGridItem } from './VoucherGridItem';
import { VoucherActions } from './VoucherActions';
import { VoucherImportExport } from './VoucherImportExport';
import './Vouchers.css';

export const VouchersPage = () => {
    return (
        <SimplePage
            title="Voucher"
            icon={Ico.ticket}
            subtitle={(l) => `${l.filter(x => x.IS_AVAILABLE && x.TRANGTHAI === 1).length} đang hoạt động · ${l.length} tổng`}
            emptyTitle="Chưa có voucher"
            emptyDesc="Nhấn + Thêm để tạo voucher mới"
            cols={['Mã voucher', 'Loại giảm', 'Giá trị', 'Hạn dùng', 'Trạng thái']}
            apiEndpoint="/vouchers"
            primaryKey="SOVOUCHER"
            tabs={[
                { id: 'all', label: 'Tất cả' },
                { id: 'active', label: 'Đang hoạt động', filter: (x) => x.IS_AVAILABLE && x.TRANGTHAI === 1 },
                { id: 'locked', label: 'Đã khóa', filter: (x) => x.TRANGTHAI === 0 },
                { id: 'expired', label: 'Hết hạn', filter: (x) => !x.IS_AVAILABLE },
            ]}
            renderRow={(item) => [
                <td key="1"><span className="code-link">{item.MAVOUCHER}</span></td>,
                <td key="2"><span className="badge badge-info">{item.PTGIAM > 0 ? 'Phần trăm' : 'Số tiền'}</span></td>,
                <td key="3" className="price-main">{item.PTGIAM > 0 ? `${item.PTGIAM}%` : fmtVND(item.KMTOIDA)}</td>,
                <td key="4" style={{ color: 'var(--text-muted)' }}>{fmtDate(item.NGAYKT)}</td>,
                <td key="5">
                    <span className={item.TRANGTHAI === 0 ? 'badge badge-inactive' : (item.IS_AVAILABLE ? 'badge badge-active' : 'badge badge-warning')}>
                        {item.TRANGTHAI === 0 ? 'Bị khóa' : (item.IS_AVAILABLE ? 'Hoạt động' : 'Hết hạn')}
                    </span>
                </td>,
            ]}
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
            renderForm={(form, hc, setForm, readOnly) => <VoucherForm form={form} hc={hc} setForm={setForm} readOnly={readOnly} />}
        />
    );
};
