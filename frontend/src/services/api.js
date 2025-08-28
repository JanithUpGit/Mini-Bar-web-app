
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login.html';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (userData) => api.post('/users/login', userData),
  register: (userData) => api.post('/users/register', userData),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  logout: () => api.post('/users/logout')
};

export const productAPI = {
  getAllProducts: () => api.get('products'),
  getAvailableProducts: () => api.get('products/available'),
  getProduct: (id) => api.get(`/products/${id}`),
  createItem: (itemData) => api.post('/items/create', itemData),
  updateItem: (id, itemData) => api.put(`/items/${id}/update`, itemData),
  deleteItem: (id) => api.delete(`/items/${id}/delete`),
};

export const orderAPI = {
  createOrder: (orderData) => api.post('/orders/create', orderData),
  getAllOrders: () => api.get('/orders/all'),
  getOrder: (id) => api.get(`/orders/${id}`),
  updateOrderStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  getUserOrders: (userId) => api.get(`/orders/user/${userId}/all`),
};

export const feedbackAPI = {
  createFeedback: (feedbackData) => api.post('/feedback/create', feedbackData),
  getAllFeedback: () => api.get('/feedback/all'),
  getFeedbackByOrder: (orderId) => api.get(`/feedback/order/${orderId}`),
};

export const paymentAPI = {
  processPayment: (paymentData) => api.post('/payments/process', paymentData),
  getAllPayments: () => api.get('/payments/all'),
  getPaymentByOrder: (orderId) => api.get(`/payments/order/${orderId}`),
};

export const categoryAPI = {
  getAllCategories: () => api.get('/categories/all'),
  getCategory: (id) => api.get(`/categories/${id}`),
  createCategory: (categoryData) => api.post('/categories/create', categoryData),
};

export const apiService = {
  auth: authAPI,
  items: productAPI,
  orders: orderAPI,
  feedback: feedbackAPI,
  payments: paymentAPI,
  categories: categoryAPI
};

export default api;