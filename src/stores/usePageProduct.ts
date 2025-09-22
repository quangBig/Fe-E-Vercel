// src/store/pageProductStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import localforage from "localforage"; // ✅ thay vì localStorage
import axios from "../lib/axios";
import { toast } from "react-toastify";

// ====== INTERFACES ======
export interface BannerVideo {
    url: string;
}

export interface BannerContent {
    image?: string;
    title?: string;
    description?: string;
}

export interface BannerConnect {
    image?: string;
    content?: string;
    mainContent?: string;
}

export interface PageProduct {
    _id: string;
    name: string;
    slug: string;
    image: string;
    bannerVideo?: BannerVideo;
    bannerContent?: BannerContent[];
    bannerConnect?: BannerConnect[];
    createdAt: string;
    updatedAt: string;
}

interface PageProductState {
    pageProducts: PageProduct[];
    loading: boolean;

    createPageProduct: (data: Partial<PageProduct>) => Promise<void>;
    getPageProducts: () => Promise<void>;
    getPageProductById: (id: string) => Promise<PageProduct | void>;
    updatePageProduct: (id: string, data: Partial<PageProduct>) => Promise<void>;
    deletePageProduct: (id: string) => Promise<void>;

    addBannerToPageProduct: (
        id: string,
        banner: { bannerVideo?: BannerVideo; bannerContent?: BannerContent }
    ) => Promise<void>;

    updateBannerInPageProduct: (
        id: string,
        index: number,
        banner: { bannerVideo?: BannerVideo; bannerContent?: BannerContent }
    ) => Promise<void>;

    deleteBannerFromPageProduct: (
        id: string,
        opts: { index: number } | { removeVideo: true }
    ) => Promise<void>;

    addBannerConnectToPageProduct: (
        id: string,
        banner: BannerConnect | BannerConnect[]
    ) => Promise<void>;

    updateBannerConnectInPageProduct: (
        id: string,
        index: number,
        banner: BannerConnect
    ) => Promise<void>;

    deleteBannerConnectFromPageProduct: (
        id: string,
        index: number
    ) => Promise<void>;


}

