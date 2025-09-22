import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "../lib/axios";
import { ToastContainer, toast } from 'react-toastify';

export interface User {
    _id: string;
    lastname: string;
    name: string;
    email: string;
    role: string;
    createdAt?: string;
    updatedAt?: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    checkingAuth: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
    loginWithGoogle: (token: string) => Promise<void>;
    getUserCount: () => Promise<number>;
}

interface RegisterData {
    name: string;
    email: string;
    password: string;
    confirmpassword: string;
}

export const useAuthStore = create<AuthState, [['zustand/persist', AuthState]]>(
    persist<AuthState>(
        (set, get) => ({
            user: null,
            token: null,
            loading: false,
            checkingAuth: false,
            login: async (email, password) => {
                set({ loading: true });
                try {
                    const res = await axios.post("/auth/login", { email, password });
                    const { access_token } = res.data;

                    // Lưu token vào store
                    set({ token: access_token });

                    // Gọi profile - axios interceptor sẽ tự động thêm token
                    const profileRes = await axios.get("/auth/profile");

                    set({
                        user: profileRes.data,
                        loading: false
                    });

                    toast.success("Đăng nhập thành công");
                } catch (error: any) {
                    console.error("Login error:", error?.response?.data || error.message);
                    set({ loading: false, user: null, token: null });

                    const errorMsg = error?.response?.data?.message || "Đăng nhập thất bại";
                    toast.error(errorMsg);
                    throw error;
                }
            },

            register: async (data) => {
                set({ loading: true });
                try {
                    await axios.post("/auth/register", data);
                    set({ loading: false });
                    toast.success("Đăng ký thành công");
                } catch (error: any) {
                    set({ loading: false });

                    const msg = error?.response?.data?.message;
                    if (Array.isArray(msg)) {
                        toast.error(msg.join(", "));
                    } else {
                        toast.error(msg || "Lỗi đăng ký");
                    }

                    throw error;
                }
            },
            logout: () => {
                set({ user: null, token: null });
                toast.success("Đăng xuất thành công");
            },
            checkAuth: async () => {
                set({ checkingAuth: true });
                const { token } = get();

                console.log("Token in checkAuth:", token); // Debug

                if (!token) {
                    console.log("No token found"); // Debug
                    set({ user: null, checkingAuth: false });
                    return;
                }

                try {
                    console.log("Sending request to /auth/profile with token"); // Debug
                    const response = await axios.get("/auth/profile");
                    set({ user: response.data, checkingAuth: false });
                } catch (error) {
                    console.error("Check auth error:", error);
                    set({ user: null, token: null, checkingAuth: false });
                }
            },
            loginWithGoogle: async (token: string) => {
                set({ loading: true });
                try {
                    const res = await axios.post("/auth/google", { token });
                    const { access_token, user } = res.data;
                    set({
                        user,
                        token: access_token,
                        loading: false
                    });
                    toast.success("Đăng nhập thành công với Google");
                } catch (error) {
                    console.error("Google login failed:", error);
                    toast.error("Đăng nhập thất bại. Vui lòng thử lại.");
                    set({ loading: false });
                    throw error;
                }
            },
            getUserCount: async () => {
                try {
                    const res = await axios.get("/auth/count");
                    return res.data.total;
                } catch (err) {
                    console.error("Failed to fetch user count:", err);
                    return 0;
                }
            }
        }),
        {
            name: "auth-store",
        }
    )
);