import React from 'react';
import { SimplePage } from '../../components/Manage/SimplePage';
import { Ico } from '../../components/Manage/Icons';
import { avatarColor } from '../../components/Manage/Shared';
import { SupplierForm, emptySupplier } from './SupplierForm';
import { SupplierActions } from './SupplierActions';
import { SupplierGridItem } from './SupplierGridItem';
import { SupplierImportExport } from './SupplierImportExport';

export const SuppliersPage = () => <SimplePage
    title="Nhà cung cấp" icon={Ico.truck}
    subtitle={(l) => `${l.filter(x => !x.IS_DELETED).length} hợp tác · ${l.length} tổng`}
    emptyTitle="Chưa có nhà cung cấp" emptyDesc="Nhấn + Thêm để bắt đầu"
    cols={['Công ty', 'SĐT', 'Email', 'Địa chỉ', 'Trạng thái', 'Hành động']}
    emptyForm={emptySupplier}
    tabs={[
        { id: 'all', label: 'Tất cả' },
        { id: 'active', label: 'Đang hợp tác', filter: (x) => !x.IS_DELETED },
        { id: 'inactive', label: 'Ngừng hợp tác', filter: (x) => x.IS_DELETED },
    ]}
    renderToolbarActions={(fetchData, addToast, list) => (
        <SupplierImportExport onRefresh={fetchData} addToast={addToast} data={list} />
    )}
    renderRow={(n, i) => [
        <td key="1"><div className="cell-entity"><div className="entity-avatar" style={{ background: avatarColor(i) }}>{(n.TENNCC[0] || '?').toUpperCase()}</div><div className="entity-name">{n.TENNCC}</div></div></td>,
        <td key="2" style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>{n.SDT}</td>,
        <td key="3" style={{ color: 'var(--cyan)', fontSize: 12.5 }}>{n.EMAIL}</td>,
        <td key="4" style={{ color: 'var(--text-muted)', fontSize: 12 }}>{n.DIACHI}</td>,
        <td key="5"><span className={n.IS_DELETED ? 'badge badge-inactive' : 'badge badge-active'}>{n.IS_DELETED ? 'Ngừng' : 'Hoạt động'}</span></td>,
    ]}
    renderActions={(n, openEdit, del, i, list, setList, addToast, openView) => (
        <SupplierActions item={n} openEdit={openEdit} del={del} list={list} setList={setList} addToast={addToast} openView={openView} />
    )}
    renderGridItem={(n, openEdit, del, i, list, setList, addToast, openView) => (
        <SupplierGridItem item={n} openEdit={openEdit} del={del} idx={i} list={list} setList={setList} addToast={addToast} openView={openView} />
    )}
    renderForm={(form, hc, setForm) => (
        <SupplierForm form={form} hc={hc} setForm={setForm} />
    )}
/>;
