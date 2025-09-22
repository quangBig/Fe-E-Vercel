// src/store/cartStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import localforage from "localforage";
import axios from "../lib/axios";
import { toast } from "react-toastify";

// Kiểu dữ liệu cho item trong Cart
export interface CartItem {
    productId: string;
    variantName?: string;
    color?: string;
    quantity: number;
    price: number;
    originalPrice: number;
    image: string;
}

// Payload gửi lên BE khi thêm vào giỏ
export interface AddToCartPayload {
    productId: string;
    variantName: string;
    color: string;
    quantity: number;
}

export interface Cart {
    _id: string;
    userId: string;
    items: CartItem[];
}

interface CartState {
    cart: Cart | null;
    loading: boolean;

    getCart: () => Promise<void>;
    addToCart: (payload: AddToCartPayload) => Promise<void>;
    updateQuantity: (productId: string, quantity: number) => Promise<void>;
    removeItem: (productId: string) => Promise<void>;
    clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState>()(
    persist(
        (set) => ({
            cart: null,
            loading: false,

            // Lấy giỏ hàng
            getCart: async () => {
                set({ loading: true });
                try {
                    const res = await axios.get("/cart");
                    set({ cart: res.data, loading: false });
                } catch (err: any) {
                    set({ loading: false });
                    toast.error("Không thể lấy giỏ hàng: " + err.message);
                }
            },

            // Thêm sản phẩm vào giỏ
            addToCart: async (payload) => {
                set({ loading: true });
                try {
                    const res = await axios.post("/cart/add", payload);
                    set({ cart: res.data, loading: false });
                    toast.success("Thêm vào giỏ thành công");
                } catch (err: any) {
                    set({ loading: false });
                    toast.error("Thêm giỏ hàng thất bại: " + err.message);
                }
            },

            // Cập nhật số lượng
            updateQuantity: async (productId, quantity) => {
                set({ loading: true });
                try {
                    if (quantity <= 0) {
                        // xóa luôn item nếu quantity <= 0
                        const res = await axios.delete(`/cart/remove/${productId}`);
                        set({ cart: res.data, loading: false });
                        toast.success("Sản phẩm đã được xóa khỏi giỏ hàng");
                    } else {
                        const res = await axios.patch(`/cart/update/${productId}`, { quantity });
                        set({ cart: res.data, loading: false });
                        toast.success("Cập nhật số lượng thành công");
                    }
                } catch (err: any) {
                    set({ loading: false });
                    toast.error("Cập nhật thất bại: " + err.message);
                }
            },


            // Xóa 1 sản phẩm
            removeItem: async (productId) => {
                set({ loading: true });
                try {
                    const res = await axios.delete(`/cart/remove/${productId}`);
                    set({ cart: res.data, loading: false });
                    toast.success("Xóa sản phẩm thành công");
                } catch (err: any) {
                    set({ loading: false });
                    toast.error("Xóa sản phẩm thất bại: " + err.message);
                }
            },

            // Xóa toàn bộ giỏ
            clearCart: async () => {
                set({ loading: true });
                try {
                    const res = await axios.delete(`/cart/clear`);
                    set({ cart: res.data, loading: false });

                } catch (err: any) {
                    set({ loading: false });

                }
            },
        }),
        {
            name: "cart-store",
            storage: createJSONStorage(() => localforage),
        }
    )
);