// ====== STORE ======
export const usePageProductStore = create<PageProductState>()(
    persist(
        (set) => ({
            pageProducts: [],
            loading: false,

            // ================= CRUD PAGE PRODUCT =================
            createPageProduct: async (data) => {
                set({ loading: true });
                try {
                    const res = await axios.post("/page-products", data);
                    set((state) => ({
                        pageProducts: [...state.pageProducts, res.data],
                        loading: false,
                    }));
                    toast.success("Tạo trang sản phẩm thành công");
                } catch (err: any) {
                    set({ loading: false });
                    toast.error("Tạo trang sản phẩm thất bại " + err.message);
                }
            },

            getPageProducts: async () => {
                set({ loading: true });
                try {
                    const res = await axios.get("/page-products");
                    set({ pageProducts: res.data, loading: false });
                } catch (err: any) {
                    set({ loading: false });
                    toast.error("Lấy danh sách trang sản phẩm thất bại " + err.message);
                }
            },

            getPageProductById: async (id: string) => {
                set({ loading: true });
                try {
                    const res = await axios.get(`/page-products/${id}`);
                    set({ loading: false });
                    return res.data;
                } catch (err: any) {
                    set({ loading: false });
                    toast.error("Lấy trang sản phẩm thất bại " + err.message);
                }
            },

            updatePageProduct: async (id, data) => {
                set({ loading: true });
                try {
                    const res = await axios.put(`/page-products/${id}`, data);
                    set((state) => ({
                        pageProducts: state.pageProducts.map((pageProduct) =>
                            pageProduct._id === id ? res.data : pageProduct
                        ),
                        loading: false,
                    }));
                    toast.success("Cập nhật trang sản phẩm thành công");
                } catch (err: any) {
                    set({ loading: false });
                    toast.error("Cập nhật trang sản phẩm thất bại " + err.message);
                }
            },

            deletePageProduct: async (id) => {
                set({ loading: true });
                try {
                    await axios.delete(`/page-products/${id}`);
                    set((state) => ({
                        pageProducts: state.pageProducts.filter(
                            (pageProduct) => pageProduct._id !== id
                        ),
                        loading: false,
                    }));
                    toast.success("Xoá trang sản phẩm thành công");
                } catch (err: any) {
                    set({ loading: false });
                    toast.error("Xoá trang sản phẩm thất bại " + err.message);
                }
            },

            // ================= BANNER ACTIONS =================
            addBannerToPageProduct: async (id, banner) => {
                set({ loading: true });
                try {
                    const res = await axios.post(`/page-products/${id}/banner`, banner);
                    set((state) => ({
                        pageProducts: state.pageProducts.map((p) =>
                            p._id === id ? res.data : p
                        ),
                        loading: false,
                    }));
                    toast.success("Thêm banner thành công");
                } catch (err: any) {
                    set({ loading: false });
                    toast.error("Thêm banner thất bại " + err.message);
                }
            },

            updateBannerInPageProduct: async (id, index, banner) => {
                set({ loading: true });
                try {
                    const res = await axios.patch(
                        `/page-products/${id}/banner/${index}`,
                        banner
                    );
                    set((state) => ({
                        pageProducts: state.pageProducts.map((p) =>
                            p._id === id ? res.data : p
                        ),
                        loading: false,
                    }));
                } catch (err: any) {
                    set({ loading: false });
                    toast.error("Cập nhật banner thất bại " + err.message);
                }
            },

            deleteBannerFromPageProduct: async (id, opts) => {
                set({ loading: true });
                try {
                    let url = "";
                    if ("index" in opts) {
                        url = `/page-products/${id}/banner/${opts.index}`;
                    } else if ("removeVideo" in opts) {
                        url = `/page-products/${id}/banner?removeVideo=true`;
                    }

                    const res = await axios.delete(url);
                    set((state) => ({
                        pageProducts: state.pageProducts.map((p) =>
                            p._id === id ? res.data : p
                        ),
                        loading: false,
                    }));
                    toast.success("Xóa banner thành công");
                } catch (err: any) {
                    set({ loading: false });
                    toast.error("Xóa banner thất bại " + err.message);
                }
            },

            addBannerConnectToPageProduct: async (id, banner) => {
                set({ loading: true });
                try {
                    const res = await axios.post(
                        `/page-products/${id}/banner-connect`,
                        banner
                    );
                    set((state) => ({
                        pageProducts: state.pageProducts.map((p) =>
                            p._id === id ? res.data : p
                        ),
                        loading: false,
                    }));
                    toast.success("Thêm banner connect thành công");
                } catch (err: any) {
                    set({ loading: false });
                    toast.error("Thêm banner connect thất bại " + err.message);
                }
            },

            updateBannerConnectInPageProduct: async (id, index, banner) => {
                set({ loading: true });
                try {
                    const res = await axios.patch(
                        `/page-products/${id}/banner-connect/${index}`,
                        banner
                    );
                    set((state) => ({
                        pageProducts: state.pageProducts.map((p) =>
                            p._id === id ? res.data : p
                        ),
                        loading: false,
                    }));
                    toast.success("Cập nhật banner connect thành công");
                } catch (err: any) {
                    set({ loading: false });
                    toast.error("Cập nhật banner connect thất bại " + err.message);
                }
            },

            deleteBannerConnectFromPageProduct: async (id: string, index: number) => {
                set({ loading: true });
                try {
                    const res = await axios.delete(
                        `/page-products/${id}/banner-connect/${index}`
                    );

                    set((state) => ({
                        pageProducts: state.pageProducts.map((p) =>
                            p._id === id ? res.data : p
                        ),
                        loading: false,
                    }));

                    toast.success("Xóa banner connect thành công");
                } catch (err: any) {
                    set({ loading: false });
                    toast.error("Xóa banner connect thất bại " + err.message);
                }
            },


        }),
        {
            name: "page-products-store",
            storage: createJSONStorage(() => localforage), // ✅ dùng IndexedDB
        }
    )
);
