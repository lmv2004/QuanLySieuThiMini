import React from 'react';
import { SimplePage } from '../../components/Manage/SimplePage';
import { Ico } from '../../components/Manage/Icons';
import { fmtDate, fmtVND } from '../../components/Manage/Shared';
import { PromotionForm, emptyPromotion, validatePromotion } from './PromotionForm';
import { PromotionGridItem } from './PromotionGridItem';
import { PromotionActions } from './PromotionActions';
import { PromotionImportExport } from './PromotionImportExport';
import api from '../../services/api';
import './Promotions.css';

const PromotionStatusBadge = ({ item }) => {
    const now = new Date();
    const start = new Date(item.NGAYBD);
    const end = new Date(item.NGAYKT);
    const isFuture = start > now;
    const isExpired = end < now;
    const isLocked = !item.TRANGTHAI;

    const status = isLocked ? { t: 'Tạm dừng', c: 'badge-inactive' }
        : (isExpired ? { t: 'Hết hạn', c: 'badge-warning' }
            : (isFuture ? { t: 'Sắp diễn ra', c: 'badge-info' } : { t: 'Đang chạy', c: 'badge-active' }));

    return <span className={`badge ${status.c}`}>{status.t}</span>;
};

export const PromotionsPage = () => {
    // Hàm gộp nhóm dữ liệu
    const groupPromotions = (list) => {
        const groups = {};
        list.forEach(item => {
            const masp = item.MASP || item.SANPHAM?.MASP;
            // Key gộp nhóm dựa trên các thuộc tính chung
            const key = `${item.TEN_CHUONG_TRINH}_${item.LOAI_GIAM}_${item.GIATRI_GIAM}_${item.NGAYBD}_${item.NGAYKT}`;
            if (!groups[key]) {
                groups[key] = { ...item, _items: [item], MASP: masp ? [masp] : [] };
            } else {
                groups[key]._items.push(item);
                if (masp && !groups[key].MASP.includes(masp)) {
                    groups[key].MASP.push(masp);
                }
            }
        });
        return Object.values(groups);
    };

    return (
        <SimplePage
            title="Khuyến mãi sản phẩm"
            subtitle={(l) => `Hiện có ${l.length} chương trình`}
            icon={Ico.percent}
            apiEndpoint="/discounts"
            primaryKey="ID"
            cols={['Tên KM', 'Phạm vi', 'Giảm giá', 'Thời gian', 'Trạng thái']}
            emptyForm={emptyPromotion}
            validate={validatePromotion}
            transformList={groupPromotions}
            renderToolbarActions={(fetchData, addToast, list) => (
                <PromotionImportExport onRefresh={fetchData} addToast={addToast} data={list} />
            )}
            tabs={[
                { id: 'all', label: 'Tất cả' },
                {
                    id: 'active', label: 'Đang chạy', filter: (x) => {
                        const now = new Date();
                        const isLocked = !x.TRANGTHAI;
                        const isExpired = new Date(x.NGAYKT) < now;
                        const isFuture = new Date(x.NGAYBD) > now;
                        return !isLocked && !isExpired && !isFuture;
                    }
                },
                {
                    id: 'future', label: 'Sắp diễn ra', filter: (x) => {
                        const now = new Date();
                        const isLocked = !x.TRANGTHAI;
                        const isFuture = new Date(x.NGAYBD) > now;
                        return !isLocked && isFuture;
                    }
                },
                { id: 'locked', label: 'Tạm dừng', filter: (x) => !x.TRANGTHAI },
                {
                    id: 'expired', label: 'Hết hạn', filter: (x) => {
                        const now = new Date();
                        const isLocked = !x.TRANGTHAI;
                        const isExpired = new Date(x.NGAYKT) < now;
                        return !isLocked && isExpired;
                    }
                },
            ]}
            renderRow={(item) => {
                const count = item._items?.length || 1;
                return [
                    <td key="1"><div className="fw-700">{item.TEN_CHUONG_TRINH}</div></td>,
                    <td key="2">
                        <div className="badge badge-info" style={{ fontSize: '11px' }}>
                            {count} sản phẩm
                        </div>
                    </td>,
                    <td key="3">
                        <div className={`discount-val ${item.LOAI_GIAM === 0 ? 'pct' : 'amt'}`}>
                            {item.LOAI_GIAM === 0 ? `${item.GIATRI_GIAM}%` : fmtVND(item.GIATRI_GIAM)}
                        </div>
                    </td>,
                    <td key="4">
                        <div className="text-muted" style={{ fontSize: '12px' }}>
                            {fmtDate(item.NGAYBD)} - {fmtDate(item.NGAYKT)}
                        </div>
                    </td>,
                    <td key="5"><PromotionStatusBadge item={item} /></td>
                ];
            }}
            renderActions={(item, openEdit, del, i, list, setList, addToast, openView) => (
                <PromotionActions
                    item={item}
                    openEdit={openEdit}
                    del={async (id) => {
                        // Xóa nhóm thông minh
                        if (item._items && item._items.length > 1) {
                            if (window.confirm(`Xóa toàn bộ ${item._items.length} bản ghi của chương trình này?`)) {
                                try {
                                    for (const sub of item._items) await api.delete(`/discounts/${sub.ID}`);
                                    setList(prev => prev.filter(x => !item._items.some(si => si.ID === x.ID)));
                                    addToast('success', 'Đã xóa nhóm chương trình');
                                } catch (e) { addToast('error', 'Lỗi khi xóa'); }
                            }
                        } else { del(id); }
                    }}
                    list={list} setList={setList} addToast={addToast} openView={openView}
                />
            )}
            renderGridItem={(item, openEdit, del, idx, list, setList, addToast, openView) => (
                <PromotionGridItem
                    item={item}
                    openEdit={openEdit}
                    del={async (id) => {
                        if (item._items && item._items.length > 1) {
                            if (window.confirm(`Xóa toàn bộ ${item._items.length} sản phẩm thuộc nhóm này?`)) {
                                try {
                                    for (const sub of item._items) await api.delete(`/discounts/${sub.ID}`);
                                    setList(prev => prev.filter(x => !item._items.some(si => si.ID === x.ID)));
                                    addToast('success', 'Đã xóa toàn bộ nhóm');
                                } catch (e) { addToast('error', 'Lỗi khi xóa'); }
                            }
                        } else { del(id); }
                    }}
                    list={list} setList={setList} addToast={addToast} openView={openView}
                />
            )}
            renderForm={(form, hc, setForm, readOnly, errors) => (
                <PromotionForm form={form} hc={hc} setForm={setForm} readOnly={readOnly} errors={errors} />
            )}
            customSave={async (form, isEdit, setList, addToast, onSuccess) => {
                try {
                    const cleanForm = {
                        ...form,
                        LOAI_GIAM: parseInt(form.LOAI_GIAM),
                        GIATRI_GIAM: parseFloat(form.GIATRI_GIAM),
                        TRANGTHAI: form.TRANGTHAI ? 1 : 0
                    };

                    if (!isEdit) {
                        const masps = Array.isArray(form.MASP) ? form.MASP : [form.MASP];
                        const payloadData = masps.map(masp => ({ ...cleanForm, MASP: parseInt(masp) }));
                        const res = await api.post('/discounts/bulk', { data: payloadData });
                        addToast('success', res.message || `Đã tạo ${payloadData.length} khuyến mãi`);
                        const resList = await api.get('/discounts');
                        setList((resList.data || resList).sort((a, b) => b.ID - a.ID));
                        onSuccess();
                        return;
                    }

                    if (isEdit) {
                        const itemsToUpdate = (form._items && form._items.length > 0) ? form._items : [form];
                        const newMasps = (Array.isArray(form.MASP) ? form.MASP : [form.MASP]).map(m => parseInt(m));

                        // 1. Xóa các bản ghi cho những sản phẩm đã bị bỏ chọn trong nhóm
                        for (const item of itemsToUpdate) {
                            const currentMasp = parseInt(item.MASP || item.SANPHAM?.MASP);
                            if (!newMasps.includes(currentMasp)) {
                                await api.delete(`/discounts/${parseInt(item.ID)}`);
                            }
                        }

                        // 2. Cập nhật hoặc tạo mới các bản ghi dựa trên danh sách sản phẩm mới
                        for (const masp of newMasps) {
                            const existing = itemsToUpdate.find(it => parseInt(it.MASP || it.SANPHAM?.MASP) === masp);
                            const payload = {
                                TEN_CHUONG_TRINH: form.TEN_CHUONG_TRINH,
                                LOAI_GIAM: parseInt(form.LOAI_GIAM),
                                GIATRI_GIAM: parseFloat(form.GIATRI_GIAM),
                                NGAYBD: form.NGAYBD,
                                NGAYKT: form.NGAYKT,
                                TRANGTHAI: form.TRANGTHAI ? 1 : 0,
                                MASP: masp
                            };

                            if (existing) {
                                await api.put(`/discounts/${parseInt(existing.ID)}`, payload);
                            } else {
                                await api.post('/discounts', payload);
                            }
                        }

                        addToast('success', `Đã cập nhật nhóm chương trình`);
                        const resList = await api.get('/discounts');
                        setList((resList.data || resList).sort((a, b) => b.ID - a.ID));
                        onSuccess();
                    }
                } catch (error) {
                    addToast('error', error.message || 'Lỗi khi lưu');
                }
            }}
        />
    );
};
