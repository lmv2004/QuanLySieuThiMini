import api from './api';

export const promotionService = {
    getAll: async () => {
        const response = await api.get('/discounts');
        return response.data;
    },
    
    create: async (data) => {
        const response = await api.post('/discounts', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/discounts/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/discounts/${id}`);
        return response.data;
    },

    importBulk: async (dataArray) => {
        const response = await api.post('/discounts/bulk', { data: dataArray });
        return response.data;
    }
};
