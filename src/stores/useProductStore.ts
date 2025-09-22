// src/store/productStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "../lib/axios";
import { toast } from "react-toastify";

export interface Product {
    _id?: string;
    name: string;
    description?: string;
    Outstandingfeatures?: string;
    category?: string;
    images?: string[];
    variants?: {
        _id?: string;
        name: string;
        price: string;
        discountedPrice?: string; // 👈 thêm giá sau khi giảm
        config?: string;
        colors?: {
            _id?: string;
            name?: string;
            value?: string;
            hex?: string;
            image?: string;
            price?: string;
            discountedPrice?: string; // 👈 thêm giá sau khi giảm
        }[];
    }[];
    createdAt?: string;
    updatedAt?: string;
}

interface ProductState {
    products: Product[];
    product: Product | null;
    loading: boolean;
    getProducts: () => Promise<void>;
    getProductById: (id: string) => Promise<void>;
    createProduct: (data: Partial<Product>) => Promise<void>;
    updateProduct: (id: string, data: Partial<Product>) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
}

export const useProductStore = create<ProductState>()(
    persist(
        (set, get) => ({
            products: [],
            product: null,
            loading: false,

            getProducts: async () => {
                set({ loading: true });
                try {
                    const res = await axios.get("/products");
                    set({ products: res.data, loading: false });
                } catch (err) {
                    set({ loading: false });
                    toast.error("Lấy danh sách sản phẩm thất bại");
                }
            },

            getProductById: async (id) => {
                set({ loading: true });
                try {
                    const res = await axios.get(`/products/${id}`);
                    set({ product: res.data, loading: false });
                } catch (err) {
                    set({ loading: false });
                    toast.error("Không tìm thấy sản phẩm");
                }
            },

            createProduct: async (data) => {
                set({ loading: true });
                try {
                    // loại bỏ _id rỗng/null
                    const { _id, ...rest } = data;
                    const payload = _id ? { _id, ...rest } : rest;

                    const res = await axios.post("/products", payload);
                    set({
                        products: [...get().products, res.data],
                        loading: false,
                    });
                    toast.success("Thêm sản phẩm thành công");
                } catch (err: any) {
                    set({ loading: false });
                    toast.error(err?.response?.data?.message || "Lỗi thêm sản phẩm");
                }
            },

            updateProduct: async (id, data) => {
                set({ loading: true });
                try {
                    const res = await axios.put(`/products/${id}`, data);
                    set({
                        products: get().products.map((p) =>
                            p._id === id ? res.data : p
                        ),
                        loading: false,
                    });
                    toast.success("Cập nhật sản phẩm thành công");
                } catch (err) {
                    set({ loading: false });
                    toast.error("Lỗi cập nhật sản phẩm");
                }
            },

            deleteProduct: async (id) => {
                set({ loading: true });
                try {
                    await axios.delete(`/products/${id}`);
                    set({
                        products: get().products.filter((p) => p._id !== id),
                        loading: false,
                    });
                    toast.success("Xóa sản phẩm thành công");
                } catch (err) {
                    set({ loading: false });
                    toast.error("Lỗi xóa sản phẩm");
                }
            },
        }),
        {
            name: "product-store",
            // ❌ Không persist toàn bộ state
            // ✅ Chỉ persist state nhỏ cần thiết
            partialize: (state) => ({
                product: state.product,
            }),
        }
    )
);
