import React from 'react';
import { SimplePage } from '../../components/Manage/SimplePage';
import { Ico } from '../../components/Manage/Icons';
import { CategoryForm, emptyCategory } from './CategoryForm';
import { CategoryActions } from './CategoryActions';
import { CategoryGridItem } from './CategoryGridItem';
import { CategoryImportExport } from './CategoryImportExport';
import './CategoriesPage.css';

export const CategoriesPage = () => (
    <div className="categories-page">
        <SimplePage
            title="Loại sản phẩm" icon={Ico.tag} apiEndpoint="/categories"
            subtitle={(l) => `${l.filter(x => !x.IS_DELETED).length} hoạt động · ${l.length} tổng`}
            emptyTitle="Chưa có loại sản phẩm" emptyDesc="Nhấn + Thêm để bắt đầu"
            cols={['Mã', 'Tên loại', 'Mô tả']}
            emptyForm={emptyCategory}
            tabs={[
                { id: 'all', label: 'Tất cả' },
                { id: 'active', label: 'Hoạt động', filter: (x) => !x.IS_DELETED },
                { id: 'inactive', label: 'Bị khóa', filter: (x) => x.IS_DELETED },
            ]}
            renderToolbarActions={(fetchData, addToast, list) => (
                <CategoryImportExport onRefresh={fetchData} addToast={addToast} data={list} />
            )}
            renderRow={(l) => [
                <td key="1" style={{ color: 'var(--text-muted)', fontFamily: 'var(--mono)', fontSize: 12 }}>{l.MALOAI ?? '—'}</td>,
                <td key="2"><span className="badge badge-info">{l.TENLOAI}</span></td>,
                <td key="3" style={{ color: 'var(--text-muted)', fontSize: 12.5 }}>{l.MOTA || '—'}</td>,
            ]}
            renderActions={(item, openEdit, del, i, list, setList, addToast, openView) => (
                <CategoryActions item={item} openEdit={openEdit} del={del} list={list} setList={setList} addToast={addToast} openView={openView} />
            )}
            renderGridItem={(item, openEdit, del, i, list, setList, addToast, openView) => (
                <CategoryGridItem item={item} openEdit={openEdit} del={del} idx={i} list={list} setList={setList} addToast={addToast} openView={openView} />
            )}
            renderForm={(form, hc, setForm) => (
                <CategoryForm form={form} hc={hc} setForm={setForm} />
            )}
        />
    </div>
);
