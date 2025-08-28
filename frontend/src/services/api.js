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
      window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

// පරිශීලක සත්‍යාපන API calls
export const authAPI = {
  login: (userData) => api.post('/users/login', userData),
  register: (userData) => api.post('/users/register', userData),
  // Postman එකේ නොතිබුණත්, මෙය සාමාන්‍යයෙන් අවශ්‍ය වන බැවින් තබා ඇත
  getProfile: () => api.get('/users/profile'), 
  // Postman එකේ නොතිබුණත්, මෙය සාමාන්‍යයෙන් අවශ්‍ය වන බැවින් තබා ඇත
  updateProfile: (userData) => api.put('/users/profile', userData), 
  logout: () => api.post('/users/logout')
};

// නිෂ්පාදන API calls
export const productAPI = {
  getAllProducts: () => api.get('/products'),
  getAvailableProducts: () => api.get('/products/available'),
  getProduct: (id) => api.get(`/products/${id}`),
  createProduct: (productData) => api.post('/products', productData),
  updateProduct: (id, productData) => api.put(`/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/products/${id}`),
};

// ඇණවුම් API calls
export const orderAPI = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getAllOrders: () => api.get('/orders'),
  getOrder: (id) => api.get(`/orders/${id}`),
  updateOrderStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  getUserOrders: (userId) => api.get(`/users/${userId}/orders`),
};

// ප්‍රවර්ග API calls
export const categoryAPI = {
  getAllCategories: () => api.get('/categories'),
  getCategory: (id) => api.get(`/categories/${id}`),
  createCategory: (categoryData) => api.post('/categories', categoryData),
  updateCategory: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
  deleteCategory: (id) => api.delete(`/categories/${id}`),
};

// සියලුම API objects එකට ගොනු කරයි
export const apiService = {
  auth: authAPI,
  products: productAPI,
  orders: orderAPI,
  categories: categoryAPI
};

export default api;
