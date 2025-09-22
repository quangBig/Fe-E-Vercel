import axios from "../lib/axios";
import { toast } from "react-toastify";
import { create } from "zustand";
import type { Page } from "../types/page.ts";
import { savePages, loadPages } from "../lib/pageDB";



interface PageState {
    pages: Page[];
    loading: boolean;
    createPage: (data: Partial<Page>) => Promise<void>;
    getPages: () => Promise<void>;
    getPageById: (id: string) => Promise<Page>;
    updatePage: (id: string, data: Partial<Page>) => Promise<void>;
    deletePage: (id: string) => Promise<void>;
    reorderPages: (newOrder: { id: string; position: number }[]) => Promise<void>;
    getPagesBySection: (section: string) => Promise<Page[]>;
}

export const usePageStore = create<PageState>((set, get) => ({
    pages: [],
    loading: false,

    createPage: async (data) => {
        set({ loading: true });
        try {
            const res = await axios.post("/pages", data);
            const newPages = [...get().pages, res.data];
            set({ pages: newPages, loading: false });
            await savePages(newPages);
            toast.success("Tạo trang thành công");
        } catch (err: any) {
            set({ loading: false });
            toast.error("Tạo trang thất bại " + err.message);
        }
    },

    getPages: async () => {
        set({ loading: true });
        try {
            const res = await axios.get("/pages");
            set({ pages: res.data, loading: false });
            await savePages(res.data);
        } catch (err) {
            // fallback từ IndexedDB
            const cached = await loadPages();
            if (cached.length > 0) {
                set({ pages: cached, loading: false });
                toast.info("Dùng dữ liệu cache từ IndexedDB");
            } else {
                set({ loading: false });
                toast.error("Lấy danh sách trang thất bại");
            }
        }
    },

    getPageById: async (id) => {
        const cached = get().pages.find((p) => p._id === id);
        if (cached) return cached;
        const res = await axios.get(`/pages/${id}`);
        return res.data;
    },

    updatePage: async (id, data) => {
        set({ loading: true });
        try {
            const res = await axios.put(`/pages/${id}`, data);
            const newPages = get().pages.map((page) =>
                page._id === id ? res.data : page
            );
            set({ pages: newPages, loading: false });
            await savePages(newPages);
            toast.success("Cập nhật trang thành công");
        } catch (err) {
            set({ loading: false });
            toast.error("Cập nhật trang thất bại");
        }
    },

    deletePage: async (id) => {
        set({ loading: true });
        try {
            await axios.delete(`/pages/${id}`);
            const newPages = get().pages.filter((p) => p._id !== id);
            set({ pages: newPages, loading: false });
            await savePages(newPages);
            toast.success("Xóa trang thành công");
        } catch (err) {
            set({ loading: false });
            toast.error("Xóa trang thất bại");
        }
    },

    reorderPages: async (newOrder) => {
        set({ loading: true });
        try {
            const res = await axios.post("/pages/reorder", newOrder);
            set({ pages: res.data, loading: false });
            await savePages(res.data);
            toast.success("Sắp xếp lại trang thành công");
        } catch (err: any) {
            set({ loading: false });
            toast.error("Sắp xếp thất bại: " + err.message);
        }
    },

    getPagesBySection: async (section) => {
        try {
            const res = await axios.get(`/pages/section/${section}`);
            return res.data;
        } catch (err) {
            toast.error("Lấy danh sách trang theo section thất bại");
            return [];
        }
    },
}));
