import React, { useState } from "react";
import { toast } from "react-toastify";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
    AlertDialogFooter,
} from "../../../../components/ui/alert-dialog";
import { usePageStore } from "../../../../stores/usePageStore";

const getInitialPageState = () => ({
    title: "",
    decs: "",
    image: "",
    link: "",
    price: "",
    reverse: false,

    section: "",
    bannerTitle: "",
});


const PageHomeManagement = () => {
    const [form, setForm] = useState(getInitialPageState);
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const { pages, createPage, updatePage, deletePage, reorderPages } = usePageStore();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleImageUpload = (file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
            setForm((prev) => ({ ...prev, image: reader.result }));
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing && selectedId) {
                await updatePage(selectedId, form);
                toast.success("Cập nhật banner thành công");
            } else {
                await createPage(form);
                toast.success("Thêm banner thành công");
            }
            resetForm();
        } catch (error) {
            toast.error("Lỗi khi lưu trang: " + error.message);
        }
    };

    const resetForm = () => {
        setForm(getInitialPageState());
        setImagePreview(null);
        setSelectedId(null);
        setIsEditing(false);
    };

    const handleEdit = (page) => {
        setForm(page);
        setImagePreview(page.image);
        setSelectedId(page._id);
        setIsEditing(true);
    };

    const handleDelete = async () => {
        if (!selectedId) return;
        try {
            await deletePage(selectedId);
            toast.success("Xóa banner thành công");
            setSelectedId(null);
        } catch (error) {
            toast.error("Xóa trang thất bại: " + error.message);
        }
    };

    const moveUp = async (index) => {
        if (index === 0) return;
        const newPages = [...pages];
        [newPages[index - 1], newPages[index]] = [newPages[index], newPages[index - 1]];
        await reorderPages(newPages.map((p, idx) => ({ id: p._id, position: idx + 1 })));
    };

    const moveDown = async (index) => {
        if (index === pages.length - 1) return;
        const newPages = [...pages];
        [newPages[index], newPages[index + 1]] = [newPages[index + 1], newPages[index]];
        await reorderPages(newPages.map((p, idx) => ({ id: p._id, position: idx + 1 })));
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-6">Quản lý Trang chủ</h3>

            {/* Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
                <Input label="Tiêu đề" name="title" value={form.title} onChange={handleChange} />
                <Textarea label="Mô tả" name="decs" value={form.decs} onChange={handleChange} />
                <Input
                    label="Mô tả về giá"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                />
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chọn ảnh từ máy</label>
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files[0])} />
                    {imagePreview && <img src={imagePreview} alt="preview" className="h-40 mt-4 rounded-lg border shadow-md" />}
                </div>
                <Input label="Link" name="link" value={form.link} onChange={handleChange} />
                <Input
                    label="Tên hiển thị (bannerTitle)"
                    name="bannerTitle"
                    value={form.bannerTitle}
                    onChange={handleChange}
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                    <select
                        name="section"
                        value={form.section}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg"
                    >
                        <option value="product">Product Section</option>
                        <option value="carousel">Card Shelf Carousel</option>
                    </select>
                </div>


                <div className="flex items-center">
                    <input type="checkbox" name="reverse" checked={form.reverse} onChange={handleChange} />
                    <label className="ml-2 text-sm text-gray-700">Đảo ngược vị trí</label>
                </div>

                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg">
                    {isEditing ? "Cập nhật Banner" : "Thêm Banner"}
                </button>
                {isEditing && (
                    <button type="button" onClick={resetForm} className="ml-3 bg-gray-400 text-white px-6 py-2 rounded-lg">
                        Hủy
                    </button>
                )}
            </form>

            {/* List */}
            {/* List Group by Section */}
            {pages.length > 0 && (
                <>
                    {[...new Set(pages.map((p) => p.section))].map((sectionName) => (
                        <div key={sectionName} className="mt-8">
                            <h4 className="text-md font-semibold mb-2">
                                Section: {sectionName}
                            </h4>
                            <table className="min-w-full border">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="px-4 py-2 border">Sắp xếp</th>
                                        <th className="px-4 py-2 border">BannerTitle</th>
                                        <th className="px-4 py-2 border">Tiêu đề</th>
                                        <th className="px-4 py-2 border">Mô tả</th>
                                        <th className="px-4 py-2 border">Ảnh</th>
                                        <th className="px-4 py-2 border">Đảo ngược vị trí</th>

                                        <th className="px-4 py-2 border">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pages
                                        .filter((p) => p.section === sectionName)
                                        .map((page, index, arr) => (
                                            <tr key={page._id}>
                                                <td className="px-4 py-2 border">
                                                    <button onClick={() => moveUp(index)}>⬆</button>
                                                    <button onClick={() => moveDown(index)}>⬇</button>
                                                </td>
                                                <td className="px-4 py-2 border">{page.bannerTitle}</td>
                                                <td className="px-4 py-2 border">{page.title}</td>
                                                <td className="px-4 py-2 border">{page.decs}</td>
                                                <td className="px-4 py-2 border">
                                                    <img src={page.image} className="h-12" />
                                                </td>
                                                <td className="px-4 py-2 border">
                                                    {page.reverse ? "True" : "False"}
                                                </td>

                                                <td className="px-4 py-2 border">
                                                    <button
                                                        onClick={() => handleEdit(page)}
                                                        className="px-3 py-1 bg-blue-500 text-white rounded"
                                                    >
                                                        Sửa
                                                    </button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <button
                                                                onClick={() => setSelectedId(page._id)}
                                                                className="px-3 py-1 bg-red-500 text-white rounded"
                                                            >
                                                                Xóa
                                                            </button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Xóa banner?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Bạn có chắc chắn muốn xóa {page.title}?
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Hủy</AlertDialogCancel>
                                                                <AlertDialogAction onClick={handleDelete}>
                                                                    Xóa
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </>
            )}

        </div>
    );
};

export default PageHomeManagement;

/* Input & Textarea tái sử dụng */
const Input = ({ label, ...props }) => (
    <div>
        <label className="block text-sm mb-1">{label}</label>
        <input {...props} className="w-full px-3 py-2 border rounded-lg" />
    </div>
);

const Textarea = ({ label, ...props }) => (
    <div>
        <label className="block text-sm mb-1">{label}</label>
        <textarea {...props} rows="2" className="w-full px-3 py-2 border rounded-lg" />
    </div>
);
