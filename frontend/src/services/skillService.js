import api from './api.js';

export const fetchSkills = (params = {}) => api.get('/skills', { params }).then((res) => res.data.data);

export const addSkill = (userId, payload) => api.post(`/skills/${userId}`, payload).then((res) => res.data.data);

export const updateSkill = (userId, skillId, payload) =>
  api.put(`/skills/${userId}/${skillId}`, payload).then((res) => res.data.data);

export const deleteSkill = (userId, skillId) =>
  api.delete(`/skills/${userId}/${skillId}`).then((res) => res.data.data);
