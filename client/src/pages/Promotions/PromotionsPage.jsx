import React from 'react';
import { SimplePage } from '../../components/Manage/SimplePage';
import { Ico } from '../../components/Manage/Icons';
import { fmtDate, fmtVND } from '../../components/Manage/Shared';
import { PromotionForm, emptyPromotion } from './PromotionForm';
import { PromotionGridItem } from './PromotionGridItem';
import { PromotionActions } from './PromotionActions';
import { PromotionImportExport } from './PromotionImportExport';
import api from '../../services/api';
import './Promotions.css';

export const PromotionsPage = () => <SimplePage
    title="Khuyến mãi / Giảm giá" icon={Ico.percent}
    subtitle={(l) => `${l.length} chương trình`}
    emptyTitle="Chưa có khuyến mãi" emptyDesc="Nhấn + Thêm để tạo chương trình KM"
    cols={['Tên KM', 'Giảm giá', 'Từ ngày', 'Đến ngày', 'Trạng thái']}
    apiEndpoint="/discounts"
    primaryKey="ID"
    emptyForm={emptyPromotion}
    renderToolbarActions={(fetchData, addToast, list) => (
        <PromotionImportExport onRefresh={fetchData} addToast={addToast} data={list} />
    )}
    tabs={[
        { id: 'all', label: 'Tất cả' },
        { id: 'active', label: 'Đang chạy', filter: (x) => x.TRANGTHAI },
        { id: 'finished', label: 'Kết thúc', filter: (x) => !x.TRANGTHAI },
    ]}
    renderRow={(item) => [
        <td key="1"><span className="entity-name">{item.TEN_CHUONG_TRINH}</span></td>,
        <td key="2"><span className="badge badge-info">{item.LOAI_GIAM === 0 ? `${item.GIATRI_GIAM}%` : fmtVND(item.GIATRI_GIAM)}</span></td>,
        <td key="3" style={{ color: 'var(--text-muted)', fontSize: 12 }}>{fmtDate(item.NGAYBD)}</td>,
        <td key="4" style={{ color: 'var(--text-muted)', fontSize: 12 }}>{fmtDate(item.NGAYKT)}</td>,
        <td key="5"><span className={item.TRANGTHAI ? 'badge badge-active' : 'badge badge-inactive'}>{item.TRANGTHAI ? 'Đang chạy' : 'Kết thúc'}</span></td>,
    ]}
    renderActions={(item, openEdit, del, i, list, setList, addToast, openView) => (
        <PromotionActions item={item} openEdit={openEdit} del={del} list={list} setList={setList} addToast={addToast} openView={openView} />
    )}
    renderGridItem={(item, openEdit, del, idx) => (
        <PromotionGridItem item={item} openEdit={openEdit} del={del} idx={idx} />
    )}
    renderForm={(form, hc, setForm) => (
        <PromotionForm form={form} hc={hc} setForm={setForm} />
    )}
    customSave={async (form, isEdit, setList, addToast, onSuccess) => {
        try {
            // Logic Thêm Mới với Chọn Nhiều Sản Phẩm (Multiple Selection)
            if (!isEdit && Array.isArray(form.MASP) && form.MASP.length > 0) {
                const payloadData = form.MASP.map(masp => ({
                    ...form,
                    MASP: masp
                }));

                // Gọi Bulk import API
                const res = await api.post('/discounts/bulk', { data: payloadData });
                addToast('success', res.data.message || `Đã tạo ${payloadData.length} Khuyến mãi thành công!`);

                // Do Backend xử lý bulk trả về message, gọi get List lại để load
                const freshList = await api.get('/discounts');
                setList(freshList.data.data || freshList.data);
                onSuccess();
                return;
            }

            // Logic Update (Sửa 1 Phiếu) hoặc Insert 1 Phiếu bình thường
            let singleMasp = form.MASP;
            if (Array.isArray(form.MASP)) singleMasp = form.MASP[0]; // Ràng buộc phòng hờ form đẩy mảng

            const singleData = { ...form, MASP: singleMasp };

            if (isEdit) {
                const res = await api.put(`/discounts/${form.ID}`, singleData);
                setList(prev => prev.map(x => x.ID === form.ID ? res.data.data || res.data : x));
                addToast('success', 'Cập nhật khuyến mãi thành công');
            } else {
                const res = await api.post('/discounts', singleData);
                setList(prev => [res.data.data || res.data, ...prev]);
                addToast('success', 'Thêm mới khuyến mãi thành công');
            }
            onSuccess();

        } catch (error) {
            console.error('Lỗi lưu Khuyến Mãi:', error);
            addToast('error', error.response?.data?.message || 'Có lỗi xảy ra khi lưu dữ liệu');
        }
    }}
/>;


