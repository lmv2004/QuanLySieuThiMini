import api from './api';

export const disposalService = {
    getAll: async () => {
        const response = await api.get('/disposal-slips');
        return response.data;
    },
    
    create: async (data) => {
        const response = await api.post('/disposal-slips', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/disposal-slips/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/disposal-slips/${id}`);
        return response.data;
    },

    // Duyệt Phiếu Xuất Hủy
    approve: async (id) => {
        const response = await api.put(`/disposal-slips/${id}`, { TRANGTHAI: 'APPROVED' });
        return response.data;
    },

    importBulk: async (dataArray) => {
        const response = await api.post('/disposal-slips/bulk', { data: dataArray });
        return response.data;
    }
};
