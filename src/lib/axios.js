// lib/axios.js
import axios from 'axios';
import { useAuthStore } from '../stores/useAuthStore';

// Tạo instance axios
const axiosInstance = axios.create({
    baseURL: 'https://be-e-vercel.vercel.app/', // URL backend của bạn
});

// Interceptor để tự động thêm token vào headers
axiosInstance.interceptors.request.use(
    (config) => {
        // Lấy token từ store (cách này hơi phức tạp vì store là hook)
        // Cách tốt hơn: lấy token từ localStorage vì bạn dùng persist
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
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor để xử lý lỗi 401
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token hết hạn hoặc không hợp lệ
            const { logout } = useAuthStore.getState();
            logout();
            console.log('Đăng xuất do token hết hạn');
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;