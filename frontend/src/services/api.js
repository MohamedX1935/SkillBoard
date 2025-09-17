import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.data) {
      const message = error.response.data.message || 'Une erreur est survenue';
      return Promise.reject(new Error(message));
    }
    return Promise.reject(error);
  }
);

export default api;
