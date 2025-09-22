import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-toastify";

export interface OrderItem {
    productId: string;
    variantName?: string;
    color?: string;
    quantity: number;
    price: number;
    originalPrice: number;
    image: string;
}

export interface ShippingAddress {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
    provinceCode?: number;
    provinceName?: string;
    districtCode?: number;
    districtName?: string;
    wardCode?: number;
    wardName?: string;
}

export interface Order {
    _id: string;
    userId: string;
    items: OrderItem[];
    shippingAddress: ShippingAddress;
    payment: {
        method: "cod" | "momo";
        status: "pending" | "paid" | "failed";
    };
    note?: string;
    shippingFee: number;
    subtotal: number;
    total: number;
    status: "pending" | "processing" | "shipping" | "completed" | "cancelled";
    createdAt?: string;
    updatedAt?: string;
}

interface OrderStatistics {
    statusCounts: { _id: string; count: number }[];
    revenue: number;
    totalOrders: number;
    totalAmount: number;
}

interface OrderState {
    orders: Order[];
    loading: boolean;
    statistics: OrderStatistics | null;
    createOrder: (data: Partial<Order>) => Promise<void>;
    getOrders: () => Promise<void>;
    getOrdersByUser: (userId: string) => Promise<void>;
    getOrderById: (id: string) => Promise<Order | null>;
    updateOrderStatus: (id: string, status: Order["status"]) => Promise<void>;
    updatePaymentStatus: (
        id: string,
        status: "pending" | "paid" | "failed",
        transactionId?: string
    ) => Promise<void>;
    cancelOrder: (id: string) => Promise<void>;
    removeOrder: (id: string) => Promise<void>;
    getStatistics: () => Promise<void>;
}


export const useOrderStore = create<OrderState>((set, get) => ({
    orders: [],
    loading: false,
    statistics: null,

    // ===== CREATE ORDER =====
    createOrder: async (data) => {
        set({ loading: true });
        try {
            const res = await axios.post("/orders", data);
            set({ orders: [...get().orders, res.data], loading: false });
            toast.success("Tạo đơn hàng thành công");
        } catch (err: any) {
            set({ loading: false });
            toast.error("Tạo đơn hàng thất bại: " + (err.response?.data?.message || err.message));
        }
    },


    // ===== GET ALL ORDERS =====
    getOrders: async () => {
        set({ loading: true });
        try {
            const res = await axios.get("/orders");
            set({ orders: res.data, loading: false });
        } catch (err: any) {
            set({ loading: false });
            toast.error("Lấy danh sách đơn hàng thất bại: " + err.message);
        }
    },

    // ===== GET ORDERS BY USER =====
    getOrdersByUser: async (userId) => {
        set({ loading: true });
        try {
            const res = await axios.get(`/orders/user/${userId}`);
            set({ orders: res.data, loading: false });
        } catch (err: any) {
            set({ loading: false });
            toast.error("Lấy đơn hàng theo user thất bại: " + err.message);
        }
    },

    // ===== GET ONE ORDER =====
    getOrderById: async (id) => {
        set({ loading: true });
        try {
            const res = await axios.get(`/orders/${id}`);
            set({ loading: false });
            return res.data;
        } catch (err: any) {
            set({ loading: false });
            toast.error("Lấy chi tiết đơn hàng thất bại: " + err.message);
            return null;
        }
    },

    // ===== UPDATE ORDER STATUS =====
    updateOrderStatus: async (id, status) => {
        set({ loading: true });
        try {
            const res = await axios.patch(`/orders/${id}/status`, { status });
            set({
                orders: get().orders.map((o) => (o._id === id ? res.data : o)),
                loading: false,
            });
            toast.success("Cập nhật trạng thái đơn hàng thành công");
        } catch (err: any) {
            set({ loading: false });
            toast.error("Cập nhật trạng thái thất bại: " + err.message);
        }
    },

    // ===== UPDATE PAYMENT STATUS =====
    updatePaymentStatus: async (id, status, transactionId) => {
        set({ loading: true });
        try {
            const res = await axios.patch(`/orders/${id}/payment`, {
                status,
                transactionId,
            });
            set({
                orders: get().orders.map((o) => (o._id === id ? res.data : o)),
                loading: false,
            });
            toast.success("Cập nhật thanh toán thành công");
        } catch (err: any) {
            set({ loading: false });
            toast.error("Cập nhật thanh toán thất bại: " + err.message);
        }
    },

    // ===== CANCEL ORDER =====
    // ===== CANCEL ORDER =====
    cancelOrder: async (id) => {
        set({ loading: true });
        try {
            const res = await axios.patch(`/orders/${id}/cancel`);
            set({
                orders: get().orders.map((o) => (o._id === id ? res.data : o)),
                loading: false,
            });
            toast.success("Đơn hàng đã được hủy");
        } catch (err: any) {
            set({ loading: false });
            toast.error("Hủy đơn hàng thất bại: " + err.message);
        }
    },
    // ===== DELETE ORDER (hard delete) =====
    removeOrder: async (id: string) => {
        set({ loading: true });
        try {
            await axios.delete(`/orders/${id}`);
            set({
                orders: get().orders.filter((o) => o._id !== id),
                loading: false,
            });
            toast.success("Xóa đơn hàng thành công");
        } catch (err: any) {
            set({ loading: false });
            toast.error("Xóa đơn hàng thất bại: " + err.message);
        }
    },
    getStatistics: async () => {
        set({ loading: true });
        try {
            const res = await axios.get("/orders/statistics");
            set({ statistics: res.data, loading: false });
        } catch (err: any) {
            set({ loading: false });
            toast.error("Lấy thống kê đơn hàng thất bại: " + err.message);
        }
    },

}));
