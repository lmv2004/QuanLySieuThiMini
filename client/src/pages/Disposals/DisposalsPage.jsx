import React from 'react';
import { SimplePage } from '../../components/Manage/SimplePage';
import { Ico } from '../../components/Manage/Icons';
import { fmtDate } from '../../components/Manage/Shared';
import { DisposalForm, emptyDisposal } from './DisposalForm';
import { DisposalActions } from './DisposalActions';
import { DisposalGridItem } from './DisposalGridItem';
import { DisposalImportExport } from './DisposalImportExport';
import './Disposals.css';

export const DisposalsPage = () => {
    return (
        <SimplePage
            title="Phiếu xuất hủy"
            icon={Ico.trash}
            subtitle={(l) => `${l.length} phiếu hủy`}
            emptyTitle="Chưa có phiếu hủy"
            emptyDesc="Nhấn + Tạo phiếu hủy để bắt đầu"
            // THÊM 'Trạng thái' VÀO ĐÂY ĐỂ KHỚP VỚI CỘT ICON
            cols={['Mã phiếu', 'Ngày lập', 'Nhân viên', 'Lý do', 'Trạng thái']}
            apiEndpoint="/disposal-slips"
            primaryKey="MAPHIEU"
            emptyForm={emptyDisposal}
            renderToolbarActions={(fetchData, addToast, list) => (
                <DisposalImportExport onRefresh={fetchData} addToast={addToast} data={list} />
            )}
            tabs={[{ id: 'all', label: 'Tất cả' }]}
            renderRow={(p) => [
                <td key="1"><span className="code-link">DSP-{String(p.MAPHIEU).slice(-3).padStart(3, '0')}</span></td>,
                <td key="2" style={{ color: 'var(--text-muted)' }}>{fmtDate(p.NGAYLAP)}</td>,
                <td key="3">{p.NHANVIEN?.TENNV || '—'}</td>,
                <td key="4" style={{ color: 'var(--text-muted)', fontSize: 12 }}>{p.LYDO || '—'}</td>,
            ]}
            renderActions={(item, openEdit, del, i, list, setList, addToast) => (
                <DisposalActions
                    item={item}
                    openEdit={openEdit}
                    del={del}
                    // TRUYỀN THÊM CÁC HÀM NÀY ĐỂ HIỆN ĐỦ ICON
                    openView={(p) => addToast?.(`Xem phiếu ${p.MAPHIEU}`, 'info')}
                    onLock={(p) => addToast?.(`Đã thay đổi trạng thái ${p.MAPHIEU}`, 'success')}
                    primaryKey="MAPHIEU"
                />
            )}
            renderGridItem={(item, openEdit, del, i, list, setList, addToast) => (
                <DisposalGridItem
                    item={item} openEdit={openEdit} del={del} idx={i}
                    list={list} setList={setList} addToast={addToast}
                />
            )}
            renderForm={(form, hc, setForm) => <DisposalForm form={form} hc={hc} setForm={setForm} />}
        />
    );
};