import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { getPermissions, getRolePermissions, syncRolePermissions } from '../../services/permissionService';
import './PermissionsPage.css';

// ─── Module label mapping ──────────────────────────────────────────────────
const MODULE_LABELS = {
    employees:       'Nhân viên',
    suppliers:       'Nhà cung cấp',
    products:        'Sản phẩm',
    categories:      'Loại sản phẩm',
    inventories:     'Tồn kho',
    invoices:        'Hóa đơn',
    'purchase-orders': 'Phiếu nhập',
    'disposal-slips':  'Phiếu hủy',
    vouchers:        'Voucher',
    discounts:       'Khuyến mại',
    customers:       'Khách hàng',
    accounts:        'Tài khoản',
    positions:       'Chức vụ',
    reports:         'Báo cáo',
};

const ACTION_ICONS = {
    view: '👁',
    create: '➕',
    edit: '✏️',
    delete: '🗑',
    manage: '⚙️',
    approve: '✅',
    payment: '💳',
    export: '📤',
};

// ─── Toast ─────────────────────────────────────────────────────────────────
const Toast = ({ type, message, onClose }) => {
    useEffect(() => {
        const t = setTimeout(onClose, 3000);
        return () => clearTimeout(t);
    }, [onClose]);
    return (
        <div className={`perm-toast perm-toast-${type}`}>
            <span className="perm-toast-icon">{type === 'success' ? '✓' : '✗'}</span>
            <span className="perm-toast-text">{message}</span>
            <button className="perm-toast-close" onClick={onClose} aria-label="Đóng">×</button>
        </div>
    );
};

