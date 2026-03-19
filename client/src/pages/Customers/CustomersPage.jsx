import React from 'react';
import { SimplePage } from '../../components/Manage/SimplePage';
import { Ico } from '../../components/Manage/Icons';
import { avatarColor, initials } from '../../components/Manage/Shared';
import { CustomerForm, emptyCustomer } from './CustomerForm';
import { CustomerActions } from './CustomerActions';
import { CustomerGridItem } from './CustomerGridItem';
import { CustomerImportExport } from './CustomerImportExport';

export const CustomersPage = () => <SimplePage
    title="Khách hàng" icon={Ico.userGroup} apiEndpoint="/customers"
    subtitle={(l) => `${l.filter(x => !x.IS_DELETED).length} hoạt động · ${l.length} tổng`}
    emptyTitle="Chưa có khách hàng" emptyDesc="Dữ liệu khách hàng sẽ hiển thị ở đây"
    cols={['Khách hàng', 'Số điện thoại', 'Địa chỉ', 'Điểm thưởng', 'Trạng thái', 'Hành động']}
    emptyForm={emptyCustomer}
    tabs={[
        { id: 'all', label: 'Tất cả' },
        { id: 'active', label: 'Hoạt động', filter: (x) => !x.IS_DELETED },
        { id: 'vip', label: 'VIP (>1000đ)', filter: (x) => x.DIEMTHUONG >= 1000 },
        { id: 'inactive', label: 'Bị khóa', filter: (x) => x.IS_DELETED },
    ]}
    renderToolbarActions={(fetchData, addToast, list) => (
        <CustomerImportExport onRefresh={fetchData} addToast={addToast} data={list} />
    )}
    renderRow={(item, i) => [
        <td key="1"><div className="cell-entity"><div className="entity-avatar" style={{ background: avatarColor(i) }}>{initials(item.TENKH || 'KH')}</div><div className="entity-name">{item.TENKH}</div></div></td>,
        <td key="2" style={{ fontFamily: 'var(--mono)', fontSize: 13 }}>{item.SODIENTHOAI || '—'}</td>,
        <td key="3" style={{ fontSize: 13, maxWidth: 200, WebkitLineClamp: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.DIACHI || '—'}</td>,
        <td key="4"><span className="badge badge-info">{item.DIEMTHUONG || 0}</span></td>,
        <td key="5"><span className={item.IS_DELETED ? 'badge badge-inactive' : 'badge badge-active'}>{item.IS_DELETED ? 'Bị khóa' : 'Hoạt động'}</span></td>,
    ]}
    renderActions={(item, openEdit, del, i, list, setList, addToast, openView) => (
        <CustomerActions item={item} openEdit={openEdit} del={del} list={list} setList={setList} addToast={addToast} openView={openView} />
    )}
    renderGridItem={(item, openEdit, del, i, list, setList, addToast, openView) => (
        <CustomerGridItem item={item} openEdit={openEdit} del={del} idx={i} list={list} setList={setList} addToast={addToast} openView={openView} />
    )}
    renderForm={(form, hc, setForm) => (
        <CustomerForm form={form} hc={hc} setForm={setForm} />
    )}
/>;
