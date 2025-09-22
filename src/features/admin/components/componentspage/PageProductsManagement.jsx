import React, { useState } from "react";
import { toast } from "react-toastify";
import { usePageProductStore } from "../../../../stores/usePageProduct";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
    AlertDialogFooter,
} from "../../../../components/ui/alert-dialog";

/* ==== STATE BAN ĐẦU ==== */
const getInitialProductState = () => ({
    name: "",
    slug: "",
    image: "",
});

const getInitialBannerState = () => ({
    image: "",
    title: "",
    description: "",
    bannerVideo: "",
});

const getInitialBannerConnectState = () => ({
    image: "",
    content: "",
    mainContent: "",
});

const PageProductsManagement = () => {
    const [productForm, setProductForm] = useState(getInitialProductState());
    const [bannerForm, setBannerForm] = useState(getInitialBannerState());
    const [bannerConnectForm, setBannerConnectForm] = useState(getInitialBannerConnectState());
    const [imagePreview, setImagePreview] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);

    const [isEditingProduct, setIsEditingProduct] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);

    const [editingBannerIndex, setEditingBannerIndex] = useState(null);
    const [isEditingBannerProduct, setIsEditingBannerProduct] = useState(false);

    const [editingBannerConnectIndex, setEditingBannerConnectIndex] = useState(null);
    const [isEditingBannerConnect, setIsEditingBannerConnect] = useState(false);

    const {
        pageProducts,
        createPageProduct,
        updatePageProduct,
        deletePageProduct,
        addBannerToPageProduct,
        deleteBannerFromPageProduct,
        updateBannerInPageProduct,
        addBannerConnectToPageProduct,
        updateBannerConnectInPageProduct,
        deleteBannerConnectFromPageProduct,
    } = usePageProductStore();

    /* ==== HANDLERS ==== */
    const handleProductChange = (e) => {
        const { name, value } = e.target;
        setProductForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleBannerChange = (e) => {
        const { name, value } = e.target;
        setBannerForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleBannerConnectChange = (e) => {
        const { name, value } = e.target;
        setBannerConnectForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleProductImageUpload = (file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
            setProductForm((prev) => ({ ...prev, image: reader.result }));
        };
        reader.readAsDataURL(file);
    };

    const handleBannerImageUpload = (file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setBannerForm((prev) => ({ ...prev, image: reader.result }));
        };
        reader.readAsDataURL(file);
    };

    const handleBannerConnectImageUpload = (file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setBannerConnectForm((prev) => ({ ...prev, image: reader.result }));
        };
        reader.readAsDataURL(file);
    };

    const handleVideoUpload = (file) => {
        if (!file) return;
        const videoURL = URL.createObjectURL(file);
        setVideoPreview(videoURL);
        setBannerForm((prev) => ({ ...prev, bannerVideo: videoURL }));
    };

    /* ==== SUBMIT PRODUCT ==== */
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditingProduct && selectedProductId) {
                await updatePageProduct(selectedProductId, productForm);
                toast.success("Cập nhật danh mục thành công");
            } else {
                await createPageProduct(productForm);
                toast.success("Thêm danh mục thành công");
            }
            resetForm();
        } catch (error) {
            console.error(error);
            toast.error("Lỗi khi lưu danh mục: " + (error?.message || error));
        }
    };

    /* ==== SUBMIT BANNER CONTENT ==== */
    const handleSubmitBanner = async (e) => {
        e.preventDefault();
        try {
            if (!selectedProductId) {
                toast.error("Vui lòng chọn một sản phẩm trước khi thêm banner");
                return;
            }
            const payload = {
                bannerVideo: bannerForm.bannerVideo ? { url: bannerForm.bannerVideo } : undefined,
                bannerContent:
                    bannerForm.image || bannerForm.title
                        ? {
                            image: bannerForm.image,
                            title: bannerForm.title,
                            description: bannerForm.description,
                        }
                        : undefined,
            };
            await addBannerToPageProduct(selectedProductId, payload);
            toast.success("Thêm banner content thành công");
            setBannerForm(getInitialBannerState());
            setVideoPreview(null);
        } catch (error) {
            console.error(error);
            toast.error("Lỗi khi thêm banner content: " + (error?.message || error));
        }
    };

    /* ==== SUBMIT BANNER CONNECT ==== */
    const handleSubmitBannerConnect = async (e) => {
        e.preventDefault();
        try {
            if (!selectedProductId) {
                toast.error("Vui lòng chọn một sản phẩm trước khi thêm banner connect");
                return;
            }
            const payload = {
                image: bannerConnectForm.image,
                content: bannerConnectForm.content,
                mainContent: bannerConnectForm.mainContent,
            };
            await addBannerConnectToPageProduct(selectedProductId, payload);
            toast.success("Thêm banner connect thành công");
            setBannerConnectForm(getInitialBannerConnectState());
        } catch (error) {
            console.error(error);
            toast.error("Lỗi khi thêm banner connect: " + (error?.message || error));
        }
    };

    /* ==== EDIT & UPDATE ==== */
    const handleEditProduct = (product) => {
        setProductForm({
            name: product.name,
            slug: product.slug,
            image: product.image,
        });
        setImagePreview(product.image);
        setSelectedProductId(product._id);
        setIsEditingProduct(true);
    };

    const handleEditBannerProduct = (productId, banner, index) => {
        setSelectedProductId(productId);
        setBannerForm({
            image: banner.image || "",
            title: banner.title || "",
            description: banner.description || "",
            bannerVideo: "",
        });
        setEditingBannerIndex(index);
        setIsEditingBannerProduct(true);
    };

    const handleUpdateBanner = async (e) => {
        e.preventDefault();
        try {
            if (!selectedProductId || editingBannerIndex === null) return;
            const payload = {
                image: bannerForm.image,
                title: bannerForm.title,
                description: bannerForm.description,
            };
            await updateBannerInPageProduct(selectedProductId, editingBannerIndex, payload);
            toast.success("Cập nhật banner content thành công");
            setBannerForm(getInitialBannerState());
            setEditingBannerIndex(null);
            setIsEditingBannerProduct(false);
        } catch (error) {
            console.error(error);
            toast.error("Lỗi khi cập nhật banner content: " + (error?.message || error));
        }
    };

    const handleEditBannerConnect = (productId, connect, index) => {
        setSelectedProductId(productId);
        setBannerConnectForm({
            image: connect.image || "",
            content: connect.content || "",
            mainContent: connect.mainContent || "",
        });
        setEditingBannerConnectIndex(index);
        setIsEditingBannerConnect(true);
    };

    const handleUpdateBannerConnect = async (e) => {
        e.preventDefault();
        try {
            if (!selectedProductId || editingBannerConnectIndex === null) return;
            const payload = {
                image: bannerConnectForm.image,
                content: bannerConnectForm.content,
                mainContent: bannerConnectForm.mainContent,
            };
            await updateBannerConnectInPageProduct(selectedProductId, editingBannerConnectIndex, payload);
            toast.success("Cập nhật banner connect thành công");
            setBannerConnectForm(getInitialBannerConnectState());
            setEditingBannerConnectIndex(null);
            setIsEditingBannerConnect(false);
        } catch (error) {
            console.error(error);
            toast.error("Lỗi khi cập nhật banner connect: " + (error?.message || error));
        }
    };

    /* ==== DELETE ==== */
    const handleDeleteProduct = async () => {
        if (!selectedProductId) return;
        try {
            await deletePageProduct(selectedProductId);
            resetForm();
            toast.success("Xóa danh mục thành công");
        } catch (error) {
            console.error(error);
            toast.error("Xóa danh mục thất bại: " + (error?.message || error));
        }
    };

    const handleDeleteBannerConnect = async (productId, index) => {
        try {
            await deleteBannerConnectFromPageProduct(productId, index);
            toast.success("Xóa banner connect thành công");
        } catch (error) {
            console.error(error);
            toast.error("Xóa banner connect thất bại: " + (error?.message || error));
        }
    };

    /* ==== RESET ==== */
    const resetForm = () => {
        setProductForm(getInitialProductState());
        setBannerForm(getInitialBannerState());
        setBannerConnectForm(getInitialBannerConnectState());
        setImagePreview(null);
        setVideoPreview(null);
        setIsEditingProduct(false);
        setSelectedProductId(null);
        setEditingBannerIndex(null);
        setIsEditingBannerProduct(false);
        setEditingBannerConnectIndex(null);
        setIsEditingBannerConnect(false);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Quản lý Trang sản phẩm</h3>

            {/* FORM DANH MỤC */}
            <form onSubmit={handleSubmit} className="space-y-4 mb-10">
                <h4 className="text-md font-semibold mb-4">
                    {isEditingProduct ? "Cập nhật danh mục" : "Thêm danh mục mới"}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <input
                        type="text"
                        name="name"
                        value={productForm.name}
                        onChange={handleProductChange}
                        placeholder="Tên danh mục"
                        className="px-3 py-2 border rounded-lg"
                    />
                    <input
                        type="text"
                        name="slug"
                        value={productForm.slug}
                        onChange={handleProductChange}
                        placeholder="Slug (đường dẫn)"
                        className="px-3 py-2 border rounded-lg"
                    />
                    <div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                handleProductImageUpload(e.target.files?.[0] || null)
                            }
                        />
                        {imagePreview && (
                            <img
                                src={imagePreview}
                                alt="preview"
                                className="h-40 mt-4 rounded-lg border shadow-md"
                            />
                        )}
                    </div>
                </div>
                <div className="flex justify-end">
                    <button
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                        type="submit"
                    >
                        {isEditingProduct ? "Cập nhật danh mục" : "Thêm danh mục"}
                    </button>
                    {isEditingProduct && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="ml-3 bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500"
                        >
                            Hủy
                        </button>
                    )}
                </div>
            </form>

            {/* DANH SÁCH PRODUCTS */}
            <div>
                <h4 className="text-lg font-semibold mb-4">Trang sản phẩm</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {pageProducts.map((pP) => (
                        <div
                            key={pP._id}
                            className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition"
                        >
                            <div className="relative">
                                <img
                                    src={pP.image}
                                    alt={pP.name}
                                    className="h-40 w-full object-cover rounded-lg"
                                />

                                {/* NÚT + THÊM BANNER */}
                                <AlertDialog
                                    onOpenChange={(open) => {
                                        if (open) {
                                            setSelectedProductId(pP._id);
                                            setBannerForm(getInitialBannerState());
                                            setBannerConnectForm(getInitialBannerConnectState());
                                            setVideoPreview(null);
                                        }
                                    }}
                                >
                                    <AlertDialogTrigger asChild>
                                        <button className="absolute bottom-2 right-2 bg-blue-600 text-white rounded-full w-8 h-8 shadow-lg hover:bg-blue-700 text-xl flex items-center justify-center">
                                            +
                                        </button>
                                    </AlertDialogTrigger>

                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Thêm banner cho {pP.name}
                                            </AlertDialogTitle>
                                        </AlertDialogHeader>

                                        {/* Form: Banner Content + Video */}
                                        <form onSubmit={handleSubmitBanner} className="space-y-5">
                                            <div>
                                                <label className="text-sm text-gray-600 font-medium">
                                                    Video giới thiệu
                                                </label>
                                                <input
                                                    type="file"
                                                    accept="video/*"
                                                    onChange={(e) =>
                                                        handleVideoUpload(e.target.files?.[0] || null)
                                                    }
                                                    className="w-full"
                                                />
                                                {videoPreview && (
                                                    <video
                                                        src={videoPreview}
                                                        controls
                                                        className="h-40 mt-4 rounded-lg border shadow-md"
                                                    />
                                                )}
                                            </div>

                                            <div>
                                                <label className="text-sm text-gray-600 font-medium">
                                                    Banner Content
                                                </label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <input
                                                        type="text"
                                                        name="title"
                                                        value={bannerForm.title}
                                                        onChange={handleBannerChange}
                                                        placeholder="Tiêu đề"
                                                        className="px-3 py-2 border rounded-lg"
                                                    />
                                                    <input
                                                        type="text"
                                                        name="description"
                                                        value={bannerForm.description}
                                                        onChange={handleBannerChange}
                                                        placeholder="Mô tả"
                                                        className="px-3 py-2 border rounded-lg"
                                                    />
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) =>
                                                            handleBannerImageUpload(
                                                                e.target.files?.[0] || null
                                                            )
                                                        }
                                                        className="col-span-2"
                                                    />
                                                </div>
                                            </div>

                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Hủy</AlertDialogCancel>
                                                <button
                                                    type="submit"
                                                    className="bg-green-600 text-white px-4 py-2 rounded-lg"
                                                >
                                                    Thêm Banner Content / Video
                                                </button>
                                            </AlertDialogFooter>
                                        </form>

                                        <hr className="my-4" />

                                        {/* Form: Banner Connect (riêng) */}
                                        <form onSubmit={handleSubmitBannerConnect} className="space-y-5">
                                            <div>
                                                <label className="text-sm text-gray-600 font-medium">
                                                    Banner Connect
                                                </label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <input
                                                        type="text"
                                                        name="content"
                                                        value={bannerConnectForm.content}
                                                        onChange={handleBannerConnectChange}
                                                        placeholder="Tiêu đề"
                                                        className="px-3 py-2 border rounded-lg"
                                                    />
                                                    <input
                                                        type="text"
                                                        name="mainContent"
                                                        value={bannerConnectForm.mainContent}
                                                        onChange={handleBannerConnectChange}
                                                        placeholder="Mô tả"
                                                        className="px-3 py-2 border rounded-lg"
                                                    />
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) =>
                                                            handleBannerConnectImageUpload(
                                                                e.target.files?.[0] || null
                                                            )
                                                        }
                                                        className="col-span-2"
                                                    />
                                                </div>
                                            </div>

                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Hủy</AlertDialogCancel>
                                                <button
                                                    type="submit"
                                                    className="bg-green-600 text-white px-4 py-2 rounded-lg"
                                                >
                                                    Thêm Banner Connect
                                                </button>
                                            </AlertDialogFooter>
                                        </form>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>

                            <div className="p-3">
                                <h5 className="font-semibold">{pP.name}</h5>
                                <p className="text-sm text-gray-500">{pP.slug}</p>

                                {/* DANH SÁCH BANNER */}
                                <div className="mt-4 space-y-3">
                                    {/* Video */}
                                    {pP.bannerVideo?.url && (
                                        <div className="border rounded p-2 bg-gray-50 relative">
                                            <h6 className="font-medium text-sm mb-1">🎥 Video banner</h6>
                                            <video src={pP.bannerVideo.url} controls className="w-full h-32 rounded" />

                                            <div className="absolute top-2 right-2">
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <button className="text-red-600 text-xs">Xóa</button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Xóa Banner Video?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Bạn có chắc muốn xóa video banner này? Hành động không thể hoàn tác.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                                                            <button
                                                                onClick={() => deleteBannerFromPageProduct(pP._id, { removeVideo: true })}
                                                                className="bg-red-600 text-white px-4 py-2 rounded-lg"
                                                            >
                                                                Xóa
                                                            </button>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </div>
                                    )}

                                    {/* Banner Content */}
                                    {Array.isArray(pP.bannerContent) &&
                                        pP.bannerContent.map((content, index) => (
                                            <div key={index} className={`border rounded p-3 relative ${content.bg || ""}`}>
                                                <h6 className="font-medium text-sm mb-2">📌 Banner content {index + 1}</h6>
                                                {content.image && (
                                                    <img src={content.image} alt={content.title || "banner"} className="w-full h-24 object-cover rounded mb-2" />
                                                )}
                                                <div className="font-bold text-xl">{content.title}</div>
                                                <div className="text-gray-700">{content.description}</div>

                                                <div className="flex justify-between items-center mt-4">
                                                    <button
                                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                                        onClick={() => handleEditBannerProduct(pP._id, content, index)}
                                                    >
                                                        Sửa
                                                    </button>

                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <button className="text-red-600 text-xs">Xóa</button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Xóa Banner content?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Bạn có chắc chắn muốn xóa banner này? Hành động này không thể hoàn tác.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Hủy</AlertDialogCancel>
                                                                <button
                                                                    onClick={() => deleteBannerFromPageProduct(pP._id, { index })}
                                                                    className="bg-red-600 text-white px-4 py-2 rounded-lg"
                                                                >
                                                                    Xóa
                                                                </button>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </div>
                                        ))}

                                    {/* Banner Connect */}
                                    {Array.isArray(pP.bannerConnect) &&
                                        pP.bannerConnect.map((connect, index) => (
                                            <div key={index} className="border rounded p-3 relative bg-gray-50">
                                                <h6 className="font-medium text-sm mb-2">🔗 Banner Connect {index + 1}</h6>
                                                {connect.image && (
                                                    <img src={connect.image} alt={connect.content || "connect"} className="w-full h-24 object-cover rounded mb-2" />
                                                )}
                                                <div className="font-semibold">{connect.content}</div>
                                                <div className="text-gray-600">{connect.mainContent}</div>

                                                <div className="flex justify-between items-center mt-3">
                                                    <button
                                                        className="text-blue-600 text-sm"
                                                        onClick={() => handleEditBannerConnect(pP._id, connect, index)}
                                                    >
                                                        Sửa
                                                    </button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <button className="text-red-600 text-xs">Xóa</button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Xóa Banner connect?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Bạn có chắc chắn muốn xóa banner này? Hành động này không thể hoàn tác.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Hủy</AlertDialogCancel>
                                                                <button
                                                                    onClick={() => handleDeleteBannerConnect(pP._id, index)}

                                                                    className="bg-red-600 text-white px-4 py-2 rounded-lg"
                                                                >
                                                                    Xóa
                                                                </button>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>


                                                </div>
                                            </div>
                                        ))}
                                </div>

                                <div className="flex justify-between items-center mt-4">
                                    <button
                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                        onClick={() => handleEditProduct(pP)}
                                    >
                                        Sửa
                                    </button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <button
                                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                                                onClick={() => setSelectedProductId(pP._id)}
                                            >
                                                Xóa
                                            </button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Xóa danh mục?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Bạn có chắc chắn muốn xóa <b>{pP.name}</b>? Hành động này không thể hoàn tác.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Hủy</AlertDialogCancel>
                                                <button onClick={handleDeleteProduct} className="bg-red-600 text-white px-4 py-2 rounded-lg">
                                                    Xóa
                                                </button>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Edit Banner Content Modal (controlled) */}
            {isEditingBannerProduct && (
                <AlertDialog
                    open={isEditingBannerProduct}
                    onOpenChange={(open) => {
                        if (!open) {
                            setIsEditingBannerProduct(false);
                            setEditingBannerIndex(null);
                            setBannerForm(getInitialBannerState());
                        }
                    }}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Chỉnh sửa banner</AlertDialogTitle>
                        </AlertDialogHeader>
                        <form onSubmit={handleUpdateBanner} className="space-y-4">
                            <input
                                type="text"
                                name="title"
                                value={bannerForm.title}
                                onChange={handleBannerChange}
                                placeholder="Tiêu đề"
                                className="px-3 py-2 border rounded-lg w-full"
                            />
                            <input
                                type="text"
                                name="description"
                                value={bannerForm.description}
                                onChange={handleBannerChange}
                                placeholder="Mô tả"
                                className="px-3 py-2 border rounded-lg w-full"
                            />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleBannerImageUpload(e.target.files?.[0] || null)}
                            />
                            {bannerForm.image && (
                                <img src={bannerForm.image} alt="preview" className="h-32 mt-2 rounded-lg border shadow-md" />
                            )}
                            <AlertDialogFooter>
                                <AlertDialogCancel>Hủy</AlertDialogCancel>
                                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg">
                                    Cập nhật
                                </button>
                            </AlertDialogFooter>
                        </form>
                    </AlertDialogContent>
                </AlertDialog>
            )}

            {/* Edit Banner Connect Modal (controlled) */}
            {isEditingBannerConnect && (
                <AlertDialog
                    open={isEditingBannerConnect}
                    onOpenChange={(open) => {
                        if (!open) {
                            setIsEditingBannerConnect(false);
                            setEditingBannerConnectIndex(null);
                            setBannerConnectForm(getInitialBannerConnectState());
                        }
                    }}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Chỉnh sửa Banner Connect</AlertDialogTitle>
                        </AlertDialogHeader>
                        <form onSubmit={handleUpdateBannerConnect} className="space-y-4">
                            <input
                                type="text"
                                name="content"
                                value={bannerConnectForm.content}
                                onChange={handleBannerConnectChange}
                                placeholder="Tiêu đề"
                                className="px-3 py-2 border rounded-lg w-full"
                            />
                            <input
                                type="text"
                                name="mainContent"
                                value={bannerConnectForm.mainContent}
                                onChange={handleBannerConnectChange}
                                placeholder="Mô tả"
                                className="px-3 py-2 border rounded-lg w-full"
                            />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleBannerConnectImageUpload(e.target.files?.[0] || null)}
                            />
                            {bannerConnectForm.image && (
                                <img src={bannerConnectForm.image} alt="preview" className="h-24 rounded border mt-2" />
                            )}
                            <AlertDialogFooter>
                                <AlertDialogCancel>Hủy</AlertDialogCancel>
                                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg">
                                    Cập nhật
                                </button>
                            </AlertDialogFooter>
                        </form>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
    );
};

export default PageProductsManagement;
