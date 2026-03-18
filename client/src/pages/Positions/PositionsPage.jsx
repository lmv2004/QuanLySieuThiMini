import React from 'react';
import { SimplePage } from '../../components/Manage/SimplePage';
import { Ico } from '../../components/Manage/Icons';
import { PositionForm, emptyPosition } from './PositionForm';
import { PositionActions } from './PositionActions';
import { PositionGridItem } from './PositionGridItem';
import { PositionImportExport } from './PositionImportExport';

export const PositionsPage = () => <SimplePage
    title="Chức vụ" icon={Ico.userCheck} apiPath="/chuc-vus"
    subtitle={(l) => `${l.filter(x => !x.IS_DELETED).length} hoạt động · ${l.length} tổng`}
    emptyTitle="Chưa có chức vụ" emptyDesc="Nhấn + Thêm để bắt đầu"
    cols={['#', 'Tên chức vụ', 'Lương cơ bản', 'Mô tả', 'Trạng thái', 'Hành động']}
    emptyForm={emptyPosition}
    tabs={[
        { id: 'all', label: 'Tất cả' },
        { id: 'active', label: 'Hoạt động', filter: (x) => !x.IS_DELETED },
        { id: 'inactive', label: 'Bị khóa', filter: (x) => x.IS_DELETED },
    ]}
    renderToolbarActions={(fetchData, addToast, list) => (
        <PositionImportExport onRefresh={fetchData} addToast={addToast} data={list} />
    )}
    renderRow={(cv, i) => [
        <td key="1" style={{ color: 'var(--text-muted)', fontFamily: 'var(--mono)', fontSize: 12 }}>{i + 1}</td>,
        <td key="2"><span className="entity-name">{cv.TENCHUCVU}</span></td>,
        <td key="3" style={{ fontFamily: 'var(--mono)' }}>{cv.LUONGCOBAN ? (Number(cv.LUONGCOBAN)).toLocaleString('vi-VN') + ' đ' : '0 đ'}</td>,
        <td key="4" style={{ color: 'var(--text-muted)', fontSize: 12.5 }}>{cv.MOTA || '—'}</td>,
        <td key="5"><span className={cv.IS_DELETED ? 'badge badge-inactive' : 'badge badge-role'}>{cv.IS_DELETED ? 'Bị khóa' : 'Hoạt động'}</span></td>,
    ]}
    renderActions={(item, openEdit, del, i, list, setList, addToast, openView) => (
        <PositionActions item={item} openEdit={openEdit} del={del} list={list} setList={setList} addToast={addToast} openView={openView} />
    )}
    renderGridItem={(item, openEdit, del, i, list, setList, addToast, openView) => (
        <PositionGridItem item={item} openEdit={openEdit} del={del} idx={i} list={list} setList={setList} addToast={addToast} openView={openView} />
    )}
    renderForm={(form, hc, setForm) => (
        <PositionForm form={form} hc={hc} setForm={setForm} />
    )}
/>;
