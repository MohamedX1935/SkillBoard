import api from './api.js';

export const fetchMetrics = () => api.get('/dashboard/metrics').then((res) => res.data.data);

export const downloadReport = async () => {
  const response = await api.get('/dashboard/report', { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'rapport-skillboard.pdf');
  document.body.appendChild(link);
  link.click();
  link.remove();
};
