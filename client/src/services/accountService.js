import api from './api';

export const accountService = {
    getAll: async () => {
        const response = await api.get('/accounts');
        return response.data;
    },
    
    create: async (data) => {
        const response = await api.post('/accounts', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/accounts/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/accounts/${id}`);
        return response.data;
    },

    toggleLock: async (id, currentStatus) => {
        // Trong trường hợp API update bình thường đã hỗ trợ update field KHOA_TK
        const response = await api.put(`/accounts/${id}`, { KHOA_TK: !currentStatus });
        return response.data;
    },

    importBulk: async (dataArray) => {
        const response = await api.post('/accounts/bulk', { data: dataArray });
        return response.data;
    }
};
