import api from './api';

// Lấy tất cả permissions (grouped theo module)
export const getPermissions = () => api.get('/permissions');

// Lấy permissions đang được gán cho 1 chức vụ
export const getRolePermissions = (positionId) =>
    api.get(`/positions/${positionId}/permissions`);

// Sync (đồng bộ) danh sách quyền cho 1 chức vụ
export const syncRolePermissions = (positionId, permissionIds) =>
    api.put(`/positions/${positionId}/permissions`, { permission_ids: permissionIds });