// ─── Main Page ─────────────────────────────────────────────────────────────
export const PermissionsPage = () => {
    const [roles, setRoles] = useState([]);
    const [allPermGroups, setAllPermGroups] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    const [checkedIds, setCheckedIds] = useState(new Set());
    const [originalIds, setOriginalIds] = useState(new Set());
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (type, message) => setToast({ type, message, id: Date.now() });

    // Load roles + permissions
    useEffect(() => {
        const init = async () => {
            setLoading(true);
            try {
                const [rolesRes, permsRes] = await Promise.all([
                    api.get('/positions'),
                    getPermissions(),
                ]);
                const roleList = rolesRes.data || rolesRes;
                setRoles(Array.isArray(roleList) ? roleList : []);
                setAllPermGroups(permsRes.data || []);
            } catch {
                showToast('error', 'Không thể tải dữ liệu');
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    // Load permissions of selected role
    const loadRolePerms = useCallback(async (role) => {
        setSelectedRole(role);
        setLoading(true);
        try {
            const res = await getRolePermissions(role.MACHUCVU);
            const ids = new Set(res.data?.permission_ids || []);
            setCheckedIds(ids);
            setOriginalIds(ids);
        } catch {
            showToast('error', 'Không thể tải quyền của chức vụ');
        } finally {
            setLoading(false);
        }
    }, []);

    const togglePerm = (id) => {
        setCheckedIds(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const toggleModule = (group) => {
        const ids = group.permissions.map(p => p.MAPERMISSION);
        const allChecked = ids.every(id => checkedIds.has(id));
        setCheckedIds(prev => {
            const next = new Set(prev);
            ids.forEach(id => allChecked ? next.delete(id) : next.add(id));
            return next;
        });
    };

    const handleSelectAll = () => {
        const all = allPermGroups.flatMap(g => g.permissions.map(p => p.MAPERMISSION));
        const allChecked = all.every(id => checkedIds.has(id));
        setCheckedIds(allChecked ? new Set() : new Set(all));
    };

    const handleSave = async () => {
        if (!selectedRole) return;
        setSaving(true);
        try {
            await syncRolePermissions(selectedRole.MACHUCVU, [...checkedIds]);
            setOriginalIds(new Set(checkedIds));
            showToast('success', `Đã lưu ${checkedIds.size} quyền cho "${selectedRole.TENCHUCVU}"`);
        } catch {
            showToast('error', 'Lỗi khi lưu phân quyền');
        } finally {
            setSaving(false);
        }
    };

    const isDirty = selectedRole && JSON.stringify([...checkedIds].sort()) !== JSON.stringify([...originalIds].sort());
    const allPermIds = allPermGroups.flatMap(g => g.permissions.map(p => p.MAPERMISSION));
    const allChecked = allPermIds.length > 0 && allPermIds.every(id => checkedIds.has(id));

    return (
        <div className="simple-page permissions-page">
            {toast && <Toast key={toast.id} type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

            <div className="page-header perm-header">
                <div className="page-title-block">
                    <h1 className="page-title">Phân quyền chức vụ</h1>
                    <p className="page-subtitle">
                        {selectedRole
                            ? `Đang chỉnh quyền: ${selectedRole.TENCHUCVU} · ${checkedIds.size} quyền được cấp`
                            : 'Chọn một chức vụ ở bên trái để quản lý quyền hạn'}
                    </p>
                </div>
                {selectedRole && (
                    <div className="page-actions perm-actions">
                        <button className="btn-secondary" onClick={() => { setCheckedIds(new Set(originalIds)); }}>
                            Hoàn tác
                        </button>
                        <button
                            className="btn-primary"
                            onClick={handleSave}
                            disabled={saving || !isDirty}
                            style={{ opacity: (!isDirty || saving) ? 0.6 : 1 }}
                        >
                            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                    </div>
                )}
            </div>

            <div className="perm-layout">
                <aside className="role-panel">
                    <div className="role-panel-header">
                        CHUC VU <span>{roles.length}</span>
                    </div>
                    <div className="role-panel-body">
                        {roles.map(role => {
                            const isSelected = selectedRole?.MACHUCVU === role.MACHUCVU;
                            return (
                                <button
                                    key={role.MACHUCVU}
                                    onClick={() => loadRolePerms(role)}
                                    className={`role-item ${isSelected ? 'is-selected' : ''}`}
                                >
                                    <span className="role-title">{role.TENCHUCVU}</span>
                                    <span className="role-meta">#{role.MACHUCVU}</span>
                                </button>
                            );
                        })}
                    </div>
                </aside>

                <section className="perm-main">
                    {!selectedRole ? (
                        <div className="perm-empty">
                            <div className="perm-empty-icon">🔐</div>
                            <div className="perm-empty-title">Chọn chức vụ để quản lý quyền</div>
                            <div className="perm-empty-text">Danh sách chức vụ ở bên trái</div>
                        </div>
                    ) : loading ? (
                        <div className="perm-loading">Đang tải...</div>
                    ) : (
                        <div className="perm-panel">
                            <div className="perm-toolbar">
                                <label className="perm-toolbar-check">
                                    <input
                                        type="checkbox"
                                        checked={allChecked}
                                        onChange={handleSelectAll}
                                        className="perm-checkbox"
                                    />
                                    <span>{allChecked ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}</span>
                                </label>
                                <span className="perm-toolbar-count">
                                    {checkedIds.size} / {allPermIds.length} quyền được chọn
                                </span>
                                {isDirty && (
                                    <span className="perm-dirty">Chưa lưu</span>
                                )}
                            </div>

                            <div className="perm-groups">
                                {allPermGroups.map((group, gi) => {
                                    const groupIds = group.permissions.map(p => p.MAPERMISSION);
                                    const checkedCount = groupIds.filter(id => checkedIds.has(id)).length;
                                    const allGroupChecked = checkedCount === groupIds.length;
                                    const someChecked = checkedCount > 0 && !allGroupChecked;

                                    return (
                                        <div key={group.module} className="perm-group" style={{ '--i': gi }}>
                                            <div className="perm-group-header">
                                                <label className="perm-group-check">
                                                    <input
                                                        type="checkbox"
                                                        checked={allGroupChecked}
                                                        ref={el => { if (el) el.indeterminate = someChecked; }}
                                                        onChange={() => toggleModule(group)}
                                                        className="perm-checkbox"
                                                    />
                                                </label>
                                                <div className="perm-group-title">
                                                    {MODULE_LABELS[group.module] || group.module}
                                                </div>
                                                <span className={`perm-group-count ${allGroupChecked ? 'is-full' : ''}`}>
                                                    {checkedCount} / {groupIds.length}
                                                </span>
                                            </div>

                                            <div className="perm-group-grid">
                                                {group.permissions.map((perm) => {
                                                    const isChecked = checkedIds.has(perm.MAPERMISSION);
                                                    return (
                                                        <label
                                                            key={perm.MAPERMISSION}
                                                            className={`perm-item ${isChecked ? 'is-checked' : ''}`}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={isChecked}
                                                                onChange={() => togglePerm(perm.MAPERMISSION)}
                                                                className="perm-checkbox"
                                                            />
                                                            <div className="perm-item-body">
                                                                <div className="perm-item-title">
                                                                    <span className="perm-item-icon">{ACTION_ICONS[perm.ACTION] || '🔑'}</span>
                                                                    <span>{perm.NAME}</span>
                                                                </div>
                                                                <div className="perm-item-code">{perm.CODE}</div>
                                                            </div>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};
