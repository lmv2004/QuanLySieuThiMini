export const fmtVND = (v) => Number(v).toLocaleString('vi-VN') + ' ₫';
export const fmtInputNumber = (v) => {
    if (v === null || v === undefined || v === '') return '';
    const n = String(v).replace(/\D/g, '');
    return n ? Number(n).toLocaleString('vi-VN') : '';
};
export const parseInputNumber = (v) => String(v).replace(/\D/g, '');
export const fmtDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '—';
export const totalStock = (t = []) => t.reduce((s, x) => s + (x.IS_ACTIVE !== false ? (x.SOLUONG_CON_LAI || 0) : 0), 0);
export const earliestHSD = (t = []) => { const a = t.filter(x => x.IS_ACTIVE !== false && x.HANSUDUNG); return a.length ? a.sort((a, b) => new Date(a.HANSUDUNG) - new Date(b.HANSUDUNG))[0].HANSUDUNG : null; };
export const latestGiaNhap = (t = []) => { const a = t.filter(x => x.GIANHAP); return a.length ? a[a.length - 1].GIANHAP : null; };
export const initials = (name = '') => { const p = name.trim().split(' '); return p.length === 1 ? p[0].slice(0, 2).toUpperCase() : (p[0][0] + p[p.length - 1][0]).toUpperCase(); };
export const avatarColor = (i) => ['linear-gradient(135deg,#6366f1,#4f46e5)', 'linear-gradient(135deg,#0891b2,#0e7490)', 'linear-gradient(135deg,#d97706,#b45309)', 'linear-gradient(135deg,#16a34a,#15803d)', 'linear-gradient(135deg,#dc2626,#b91c1c)', 'linear-gradient(135deg,#7c3aed,#6d28d9)', 'linear-gradient(135deg,#0d9488,#0f766e)'][i % 7];
export const catStyle = (i) => [{ color: '#6d28d9', bg: '#ede9fe' }, { color: '#0369a1', bg: '#e0f2fe' }, { color: '#92400e', bg: '#fef3c7' }, { color: '#065f46', bg: '#d1fae5' }, { color: '#9d174d', bg: '#fce7f3' }][i % 5];
export const roleBadge = (ten = '') => ten.toLowerCase().includes('quản') ? 'badge badge-role' : ten.toLowerCase().includes('thu') ? 'badge badge-role-cashier' : 'badge badge-role-warehouse';
export const STOCK_MAX = 300;
export const STATUS_MAP = {
    APPROVED: { label: 'Đã duyệt', cls: 'badge badge-approved' },
    PENDING: { label: 'Chờ duyệt', cls: 'badge badge-pending' },
    CANCELLED: { label: 'Đã hủy', cls: 'badge badge-inactive' },
};

export const CURRENT_USER = {
    MANV: 1, TENNV: 'Nguyễn Minh Khoa', EMAIL: 'khoa.nm@minimart.vn',
    chucVu: { MACHUCVU: 1, TENCHUCVU: 'Quản lý hệ thống' },
};

export const removeAccents = (str) => {
    if (!str) return '';
    return str.normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/đ/g, 'd')
              .replace(/Đ/g, 'D');
};
