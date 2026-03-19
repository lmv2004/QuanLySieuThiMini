import React, { useState, useMemo, useEffect } from 'react';
import { Ico } from './Icons';
import { EmptyState } from './EmptyState';
import { Modal } from './Modal';
import api from '../../services/api';
import { Toast } from './Toast';
import { removeAccents } from './Shared';

export const SimplePage = ({ title, subtitle, icon, cols, emptyTitle, emptyDesc, renderRow, emptyForm, renderForm, validate, initialData = [], tabs, renderGridItem, renderActions, stats: statsProp, apiEndpoint, primaryKey = '_id', renderExtraActions, renderToolbarActions }) => {
    const [list, setList] = useState(initialData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [editId, setEditId] = useState(null);
    const [search, setSearch] = useState('');
    const [viewMode, setViewMode] = useState('table');
    const [activeTab, setActiveTab] = useState(tabs ? tabs[0].id : null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [toasts, setToasts] = useState([]);

    const addToast = (type, message) => {
        const id = Date.now();
        setToasts(p => [...p, { id, type, message }]);
    };

    const removeToast = (id) => setToasts(p => p.filter(x => x.id !== id));

    const fetchData = async () => {
        if (!apiEndpoint) return;
        setLoading(true);
        try {
            const res = await api.get(apiEndpoint);
            setList(res.data.data || res.data);
            setError(null);
        } catch (err) {
            console.error('Fetch error:', err);
            setError('Không thể tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (apiEndpoint) fetchData();
    }, [apiEndpoint]);

    const filtered = useMemo(() => {
        const term = removeAccents(search.toLowerCase());

        const checkValue = (val) => {
            if (val === null || val === undefined) return false;
            if (typeof val === 'object') {
                return Object.values(val).some(v => checkValue(v));
            }
            return removeAccents(String(val).toLowerCase()).includes(term);
        };

        let res = [...list].filter(x => checkValue(x));

        if (tabs && activeTab && activeTab !== 'all') {
            const currentTab = tabs.find(t => t.id === activeTab);
            if (currentTab?.filter) res = res.filter(currentTab.filter);
        }
        return res;
    }, [list, search, activeTab, tabs]);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, activeTab, itemsPerPage]);

    const paginated = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filtered.slice(start, start + itemsPerPage);
    }, [filtered, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filtered.length / itemsPerPage);

    const currentStats = useMemo(() => {
        if (!statsProp) return null;
        return typeof statsProp === 'function' ? statsProp(list) : statsProp;
    }, [list, statsProp]);

    const openAdd = () => { setForm(emptyForm); setModal('add'); };
    const openEdit = (item) => {
        setForm(Object.fromEntries(Object.keys(emptyForm).map(k => [k, item[k] ?? emptyForm[k]])));
        setEditId(item[primaryKey]);
        setModal('edit');
    };
    const openView = (item) => {
        setForm(Object.fromEntries(Object.keys(emptyForm).map(k => [k, item[k] ?? emptyForm[k]])));
        setModal('view');
    };
    const close = () => { setModal(null); setEditId(null); };
    const hc = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    };

    const save = async () => {
        if (validate) {
            const errs = validate(form);
            if (errs) { alert(errs); return; }
        }

        try {
            if (modal === 'add') {
                const res = await api.post(apiEndpoint, form);
                setList(p => [...p, res.data.data || res.data]);
            } else {
                const res = await api.put(`${apiEndpoint}/${editId}`, form);
                const updated = res.data.data || res.data;
                setList(p => p.map(x => x[primaryKey] === editId ? updated : x));
            }
            close();
            addToast('success', `${modal === 'add' ? 'Thêm' : 'Cập nhật'} thành công!`);
        } catch (err) {
            console.error('Save error:', err);
            addToast('error', 'Lỗi khi lưu dữ liệu');
        }
    };

    const del = (id) => {
        setEditId(id);
        setModal('delete');
    };

    const executeDelete = async () => {
        try {
            await api.delete(`${apiEndpoint}/${editId}`);
            setList(p => p.filter(x => x[primaryKey] !== editId));
            addToast('success', 'Đã xóa bản ghi thành công!');
        } catch (err) {
            console.error('Delete error:', err);
            addToast('error', 'Lỗi khi xóa dữ liệu');
        } finally {
            close();
        }
    };

    return (
        <div className="simple-page">
            <div className="toast-container">
                {toasts.map(t => <Toast key={t.id} type={t.type} message={t.message} onClose={() => removeToast(t.id)} />)}
            </div>
            <div className="page-header">
                <div className="page-title-block">
                    <h1 className="page-title">{title}</h1>
                    <p className="page-subtitle">{typeof subtitle === 'function' ? subtitle(list) : subtitle}</p>
                </div>
                <div className="page-actions">
                    {renderExtraActions && renderExtraActions(fetchData, addToast, list)}
                    <button className="btn-primary" onClick={openAdd}>
                        {Ico.plus} <span>Thêm mới</span>
                    </button>
                </div>
            </div>

            {currentStats && (
                <div className="kpi-grid">
                    {currentStats.map((s, i) => (
                        <div key={i} className="kpi-card">
                            <div className="kpi-top">
                                <div className="kpi-icon" style={{ background: s.color + '22', color: s.color }}>
                                    {Ico[s.icon] || Ico.layoutGrid}
                                </div>
                            </div>
                            <div className="kpi-info">
                                <div className="kpi-label">{s.label}</div>
                                <div className="kpi-value">{s.value}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="page-toolbar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="search-wrap">
                        <span className="search-icon">{Ico.search}</span>
                        <input className="search-input" placeholder="Tìm kiếm..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    {renderToolbarActions && renderToolbarActions(fetchData, addToast, list)}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className="table-count">{filtered.length} kết quả</span>
                    <select className="page-size-select" value={itemsPerPage} onChange={e => setItemsPerPage(Number(e.target.value))}>
                        <option value={5}>5 / trang</option>
                        <option value={10}>10 / trang</option>
                        <option value={20}>20 / trang</option>
                        <option value={50}>50 / trang</option>
                    </select>
                    <div className="view-switcher">
                        <button className={`view-btn ${viewMode === 'table' ? 'active' : ''}`} onClick={() => setViewMode('table')}>{Ico.layoutList}</button>
                        <button className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>{Ico.layoutGrid}</button>
                    </div>
                </div>
            </div>

            <div className="data-card">
                {tabs && (
                    <div className="tab-bar">
                        {tabs.map(tab => (
                            <button key={tab.id} className={`tab-item ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                )}

                <div className="page-content">
                    {viewMode === 'table' ? (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    {cols.map((c, i) => <th key={i}>{c}</th>)}
                                    {/* Chỉ thêm Hành động nếu cols chưa có và không rỗng */}
                                    {cols.length > 0 && !cols.some(c => c === 'Hành động') && <th style={{ width: 170, textAlign: 'center', padding: '10px 0' }}>HÀNH ĐỘNG</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 && <tr><td colSpan={cols.length + 1}><EmptyState icon={icon} title={emptyTitle} desc={emptyDesc} /></td></tr>}
                                {paginated.map((item, i) => (
                                    <tr key={item[primaryKey] || i}>
                                        {renderRow(item, i, list, setList)}
                                        <td className="actions-cell" style={{ width: 170 }}>
                                            {renderActions ? renderActions(item, openEdit, del, i, list, setList, addToast, openView) : (
                                                <>
                                                    <button className="btn-action-ico" title="Xem" onClick={() => openView(item)}>{Ico.eye}</button>
                                                    <button className="btn-action-ico btn-edit" title="Sửa" onClick={() => openEdit(item)}>{Ico.edit}</button>
                                                    <button className="btn-action-ico btn-del" title="Xóa" onClick={() => del(item[primaryKey])}>{Ico.trash}</button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="data-grid">
                            {filtered.length === 0 && <EmptyState icon={icon} title={emptyTitle} desc={emptyDesc} />}
                            {paginated.map((item, i) => renderGridItem ? renderGridItem(item, openEdit, del, i, list, setList, addToast, openView) : <div key={item[primaryKey] || i} className="grid-item-placeholder">Grid view content here</div>)}
                        </div>
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="pagination">
                        <button className="page-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>{Ico.chevronLeft}</button>
                        <div className="page-numbers">
                            {[...Array(totalPages)].map((_, idx) => {
                                const pNum = idx + 1;
                                // Simple logic for dots could be added here, but staying simple for now
                                return (
                                    <button key={pNum} className={`page-num ${currentPage === pNum ? 'active' : ''}`} onClick={() => setCurrentPage(pNum)}>
                                        {pNum}
                                    </button>
                                );
                            })}
                        </div>
                        <button className="page-btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} style={{ transform: 'rotate(180deg)' }}>{Ico.chevronLeft}</button>
                    </div>
                )}
            </div>

            {modal && modal !== 'delete' && (
                <Modal title={modal === 'add' ? `Thêm ${title.toLowerCase()}` : modal === 'view' ? 'Chi tiết' : `Chỉnh sửa`} onClose={close} actions={<><button className="btn-secondary" onClick={close}>{modal === 'view' ? 'Đóng' : 'Hủy'}</button>{modal !== 'view' && <button className="btn-primary" onClick={save}>{modal === 'add' ? 'Thêm' : 'Lưu'}</button>}</>}>
                    {renderForm(form, hc, setForm, modal === 'view')}
                </Modal>
            )}

            {modal === 'delete' && (
                <Modal
                    title="Xác nhận xóa"
                    onClose={close}
                    actions={
                        <>
                            <button className="btn-secondary" onClick={close}>Hủy bỏ</button>
                            <button className="btn-primary" style={{ background: '#dc3545', borderColor: '#dc3545' }} onClick={executeDelete}>Xóa dữ liệu</button>
                        </>
                    }
                >
                    <div style={{ padding: '20px 0', textAlign: 'center' }}>
                        <div style={{ color: '#dc3545', marginBottom: '16px' }}>
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                        </div>
                        <h3 style={{ fontSize: '18px', color: 'var(--text-main)', marginBottom: '8px' }}>Bạn có chắc chắn muốn xóa bản ghi này?</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.5' }}>Hành động này không thể hoàn tác.<br />Dữ liệu sẽ bị xóa vĩnh viễn khỏi hệ thống.</p>
                    </div>
                </Modal>
            )}
        </div>
    );
};


