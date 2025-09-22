import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { toast } from "react-toastify";

import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import OtherProducts from "../../components/sections/OtherProducts";
import { useProductStore } from "../../stores/useProductStore";
import { useAuthStore } from "../../stores/useAuthStore";
import PromotionBox from "./components/offers";
import { useCartStore } from "../../stores/useCartStore";

const ProductDetailPage = () => {
    const { productId } = useParams();
    const { products } = useProductStore();
    const { user } = useAuthStore();
    const { addToCart } = useCartStore();
    const navigate = useNavigate();

    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedVariant, setSelectedVariant] = useState(0);
    const [selectedColor, setSelectedColor] = useState(0);
    const [quantity, setQuantity] = useState(1);



    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: "ease-in-out",
            once: true,
            offset: 100,
        });
    }, []);

    const product = products.find((p) => p._id === productId);

    if (!product) {
        return (
            <div className="w-full min-h-screen bg-white text-black">
                <Header />
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center" data-aos="fade-up">
                        <h1 className="text-2xl font-bold mb-4">
                            Sản phẩm không tồn tại hoặc đang được cập nhật!
                        </h1>
                        <Link to="/" className="text-blue-600 hover:underline">
                            Quay về trang chủ
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    // helpers
    const parsePrice = (raw) => {
        if (raw === null || raw === undefined) return 0;
        const s = String(raw).replace(/[^\d.-]/g, "");
        return Number(s) || 0;
    };
    const formatPrice = (n) => {
        return Number(n || 0).toLocaleString();
    };

    const variant = product.variants?.[selectedVariant];
    const color = variant?.colors?.[selectedColor];

    const getPriceInfo = () => {
        const colorPrice = color ? parsePrice(color.price) : 0;
        const variantPrice = variant ? parsePrice(variant.price) : 0;
        const basePrice = colorPrice || variantPrice || parsePrice(product.price) || 0;

        const colorDiscounted = color ? Number(color.discountedPrice) || 0 : 0;
        const variantDiscounted = variant ? Number(variant.discountedPrice) || 0 : 0;

        if (color && colorDiscounted && colorDiscounted < colorPrice) {
            return {
                original: colorPrice,
                discounted: colorDiscounted,
                percent:
                    color.price && color.discountPercent
                        ? Number(color.discountPercent)
                        : Math.round(((colorPrice - colorDiscounted) / colorPrice) * 100) || 0,
            };
        }

        if (variant && variantDiscounted && variantDiscounted < variantPrice) {
            return {
                original: variantPrice,
                discounted: variantDiscounted,
                percent:
                    variant.price && variant.discountPercent
                        ? Number(variant.discountPercent)
                        : Math.round(((variantPrice - variantDiscounted) / variantPrice) * 100) || 0,
            };
        }

        return { original: basePrice, discounted: 0, percent: 0 };
    };

    const priceInfo = getPriceInfo();



    const handleAddToCart = async () => {
        if (!user) {
            toast.warning("Bạn cần đăng nhập trước khi thêm vào giỏ hàng!");
            navigate("/login");
            return;
        }

        try {
            const res = await addToCart({
                productId: product._id,
                variantName: variant?.name || "",
                color: color?.name || "",
                quantity,
                price: priceInfo.discounted || priceInfo.original,
                originalPrice: priceInfo.original,
                image: color?.image || product.images?.[0],
            });


            console.log("Cart updated:", res);
        } catch (error) {
            console.error("Add to cart error:", error);
        }
    };




    const handleBuyNow = () => {
        if (!user) {
            toast.warning("Bạn cần đăng nhập trước khi mua hàng!");
            navigate("/login");
            return;
        }

        navigate("/checkout", {
            state: {
                productId: product._id,
                quantity,
                variant: variant?._id,
                color: color?.value,
            },
        });
    };

    return (
        <div className="w-full min-h-screen bg-white text-black">
            <Header />

            {/* Breadcrumb */}
            <div className="max-w-7xl mx-auto px-4 py-4 mt-20" data-aos="fade-down">
                <nav className="flex" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-3">
                        <li className="inline-flex items-center">
                            <Link to="/" className="text-gray-700 hover:text-gray-900">
                                Trang chủ
                            </Link>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <span className="mx-2 text-gray-400">/</span>
                                <Link
                                    to={`/${(product.category || "").toLowerCase()}`}
                                    className="text-gray-700 hover:text-gray-900"
                                >
                                    {product.category}
                                </Link>
                            </div>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <span className="mx-2 text-gray-400">/</span>
                                <span className="text-gray-500">{product.name}</span>
                            </div>
                        </li>
                    </ol>
                </nav>
            </div>

            {/* Product Detail */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Images */}
                    <div className="space-y-4" data-aos="fade-right" data-aos-delay="200">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center justify-center">
                            <img
                                src={color?.image || product.images?.[selectedImage]}
                                alt={product.name}
                                className="w-full h-full object-contain transform hover:scale-105 transition-transform duration-300"
                            />
                        </div>

                        <div className="flex space-x-2" data-aos="fade-up" data-aos-delay="400">
                            {product.images?.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 hover:scale-110 ${selectedImage === index
                                        ? "border-blue-500 shadow-lg"
                                        : "border-gray-200 hover:border-gray-300"
                                        }`}
                                >
                                    <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="space-y-6" data-aos="fade-left" data-aos-delay="300">
                        <div data-aos="fade-up" data-aos-delay="400">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                            <div className="flex items-center space-x-4">
                                {priceInfo.discounted ? (
                                    <>
                                        <div className="flex items-baseline gap-3">
                                            <span className="text-sm text-gray-500 line-through">
                                                {formatPrice(priceInfo.original)}₫
                                            </span>
                                            <span className="text-3xl font-bold text-red-600">
                                                {formatPrice(priceInfo.discounted)}₫
                                            </span>
                                        </div>
                                        <div className="ml-2 px-2 py-1 bg-red-100 text-red-600 rounded text-sm font-semibold">
                                            -{priceInfo.percent}%
                                        </div>
                                    </>
                                ) : (
                                    <span className="text-3xl font-bold text-green-600">
                                        {formatPrice(priceInfo.original)}₫
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Variant selection */}
                        {product.variants && product.variants.length > 0 && (
                            <div data-aos="fade-up" data-aos-delay="450">
                                <h3 className="text-lg font-semibold mb-3">Phiên bản</h3>
                                <div className="flex flex-wrap gap-3">
                                    {product.variants.map((v, idx) => {
                                        const vPrice = parsePrice(v.price);
                                        const vDiscounted = Number(v.discountedPrice) || 0;
                                        const showVariantDiscount = vDiscounted && vDiscounted < vPrice;
                                        const vPercent =
                                            v.discountPercent ??
                                            (vPrice && vDiscounted
                                                ? Math.round(((vPrice - vDiscounted) / vPrice) * 100)
                                                : 0);

                                        return (
                                            <button
                                                key={v._id || idx}
                                                onClick={() => {
                                                    setSelectedVariant(idx);
                                                    setSelectedColor(0);
                                                }}
                                                className={`block border-2 rounded-lg p-3 min-w-[180px] text-left transition-all duration-300 ${selectedVariant === idx
                                                    ? "border-red-500 bg-red-50"
                                                    : "border-gray-200 hover:border-gray-300"
                                                    }`}
                                            >
                                                <div className="font-semibold mb-1">{v.name}</div>
                                                <div className="text-xs text-gray-500 mb-1">{v.config}</div>
                                                <div className="text-sm font-bold">
                                                    {showVariantDiscount ? (
                                                        <span className="flex items-baseline gap-2">
                                                            <span className="text-sm line-through text-gray-500">
                                                                {formatPrice(vPrice)}₫
                                                            </span>
                                                            <span className="text-base text-red-600">
                                                                {formatPrice(vDiscounted)}₫
                                                            </span>
                                                            <span className="ml-2 text-xs text-red-600">
                                                                -{vPercent}%
                                                            </span>
                                                        </span>
                                                    ) : (
                                                        <span>{formatPrice(vPrice)}₫</span>
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Color selection */}
                        {variant?.colors && variant.colors.length > 0 && (
                            <div data-aos="fade-up" data-aos-delay="500">
                                <h3 className="text-lg font-semibold mb-3">Màu sắc</h3>
                                <div className="flex flex-wrap gap-3">
                                    {variant.colors.map((c, idx) => {
                                        const cPrice = parsePrice(c.price) || parsePrice(variant.price);
                                        const cDiscounted = Number(c.discountedPrice) || 0;
                                        const showColorDiscount = cDiscounted && cDiscounted < cPrice;
                                        const cPercent =
                                            c.discountPercent ??
                                            (cPrice && cDiscounted
                                                ? Math.round(((cPrice - cDiscounted) / cPrice) * 100)
                                                : 0);

                                        return (
                                            <button
                                                key={c.value || idx}
                                                onClick={() => setSelectedColor(idx)}
                                                className={`flex flex-col items-center border-2 rounded-lg p-3 min-w-[120px] transition-all duration-300 ${selectedColor === idx
                                                    ? "border-red-500 bg-red-50"
                                                    : "border-gray-200 hover:border-gray-300"
                                                    }`}
                                            >
                                                <img src={c.image} alt={c.name} className="w-10 h-10 mb-2 rounded" />
                                                <span className="font-medium text-gray-700 mb-1">{c.name}</span>
                                                <span className="text-xs">
                                                    {showColorDiscount ? (
                                                        <span className="flex items-baseline gap-2">
                                                            <span className="text-xs line-through text-gray-500">
                                                                {formatPrice(cPrice)}₫
                                                            </span>
                                                            <span className="text-sm text-red-600">
                                                                {formatPrice(cDiscounted)}₫
                                                            </span>
                                                            <span className="ml-1 text-xs text-red-600">
                                                                -{cPercent}%
                                                            </span>
                                                        </span>
                                                    ) : (
                                                        <span>{formatPrice(cPrice)}₫</span>
                                                    )}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Quantity + Actions */}
                        <div className="space-y-4" data-aos="fade-up" data-aos-delay="600">
                            <div className="flex items-center space-x-4">
                                <label className="font-medium">Số lượng:</label>
                                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-3 py-2 hover:bg-gray-100 transition-colors duration-200 font-bold"
                                    >
                                        -
                                    </button>
                                    <span className="px-4 py-2 border-x border-gray-300 bg-white font-medium">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="px-3 py-2 hover:bg-gray-100 transition-colors duration-200 font-bold"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="flex space-x-4">
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 font-medium shadow-lg hover:shadow-xl"
                                >
                                    Thêm vào giỏ hàng
                                </button>
                                <button
                                    onClick={handleBuyNow}
                                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 font-medium shadow-lg hover:shadow-xl"
                                >
                                    Mua ngay
                                </button>
                            </div>
                        </div>

                        {/* Description + Promotion */}
                        <div data-aos="fade-up" data-aos-delay="700">
                            <PromotionBox />

                            <div className="mt-8" data-aos="fade-up" data-aos-delay="800">
                                <h2 className="text-2xl font-bold text-center mb-8">Tính năng nổi bật</h2>
                                <div className="bg-gradient-to-br from-pink-200 to-orange-100 rounded-xl p-6 shadow-md">
                                    <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                        {product?.Outstandingfeatures ? (
                                            product.Outstandingfeatures.split(",").map((feature, index) => (
                                                <li key={index}>{feature.trim()}</li>
                                            ))
                                        ) : (
                                            <li>Đang tải tính năng...</li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <OtherProducts excludeId={productId} />
            <Footer />
        </div>
    );
};

export default ProductDetailPage;
