import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { toast } from "react-toastify";

import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { useAuthStore } from "../../stores/useAuthStore";
import { useCartStore } from "../../stores/useCartStore";

const CartPage = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();

    // Lấy store cart
    const { cart, getCart, updateQuantity, removeItem, clearCart } = useCartStore();

    // Load giỏ hàng khi vào page
    useEffect(() => {
        AOS.init({ duration: 800, easing: "ease-in-out", once: true, offset: 100 });
        if (user) getCart();
    }, [user, getCart]);

    const cartItems = cart?.items || [];

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const calculateDiscount = () => {
        return cartItems.reduce((total, item) => total + (item.originalPrice - item.price) * item.quantity, 0);
    };

    const calculateTotal = () => {
        return calculateSubtotal() + 50000; // phí vận chuyển
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN").format(price);
    };

    const handleCheckout = () => {
        if (!user) navigate("/login");
        else navigate("/checkout");
    };

    if (cartItems.length === 0) {
        return (
            <div className="w-full min-h-screen bg-gray-50 mt-20">
                <Header />
                <div className="max-w-7xl mx-auto px-4 py-16">
                    <div className="text-center" data-aos="fade-up">
                        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-3xl">🛒</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Giỏ hàng trống</h1>
                        <p className="text-gray-600 mb-8">Bạn chưa có sản phẩm nào trong giỏ hàng</p>
                        <Link
                            to="/"
                            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                        >
                            Tiếp tục mua sắm
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gray-50">
            <Header />
            {/* Breadcrumb */}
            <div className="max-w-7xl mx-auto px-4 py-4" data-aos="fade-down">
                <nav className="flex" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-3">
                        <li className="inline-flex items-center">
                            <Link to="/" className="text-gray-700 hover:text-gray-900">Trang chủ</Link>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <span className="mx-2 text-gray-400">/</span>
                                <span className="text-gray-500">Giỏ hàng</span>
                            </div>
                        </li>
                    </ol>
                </nav>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8" data-aos="fade-up">Giỏ hàng</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4" data-aos="fade-right" data-aos-delay="200">
                        {cartItems.map((item, index) => (
                            <div
                                key={item.productId + item.variantName + item.color}
                                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
                                data-aos="fade-up"
                                data-aos-delay={300 + index * 100}
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="flex-shrink-0">
                                        <img src={item.image} alt={item.variantName || item.color || "product"} className="w-20 h-20 object-contain rounded-lg" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.variantName || item.color || "Sản phẩm"}</h3>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-lg font-bold text-green-600">{formatPrice(item.price)}₫</span>
                                                    {item.originalPrice > item.price && (
                                                        <span className="text-sm text-gray-500 line-through">{formatPrice(item.originalPrice)}₫</span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-4">
                                                <div className="flex items-center border border-gray-300 rounded-lg">
                                                    <button
                                                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                        className="px-3 py-2 hover:bg-gray-100 transition-colors duration-200"
                                                    >
                                                        -
                                                    </button>

                                                    <span className="px-4 py-2 border-x border-gray-300 bg-white font-medium">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                        className="px-3 py-2 hover:bg-gray-100 transition-colors duration-200"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => removeItem(item.productId)}
                                                    className="text-red-600 hover:text-red-800 transition-colors duration-200"
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <div className="flex justify-between text-sm text-gray-600">
                                                <span>Tổng tiền sản phẩm:</span>
                                                <span className="font-semibold">{formatPrice(item.price * item.quantity)}₫</span>
                                            </div>
                                            {item.originalPrice > item.price && (
                                                <div className="flex justify-between text-sm text-green-600 mt-1">
                                                    <span>Tiết kiệm:</span>
                                                    <span>{formatPrice((item.originalPrice - item.price) * item.quantity)}₫</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1" data-aos="fade-left" data-aos-delay="400">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Tóm tắt đơn hàng</h2>

                            <div className="space-y-4">
                                <div className="flex justify-between text-gray-600">
                                    <span>Tạm tính ({cartItems.length} sản phẩm):</span>
                                    <span>{formatPrice(calculateSubtotal())}₫</span>
                                </div>

                                {calculateDiscount() > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Giảm giá:</span>
                                        <span>-{formatPrice(calculateDiscount())}₫</span>
                                    </div>
                                )}

                                <div className="flex justify-between text-gray-600">
                                    <span>Phí vận chuyển:</span>
                                    <span>50,000₫</span>
                                </div>

                                <div className="border-t border-gray-200 pt-4">
                                    <div className="flex justify-between text-lg font-bold text-gray-900">
                                        <span>Tổng cộng:</span>
                                        <span>{formatPrice(calculateTotal())}₫</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 space-y-3">
                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                                >
                                    Tiến hành thanh toán
                                </button>
                                <button
                                    onClick={async () => {
                                        try {
                                            await clearCart(); // xóa giỏ
                                            toast.success("Xóa toàn bộ giỏ hàng thành công"); // thông báo sau khi xóa xong
                                        } catch (err) {
                                            toast.error("Xóa giỏ hàng thất bại");
                                        }
                                    }}
                                    className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium"
                                >
                                    Xóa toàn bộ giỏ hàng
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default CartPage;
