import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
});

export const bulletinService = {
  analyze: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/analyze-bulletin', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export const salaryService = {
  analyze: async (data) => {
    const response = await api.post('/salary-analysis', data);
    return response.data;
  },
};

export const careerService = {
  generatePlan: async (data) => {
    const response = await api.post('/career-coaching', { ...data, type: 'plan' });
    return response.data;
  },
  generateScript: async (data) => {
    const response = await api.post('/career-coaching', { ...data, type: 'script' });
    return response.data;
  },
};

export default api; 