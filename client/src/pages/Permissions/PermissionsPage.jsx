import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { getPermissions, getRolePermissions, syncRolePermissions } from '../../services/permissionService';

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
        <div style={{
            position: 'fixed', top: 20, right: 20, zIndex: 9999,
            background: type === 'success' ? '#10b981' : '#ef4444',
            color: '#fff', borderRadius: 10, padding: '12px 20px',
            fontWeight: 600, boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            display: 'flex', gap: 10, alignItems: 'center', minWidth: 260,
        }}>
            <span>{type === 'success' ? '✓' : '✗'}</span>
            <span>{message}</span>
            <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 16 }}>×</button>
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
        <div className="simple-page">
            {toast && <Toast key={toast.id} type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

            {/* Header */}
            <div className="page-header">
                <div className="page-title-block">
                    <h1 className="page-title">🔐 Phân quyền chức vụ</h1>
                    <p className="page-subtitle">
                        {selectedRole
                            ? `Đang chỉnh quyền: ${selectedRole.TENCHUCVU} · ${checkedIds.size} quyền được cấp`
                            : 'Chọn một chức vụ ở bên trái để quản lý quyền hạn'}
                    </p>
                </div>
                {selectedRole && (
                    <div className="page-actions">
                        <button className="btn-secondary" onClick={() => { setCheckedIds(new Set(originalIds)); }}>Hoàn tác</button>
                        <button
                            className="btn-primary"
                            onClick={handleSave}
                            disabled={saving || !isDirty}
                            style={{ opacity: (!isDirty || saving) ? 0.6 : 1 }}
                        >
                            {saving ? 'Đang lưu...' : '💾 Lưu thay đổi'}
                        </button>
                    </div>
                )}
            </div>

            {/* Main layout */}
            <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>

                {/* ─── Left panel: Role list ─── */}
                <div style={{
                    width: 250, flexShrink: 0,
                    background: 'var(--surface)', borderRadius: 14,
                    border: '1px solid var(--border)', overflow: 'hidden',
                }}>
                    <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', fontWeight: 700, fontSize: 13, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                        CHỨC VỤ ({roles.length})
                    </div>
                    {roles.map(role => {
                        const isSelected = selectedRole?.MACHUCVU === role.MACHUCVU;
                        return (
                            <button
                                key={role.MACHUCVU}
                                onClick={() => loadRolePerms(role)}
                                style={{
                                    width: '100%', textAlign: 'left', padding: '13px 18px',
                                    background: isSelected ? 'var(--primary)' : 'transparent',
                                    color: isSelected ? '#fff' : 'var(--text-main)',
                                    border: 'none', cursor: 'pointer',
                                    borderBottom: '1px solid var(--border)',
                                    transition: 'all .15s', display: 'flex', flexDirection: 'column', gap: 3,
                                }}
                                onMouseEnter={e => !isSelected && (e.currentTarget.style.background = 'var(--surface-hover)')}
                                onMouseLeave={e => !isSelected && (e.currentTarget.style.background = 'transparent')}
                            >
                                <span style={{ fontWeight: 600, fontSize: 14 }}>{role.TENCHUCVU}</span>
                                <span style={{ fontSize: 11, opacity: 0.7 }}>#{role.MACHUCVU}</span>
                            </button>
                        );
                    })}
                </div>

                {/* ─── Right panel: Permissions matrix ─── */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    {!selectedRole ? (
                        <div style={{
                            background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border)',
                            padding: '60px 40px', textAlign: 'center', color: 'var(--text-muted)',
                        }}>
                            <div style={{ fontSize: 52, marginBottom: 16 }}>🔐</div>
                            <div style={{ fontSize: 18, fontWeight: 600 }}>Chọn chức vụ để quản lý quyền</div>
                            <div style={{ fontSize: 14, marginTop: 6 }}>Danh sách chức vụ ở bên trái</div>
                        </div>
                    ) : loading ? (
                        <div style={{ background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border)', padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
                            Đang tải...
                        </div>
                    ) : (
                        <div style={{ background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden' }}>
                            {/* Toolbar */}
                            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
                                    <input
                                        type="checkbox"
                                        checked={allChecked}
                                        onChange={handleSelectAll}
                                        style={{ width: 16, height: 16, accentColor: 'var(--primary)', cursor: 'pointer' }}
                                    />
                                    {allChecked ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                                </label>
                                <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                                    {checkedIds.size} / {allPermIds.length} quyền được chọn
                                </span>
                                {isDirty && (
                                    <span style={{ marginLeft: 'auto', background: '#f59e0b22', color: '#d97706', borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 600 }}>
                                        ⚠ Chưa lưu
                                    </span>
                                )}
                            </div>

                            {/* Permission groups */}
                            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
                                {allPermGroups.map(group => {
                                    const groupIds = group.permissions.map(p => p.MAPERMISSION);
                                    const checkedCount = groupIds.filter(id => checkedIds.has(id)).length;
                                    const allGroupChecked = checkedCount === groupIds.length;
                                    const someChecked = checkedCount > 0 && !allGroupChecked;

                                    return (
                                        <div key={group.module} style={{
                                            border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden',
                                        }}>
                                            {/* Module header */}
                                            <div style={{
                                                background: 'var(--surface-hover)', padding: '12px 16px',
                                                display: 'flex', alignItems: 'center', gap: 10,
                                                borderBottom: '1px solid var(--border)',
                                            }}>
                                                <input
                                                    type="checkbox"
                                                    checked={allGroupChecked}
                                                    ref={el => { if (el) el.indeterminate = someChecked; }}
                                                    onChange={() => toggleModule(group)}
                                                    style={{ width: 16, height: 16, accentColor: 'var(--primary)', cursor: 'pointer' }}
                                                />
                                                <span style={{ fontWeight: 700, fontSize: 14 }}>
                                                    {MODULE_LABELS[group.module] || group.module}
                                                </span>
                                                <span style={{
                                                    marginLeft: 'auto', fontSize: 11, fontWeight: 600,
                                                    color: allGroupChecked ? 'var(--primary)' : 'var(--text-muted)',
                                                    background: allGroupChecked ? 'var(--primary-light, #6366f122)' : 'var(--surface)',
                                                    padding: '2px 10px', borderRadius: 20,
                                                }}>
                                                    {checkedCount} / {groupIds.length}
                                                </span>
                                            </div>

                                            {/* Permission items */}
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
                                                {group.permissions.map((perm, idx) => {
                                                    const isChecked = checkedIds.has(perm.MAPERMISSION);
                                                    return (
                                                        <label
                                                            key={perm.MAPERMISSION}
                                                            style={{
                                                                display: 'flex', alignItems: 'flex-start', gap: 10,
                                                                padding: '12px 16px', cursor: 'pointer',
                                                                background: isChecked ? 'var(--primary-light, #6366f108)' : 'transparent',
                                                                borderTop: idx >= 1 ? '1px solid var(--border)' : 'none',
                                                                transition: 'background .15s',
                                                            }}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={isChecked}
                                                                onChange={() => togglePerm(perm.MAPERMISSION)}
                                                                style={{ marginTop: 2, width: 15, height: 15, accentColor: 'var(--primary)', cursor: 'pointer', flexShrink: 0 }}
                                                            />
                                                            <div>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                                    <span style={{ fontSize: 14 }}>{ACTION_ICONS[perm.ACTION] || '🔑'}</span>
                                                                    <span style={{ fontWeight: 600, fontSize: 13, color: isChecked ? 'var(--primary)' : 'var(--text-main)' }}>
                                                                        {perm.NAME}
                                                                    </span>
                                                                </div>
                                                                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, fontFamily: 'var(--mono)' }}>
                                                                    {perm.CODE}
                                                                </div>
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
                </div>
            </div>
        </div>
    );
};
