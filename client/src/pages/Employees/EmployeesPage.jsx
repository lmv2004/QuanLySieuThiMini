import React from 'react';
import { SimplePage } from '../../components/Manage/SimplePage';
import { Ico } from '../../components/Manage/Icons';
import { avatarColor, roleBadge, initials } from '../../components/Manage/Shared';
import { EmployeeForm, emptyEmployee } from './EmployeeForm';
import { EmployeeActions } from './EmployeeActions';
import { EmployeeGridItem } from './EmployeeGridItem';
import { EmployeeImportExport } from './EmployeeImportExport';

export const EmployeesPage = () => <SimplePage
    title="Nhân viên" icon={Ico.users} apiEndpoint="/employees" primaryKey="MANV"
    subtitle={(l) => `${l.filter(x => !x.IS_DELETED).length} hoạt động · ${l.length} tổng`}
    emptyTitle="Chưa có nhân viên" emptyDesc="Nhấn + Thêm để bắt đầu"
    cols={['Nhân viên', 'Số điện thoại', 'Vai trò', 'Trạng thái']}
    emptyForm={emptyEmployee}
    tabs={[
        { id: 'all', label: 'Tất cả' },
        { id: 'active', label: 'Đang hoạt động', filter: (x) => !x.IS_DELETED },
        { id: 'manager', label: 'Quản lý', filter: (x) => x.chucVu?.MACHUCVU === 1 },
        { id: 'cashier', label: 'Thu ngân', filter: (x) => x.chucVu?.MACHUCVU === 2 },
        { id: 'warehouse', label: 'Thủ kho', filter: (x) => x.chucVu?.MACHUCVU === 3 },
        { id: 'inactive', label: 'Đã nghỉ', filter: (x) => x.IS_DELETED },
    ]}
    validate={(form) => {
        const errs = {};
        if (!form.TENNV?.trim()) errs.TENNV = 'Họ tên nhân viên là bắt buộc';
        else if (form.TENNV.trim().length > 200) errs.TENNV = 'Họ tên không được vượt quá 200 ký tự';
        if (!form.SODIENTHOAI?.trim()) errs.SODIENTHOAI = 'Số điện thoại là bắt buộc';
        else if (!/^(0|\+84)[0-9]{8,10}$/.test(form.SODIENTHOAI.trim())) errs.SODIENTHOAI = 'Số điện thoại không hợp lệ (VD: 0901234567)';
        if (form.EMAIL && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.EMAIL)) errs.EMAIL = 'Email không đúng định dạng';
        if (!form.MACHUCVU) errs.MACHUCVU = 'Vui lòng chọn chức vụ';
        return errs;
    }}
    renderToolbarActions={(fetchData, addToast, list) => (
        <EmployeeImportExport onRefresh={fetchData} addToast={addToast} data={list} />
    )}
    renderRow={(nv, i) => [
        <td key="1"><div className="cell-entity"><div className="entity-avatar" style={{ background: avatarColor(i) }}>{initials(nv.TENNV)}</div><div className="entity-name">{nv.TENNV}</div></div></td>,
        <td key="2" style={{ fontFamily: 'var(--mono)', fontSize: 13 }}>{nv.SODIENTHOAI}</td>,
        <td key="3"><span className={roleBadge(nv.chucVu?.TENCHUCVU || '')}>{nv.chucVu?.TENCHUCVU || '—'}</span></td>,
        <td key="4"><span className={nv.IS_DELETED ? 'badge badge-inactive' : 'badge badge-active'}>{nv.IS_DELETED ? 'Ngừng' : 'Hoạt động'}</span></td>,
    ]}
    renderActions={(item, openEdit, del, i, list, setList, addToast, openView) => (
        <EmployeeActions item={item} openEdit={openEdit} del={del} list={list} setList={setList} addToast={addToast} openView={openView} />
    )}
    renderGridItem={(item, openEdit, del, i, list, setList, addToast, openView) => (
        <EmployeeGridItem item={item} openEdit={openEdit} del={del} idx={i} list={list} setList={setList} addToast={addToast} openView={openView} />
    )}
    renderForm={(form, hc, setForm, isView, formErrors) => (
        <EmployeeForm form={form} hc={hc} setForm={setForm} formErrors={formErrors} />
    )}
/>;
