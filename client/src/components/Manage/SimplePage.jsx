import React, { useState, useMemo } from 'react';
import { Ico } from './Icons';
import { EmptyState } from './EmptyState';
import { Modal } from './Modal';

export const SimplePage = ({ title, subtitle, icon, cols, emptyTitle, emptyDesc, renderRow, emptyForm, renderForm, validate, initialData = [], tabs, renderGridItem, renderActions, stats: statsProp }) => {
    const [list, setList] = useState(initialData);
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [editId, setEditId] = useState(null);
    const [search, setSearch] = useState('');
    const [viewMode, setViewMode] = useState('table');
    const [activeTab, setActiveTab] = useState(tabs ? tabs[0].id : null);

    const filtered = useMemo(() => {
        let res = [...list].filter(x => Object.values(x).some(v => String(v).toLowerCase().includes(search.toLowerCase())));
        if (tabs && activeTab && activeTab !== 'all') {
            const currentTab = tabs.find(t => t.id === activeTab);
            if (currentTab?.filter) res = res.filter(currentTab.filter);
        }
        return res;
    }, [list, search, activeTab, tabs]);

    const currentStats = useMemo(() => {
        if (!statsProp) return null;
        return typeof statsProp === 'function' ? statsProp(list) : statsProp;
    }, [list, statsProp]);

    const openAdd = () => { setForm(emptyForm); setModal('add'); };
    const openEdit = (item) => { setForm(Object.fromEntries(Object.keys(emptyForm).map(k => [k, item[k] ?? emptyForm[k]]))); setEditId(item._id); setModal('edit'); };
    const close = () => { setModal(null); setEditId(null); };
    const hc = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    const save = () => {
        if (modal === 'add') setList(p => [...p, { ...form, _id: Date.now() }]);
        else setList(p => p.map(x => x._id === editId ? { ...x, ...form } : x));
        close();
    };
    const del = (id) => { if (window.confirm('Xóa?')) setList(p => p.filter(x => x._id !== id)); };

    return (
        <div className="simple-page">
            <div className="page-header">
                <div className="page-title-block">
                    <h1 className="page-title">{title}</h1>
                    <p className="page-subtitle">{typeof subtitle === 'function' ? subtitle(list) : subtitle}</p>
                </div>
                <div className="page-actions">
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
                <div className="search-wrap">
                    <span className="search-icon">{Ico.search}</span>
                    <input className="search-input" placeholder="Tìm kiếm..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className="table-count">{filtered.length} kết quả</span>
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
                            <thead><tr>{cols.map((c, i) => <th key={i}>{c}</th>)}<th style={{ width: 80 }}></th></tr></thead>
                            <tbody>
                                {filtered.length === 0 && <tr><td colSpan={cols.length + 1}><EmptyState icon={icon} title={emptyTitle} desc={emptyDesc} /></td></tr>}
                                {filtered.map((item, i) => (
                                    <tr key={item._id}>
                                        {renderRow(item, i, list, setList)}
                                        <td>
                                            <div className="actions-cell">
                                                {renderActions ? renderActions(item, openEdit, del, i, list, setList) : (
                                                    <>
                                                        <button className="btn-action-ico btn-edit" title="Sửa" onClick={() => openEdit(item)}>{Ico.edit}</button>
                                                        <button className="btn-action-ico btn-del" title="Xóa" onClick={() => del(item._id)}>{Ico.trash}</button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="data-grid">
                            {filtered.length === 0 && <EmptyState icon={icon} title={emptyTitle} desc={emptyDesc} />}
                            {filtered.map((item, i) => renderGridItem ? renderGridItem(item, openEdit, del, i, list, setList) : <div key={item._id} className="grid-item-placeholder">Grid view content here</div>)}
                        </div>
                    )}
                </div>
            </div>

            {modal && (
                <Modal title={modal === 'add' ? `Thêm ${title.toLowerCase()}` : `Chỉnh sửa`} onClose={close} actions={<><button className="btn-secondary" onClick={close}>Hủy</button><button className="btn-primary" onClick={save}>{modal === 'add' ? 'Thêm' : 'Lưu'}</button></>}>
                    {renderForm(form, hc, setForm)}
                </Modal>
            )}
        </div>
    );
};
