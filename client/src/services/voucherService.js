import api from './api';

export const voucherService = {
    fetchVouchers: async () => {
        const res = await api.get('/vouchers');
        return res.data.data || res.data;
    },

    createVoucher: async (data) => {
        const res = await api.post('/vouchers', data);
        return res.data.data || res.data;
    },

    updateVoucher: async (id, data) => {
        const res = await api.put(`/vouchers/${id}`, data);
        return res.data.data || res.data;
    },

    deleteVoucher: async (id) => {
        await api.delete(`/vouchers/${id}`);
    },

    toggleLock: async (item) => {
        const newStatus = item.TRANGTHAI === 1 ? 0 : 1;
        const res = await api.put(`/vouchers/${item.SOVOUCHER}`, { ...item, TRANGTHAI: newStatus });
        return res.data.data || res.data || res;
    },

    importBulk: async (data) => {
        const res = await api.post('/vouchers/bulk', { items: data });
        return res.data.data || res.data;
    }
};
