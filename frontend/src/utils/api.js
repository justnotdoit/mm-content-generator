import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Content Generation
export const generateContent = async (params) => {
  const response = await api.post('/generate', params);
  return response.data;
};

// Posts
export const getPosts = async (filters = {}) => {
  const response = await api.get('/posts', { params: filters });
  return response.data;
};

export const getPost = async (postId) => {
  const response = await api.get(`/posts/${postId}`);
  return response.data;
};

export const createPost = async (postData) => {
  const response = await api.post('/posts', postData);
  return response.data;
};

export const updatePost = async (postId, updates) => {
  const response = await api.put(`/posts/${postId}`, updates);
  return response.data;
};

export const deletePost = async (postId) => {
  const response = await api.delete(`/posts/${postId}`);
  return response.data;
};

// Scheduling
export const schedulePost = async (postId, scheduledAt) => {
  const response = await api.post('/schedule', { post_id: postId, scheduled_at: scheduledAt });
  return response.data;
};

// Calendar
export const getCalendar = async (month) => {
  const response = await api.get('/calendar', { params: { month } });
  return response.data;
};

// Analytics
export const getAnalytics = async () => {
  const response = await api.get('/analytics');
  return response.data;
};

export const getLearningInsights = async () => {
  const response = await api.get('/learning-insights');
  return response.data;
};

export const getRecommendations = async (params) => {
  const response = await api.post('/recommendations', params);
  return response.data;
};

export const getPopularHashtags = async () => {
  const response = await api.get('/hashtags/popular');
  return response.data;
};

export default api;
