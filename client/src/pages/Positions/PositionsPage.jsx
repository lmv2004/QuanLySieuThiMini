import React from 'react';
import { SimplePage } from '../../components/Manage/SimplePage';
import { Ico } from '../../components/Manage/Icons';
import { PositionForm, emptyPosition } from './PositionForm';
import { PositionActions } from './PositionActions';
import { PositionGridItem } from './PositionGridItem';

export const PositionsPage = () => <SimplePage
    title="Chức vụ" icon={Ico.userCheck} apiEndpoint="/positions"
    primaryKey="MACHUCVU"
    subtitle={(l) => `${l.length} chức vụ`}
    emptyTitle="Chưa có chức vụ" emptyDesc="Nhấn + Thêm để bắt đầu"
    cols={['Mã CV', 'Tên chức vụ', 'Mô tả', 'Ngày tạo']}
    emptyForm={emptyPosition}
    tabs={[
        { id: 'all', label: 'Tất cả' },
    ]}
    renderRow={(cv, i) => [
        <td key="1" style={{ color: 'var(--text-muted)', fontFamily: 'var(--mono)', fontSize: 12 }}>{cv.MACHUCVU}</td>,
        <td key="2"><span className="entity-name">{cv.TENCHUCVU}</span></td>,
        <td key="3" style={{ color: 'var(--text-muted)', fontSize: 12.5 }}>{cv.MOTA || '—'}</td>,
        <td key="4" style={{ color: 'var(--text-muted)', fontSize: 12, fontFamily: 'var(--mono)' }}>
            {cv.created_at ? new Date(cv.created_at).toLocaleDateString('vi-VN') : '—'}
        </td>,
    ]}
    renderActions={(item, openEdit, del, i, list, setList, addToast, openView) => (
        <PositionActions item={item} openEdit={openEdit} del={del} openView={openView} />
    )}
    renderGridItem={(item, openEdit, del, i, list, setList, addToast, openView) => (
        <PositionGridItem item={item} openEdit={openEdit} del={del} idx={i} list={list} setList={setList} addToast={addToast} openView={openView} />
    )}
    renderForm={(form, hc, setForm, readOnly) => (
        <PositionForm form={form} hc={hc} setForm={setForm} readOnly={readOnly} />
    )}
/>;
