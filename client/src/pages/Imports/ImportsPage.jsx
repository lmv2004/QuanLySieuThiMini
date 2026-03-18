import React from 'react';
import { SimplePage } from '../../components/Manage/SimplePage';
import { Ico } from '../../components/Manage/Icons';
import { fmtDate, fmtVND } from '../../components/Manage/Shared';
import { ImportForm, emptyImport } from './ImportForm';
import { ImportActions } from './ImportActions';
import { ImportGridItem } from './ImportGridItem';
import { ImportImportExport } from './ImportImportExport';

export const ImportsPage = () => <SimplePage
    title="Phiếu nhập hàng" icon={Ico.file} apiPath="/phieu-nhaps"
    subtitle={(l) => `${l.filter(x => !x.IS_DELETED).length} hiệu lực · ${l.length} tổng`}
    emptyTitle="Chưa có phiếu nhập" emptyDesc="Nhấn + Tạo phiếu nhập để bắt đầu"
    cols={['Mã phiếu', 'Ngày lập', 'Tổng tiền', 'Trạng thái', 'Hành động']}
    emptyForm={emptyImport}
    tabs={[
        { id: 'all', label: 'Tất cả' },
        { id: 'active', label: 'Đang hiệu lực', filter: (x) => !x.IS_DELETED },
        { id: 'inactive', label: 'Đã hủy', filter: (x) => x.IS_DELETED },
    ]}
    renderToolbarActions={(fetchData, addToast, list) => (
        <ImportImportExport onRefresh={fetchData} addToast={addToast} data={list} />
    )}
    renderRow={(p, i) => [
        <td key="1"><span className="code-link">IMP-{String(p.MAPHIEU).slice(-3).padStart(3, '0')}</span></td>,
        <td key="2" style={{ color: 'var(--text-muted)' }}>{p.NGAYLAP ? fmtDate(p.NGAYLAP) : '—'}</td>,
        <td key="3" className="price-main">{fmtVND(p.TONGTIEN)}</td>,
        <td key="4"><span className={p.IS_DELETED ? 'badge badge-inactive' : 'badge badge-active'}>{p.IS_DELETED ? 'Đã hủy' : 'Hoạt động'}</span></td>,
    ]}
    renderActions={(item, openEdit, del, i, list, setList, addToast, openView) => (
        <ImportActions item={item} openEdit={openEdit} del={del} list={list} setList={setList} addToast={addToast} openView={openView} />
    )}
    renderGridItem={(item, openEdit, del, i, list, setList, addToast, openView) => (
        <ImportGridItem item={item} openEdit={openEdit} del={del} idx={i} list={list} setList={setList} addToast={addToast} openView={openView} />
    )}
    renderForm={(form, hc, setForm) => (
        <ImportForm form={form} hc={hc} setForm={setForm} />
    )}
/>;
