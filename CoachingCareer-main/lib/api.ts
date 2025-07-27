import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
});

export const bulletinService = {
  analyze: async (file: File) => {
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
  analyze: async (data: any) => {
    const response = await api.post('/salary-analysis', data);
    return response.data;
  },
};