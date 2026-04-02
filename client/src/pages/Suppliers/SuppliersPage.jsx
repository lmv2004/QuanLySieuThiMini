import React from 'react';
import { SimplePage } from '../../components/Manage/SimplePage';
import { Ico } from '../../components/Manage/Icons';
import { avatarColor } from '../../components/Manage/Shared';
import { SupplierForm, emptySupplier } from './SupplierForm';
import { SupplierActions } from './SupplierActions';
import { SupplierGridItem } from './SupplierGridItem';
import { SupplierImportExport } from './SupplierImportExport';

export const SuppliersPage = () => <SimplePage
    title="Nhà cung cấp" icon={Ico.truck} apiEndpoint="/suppliers" primaryKey="MANCC"
    subtitle={(l) => `${l.filter(x => !x.IS_DELETED).length} hợp tác · ${l.length} tổng`}
    emptyTitle="Chưa có nhà cung cấp" emptyDesc="Nhấn + Thêm để bắt đầu"
    cols={['Công ty', 'SĐT', 'Email', 'Địa chỉ', 'Trạng thái']}
    emptyForm={emptySupplier}
    tabs={[
        { id: 'all', label: 'Tất cả' },
        { id: 'active', label: 'Đang hợp tác', filter: (x) => !x.IS_DELETED },
        { id: 'inactive', label: 'Ngừng hợp tác', filter: (x) => x.IS_DELETED },
    ]}
    validate={(form) => {
        const errs = {};
        if (!form.TENNCC?.trim()) errs.TENNCC = 'Tên công ty là bắt buộc';
        else if (form.TENNCC.trim().length > 200) errs.TENNCC = 'Tên công ty không được vượt quá 200 ký tự';
        if (!form.SDT?.trim()) errs.SDT = 'Số điện thoại là bắt buộc';
        else if (!/^(0|\+84)[0-9]{8,10}$/.test(form.SDT.trim())) errs.SDT = 'Số điện thoại không hợp lệ (VD: 0281234567)';
        if (form.EMAIL && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.EMAIL)) errs.EMAIL = 'Email không đúng định dạng';
        return errs;
    }}
    renderToolbarActions={(fetchData, addToast, list) => (
        <SupplierImportExport onRefresh={fetchData} addToast={addToast} data={list} />
    )}
    renderRow={(n, i) => [
        <td key="1"><div className="cell-entity"><div className="entity-avatar" style={{ background: avatarColor(i) }}>{(n.TENNCC[0] || '?').toUpperCase()}</div><div className="entity-name">{n.TENNCC}</div></div></td>,
        <td key="2" style={{ fontFamily: 'var(--mono)', fontSize: 13 }}>{n.SDT}</td>,
        <td key="3" style={{ fontSize: 12.5 }}>{n.EMAIL}</td>,
        <td key="4" style={{ fontSize: 13 }}>{n.DIACHI}</td>,
        <td key="5"><span className={n.IS_DELETED ? 'badge badge-inactive' : 'badge badge-active'}>{n.IS_DELETED ? 'Ngừng' : 'Hoạt động'}</span></td>,
    ]}
    renderActions={(n, openEdit, del, i, list, setList, addToast, openView) => (
        <SupplierActions item={n} openEdit={openEdit} del={del} list={list} setList={setList} addToast={addToast} openView={openView} />
    )}
    renderGridItem={(n, openEdit, del, i, list, setList, addToast, openView) => (
        <SupplierGridItem item={n} openEdit={openEdit} del={del} idx={i} list={list} setList={setList} addToast={addToast} openView={openView} />
    )}
    renderForm={(form, hc, setForm, isView, formErrors) => (
        <SupplierForm form={form} hc={hc} setForm={setForm} formErrors={formErrors} />
    )}
/>;
