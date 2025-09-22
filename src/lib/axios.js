// lib/axios.js
import axios from 'axios';
import { useAuthStore } from '../stores/useAuthStore';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000', // fallback cho dev
    withCredentials: true, // cần nếu dùng cookie/session
});

// Thêm token vào headers
axiosInstance.interceptors.request.use(
    (config) => {
        const authData = localStorage.getItem('auth-store');
        if (authData) {
            try {
                const parsedData = JSON.parse(authData);
                const token = parsedData.state.token;
                if (token && config.headers) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (error) {
                console.error('Error parsing auth data from localStorage:', error);
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Xử lý lỗi 401
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const { logout } = useAuthStore.getState();
            logout();
            console.log('Đăng xuất do token hết hạn');
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
