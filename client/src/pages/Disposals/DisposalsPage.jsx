import React from 'react';
import { SimplePage } from '../../components/Manage/SimplePage';
import { Ico } from '../../components/Manage/Icons';
import { fmtDate } from '../../components/Manage/Shared';
import { DisposalForm } from './DisposalForm';
import { DisposalActions } from './DisposalActions';
import { DisposalGridItem } from './DisposalGridItem';
import { DisposalImportExport } from './DisposalImportExport';
import { disposalService } from '../../services/disposalService';
import './Disposals.css';

export const emptyDisposal = {
    NGAYLAP: new Date().toISOString().slice(0, 16),
    LYDO: '',
    MANV: '',
    chiTiets: [],
    CHI_TIETS: [], 
    NHANVIEN: null
};

export const DisposalsPage = () => {
    return (
        <SimplePage
            title="Phiếu xuất hủy hàng hóa"
            icon={Ico.trash}
            subtitle={(l) => `Hệ thống có ${l.length} phiếu tiêu hủy`}
            emptyTitle="Chưa có dữ liệu phiếu hủy"
            emptyDesc="Nhấp vào nút + Tạo phiếu hủy để bắt đầu quản lý hàng lỗi/hỏng."
            cols={['Mã phiếu', 'Ngày lập', 'Nhân viên thực hiện', 'Lý do & Ghi chú', 'Trạng thái']}
            apiEndpoint="/disposal-slips"
            primaryKey="MAPHIEU"
            emptyForm={emptyDisposal}
            transformBeforeSave={(f) => ({
                ...f,
                chi_tiet_phieu_huys: f.chiTiets || []
            })}
            renderToolbarActions={(fetchData, addToast, list) => (
                <DisposalImportExport onRefresh={fetchData} addToast={addToast} data={list} />
            )}
            tabs={[
                { id: 'all', label: 'Tất cả phiếu' },
                { id: 'PENDING', label: 'Chờ duyệt', filter: (x) => x.TRANGTHAI === 'PENDING' || !x.TRANGTHAI },
                { id: 'APPROVED', label: 'Đã duyệt', filter: (x) => x.TRANGTHAI === 'APPROVED' }
            ]}

            renderRow={(p) => {
                const status = p.TRANGTHAI || 'PENDING';
                const statusLabel = status === 'APPROVED' ? 'Đã duyệt' : status === 'CANCELLED' ? 'Đã hủy' : 'Chờ duyệt';
                const statusClass = `badge-${status.toLowerCase()}`;

                return [
                    <td key="1"><span className="disposal-id-badge">DSP-{String(p.MAPHIEU).padStart(3, '0')}</span></td>,
                    <td key="2" style={{ color: 'var(--text-muted)', fontSize: 13 }}>{fmtDate(p.NGAYLAP)}</td>,
                    <td key="3" style={{ fontWeight: 600 }}>{p.NHANVIEN?.TENNV || '—'}</td>,
                    <td key="4" style={{ color: 'var(--text-muted)', fontSize: 12, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.LYDO || '—'}
                    </td>,
                    <td key="5"><span className={`badge ${statusClass}`}>{statusLabel}</span></td>
                ];
            }}
            renderActions={(item, openEdit, del, i, list, setList, addToast, openView) => {
                return (
                    <DisposalActions
                        item={item}
                        openEdit={item.TRANGTHAI !== 'APPROVED' ? openEdit : null}
                        del={item.TRANGTHAI !== 'APPROVED' ? del : null}
                        openView={() => openView(item)}
                        list={list}
                        setList={setList}
                        addToast={addToast}
                        primaryKey="MAPHIEU"
                    />
                );
            }}
            renderGridItem={(item, openEdit, del, i, list, setList, addToast, openView) => (
                <DisposalGridItem
                    item={item}
                    openEdit={item.TRANGTHAI !== 'APPROVED' ? openEdit : null}
                    del={item.TRANGTHAI !== 'APPROVED' ? del : null}
                    idx={i}
                    list={list}
                    setList={setList}
                    addToast={addToast}
                    openView={() => openView(item)}
                />
            )}
            renderForm={(form, hc, setForm, isView, errors) => (
                <DisposalForm form={form} hc={hc} setForm={setForm} isView={isView} errors={errors} />
            )}
            validate={(form) => {
                const errors = {};
                if (!form.MANV) errors.MANV = 'Vui lòng chọn nhân viên';
                if (!form.LYDO || form.LYDO.trim().length < 5) errors.LYDO = 'Vui lòng nhập lý do cụ thể (ít nhất 5 ký tự)';
                if (!form.NGAYLAP) errors.NGAYLAP = 'Vui lòng chọn ngày lập';

                const details = form.chiTiets || [];
                if (details.length === 0) {
                    errors._global = 'Vui lòng thêm ít nhất một lô hàng';
                } else {
                    // Kiểm tra trùng lặp lô hàng
                    const idSet = new Set();
                    const duplicateIds = [];
                    details.forEach((d, idx) => {
                        if (d.ID_TONKHO) {
                            if (idSet.has(d.ID_TONKHO)) duplicateIds.push(idx + 1);
                            else idSet.add(d.ID_TONKHO);
                        }
                    });

                    if (duplicateIds.length > 0) {
                        errors._global = `Lỗi: Lô hàng tại dòng ${duplicateIds.join(', ')} bị trùng lặp. Vui lòng gộp chung hoặc chọn lô khác.`;
                        return errors;
                    }

                    const firstInvalid = details.findIndex(d => !d.ID_TONKHO || !d.SOLUONG || d.SOLUONG <= 0);
                    if (firstInvalid !== -1) {
                        const d = details[firstInvalid];
                        if (!d.ID_TONKHO) errors._global = `Hàng số ${firstInvalid + 1}: Chưa chọn lô hàng`;
                        else errors._global = `Hàng số ${firstInvalid + 1}: Số lượng phải lớn hơn 0`;
                    }
                }
                return errors;
            }}
            modalClassName="modal-xl"
        />
    );
};