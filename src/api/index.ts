import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://bus-booking-backend-ykl1.vercel.app/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth API
export const authAPI = {
    login: (username: string, password: string) =>
        api.post('/auth/login', { username, password }),
    register: (username: string, email: string, password: string) =>
        api.post('/auth/register', { username, email, password }),
    getMe: () => api.get('/auth/me'),
};

// Users API (admin)
export const usersAPI = {
    getAll: () => api.get('/users'),
    getById: (id: number) => api.get(`/users/${id}`),
    create: (data: { username: string; email: string; password: string; is_admin?: boolean }) =>
        api.post('/users', data),
    update: (id: number, data: { username?: string; email?: string; is_admin?: boolean }) =>
        api.put(`/users/${id}`, data),
    delete: (id: number) => api.delete(`/users/${id}`),
};

// Buses API
export const busesAPI = {
    getAll: () => api.get('/buses'),
    getById: (id: number) => api.get(`/buses/${id}`),
    create: (data: { name: string; capacity: number }) => api.post('/buses', data),
    update: (id: number, data: { name?: string; capacity?: number }) =>
        api.put(`/buses/${id}`, data),
    delete: (id: number) => api.delete(`/buses/${id}`),
};

// Destinations API
export const destinationsAPI = {
    getAll: () => api.get('/destinations'),
    getById: (id: number) => api.get(`/destinations/${id}`),
    create: (data: { name: string; price: number; distance: number }) =>
        api.post('/destinations', data),
    update: (id: number, data: { name?: string; price?: number; distance?: number }) =>
        api.put(`/destinations/${id}`, data),
    delete: (id: number) => api.delete(`/destinations/${id}`),
};

// Bookings API
export const bookingsAPI = {
    getAll: () => api.get('/bookings'),
    getById: (id: number) => api.get(`/bookings/${id}`),
    create: (data: { bus_id: number; destination_id: number; travel_date: string }) =>
        api.post('/bookings', data),
    update: (id: number, data: { bus_id?: number; destination_id?: number; travel_date?: string }) =>
        api.put(`/bookings/${id}`, data),
    cancel: (id: number) => api.delete(`/bookings/${id}`),
};

export default api;
