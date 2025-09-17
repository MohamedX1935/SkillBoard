import api from './api.js';

export const fetchTrainings = (params = {}) => api.get('/trainings', { params }).then((res) => res.data.data);

export const addTraining = (userId, payload) => api.post(`/trainings/${userId}`, payload).then((res) => res.data.data);

export const updateTraining = (userId, trainingId, payload) =>
  api.put(`/trainings/${userId}/${trainingId}`, payload).then((res) => res.data.data);

export const deleteTraining = (userId, trainingId) =>
  api.delete(`/trainings/${userId}/${trainingId}`).then((res) => res.data.data);
