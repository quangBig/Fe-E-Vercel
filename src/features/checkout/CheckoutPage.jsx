import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { useCartStore } from "../../stores/useCartStore";
import { useOrderStore } from "../../stores/useOrderStore";
import { toast } from "react-toastify";

const CheckoutPage = () => {
    const { cart, getCart, clearCart } = useCartStore();
    const { createOrder, checkoutWithMomo } = useOrderStore();

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        district: "",
        ward: "",
        paymentMethod: "cod",
        note: "",
    });

    const orderItems = cart?.items || [];

    // fetch provinces
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const res = await fetch("https://provinces.open-api.vn/api/?depth=3");
                const data = await res.json();
                setProvinces(data);
            } catch (err) {
                console.error("Lỗi fetch provinces:", err);
            }
        };

        fetchProvinces();
    }, []);

    // init AOS + get cart
    useEffect(() => {
        AOS.init({ duration: 800, easing: "ease-in-out", once: true, offset: 100 });
        getCart();
    }, [getCart]);

    // handle input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // change province
    const handleProvinceChange = (e) => {
        const provinceCode = Number(e.target.value);
        const selectedProvince = provinces.find((p) => p.code === provinceCode);

        setFormData((prev) => ({
            ...prev,
            city: provinceCode,
            district: "",
            ward: "",
        }));

        setDistricts(selectedProvince?.districts || []);
        setWards([]);
    };

    // change district
    const handleDistrictChange = (e) => {
        const districtCode = Number(e.target.value);
        const selectedDistrict = districts.find((d) => d.code === districtCode);

        setFormData((prev) => ({
            ...prev,
            district: districtCode,
            ward: "",
        }));

        setWards(selectedDistrict?.wards || []);
    };

    // tính tiền
    const calculateSubtotal = () => {
        return orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };
    const calculateTotal = () => calculateSubtotal() + 50000;
    const formatPrice = (price) => new Intl.NumberFormat("vi-VN").format(price);

    // submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        // --- VALIDATE ---
        if (!formData.firstName || !formData.lastName) {
            toast.warning("Vui lòng nhập họ tên!");
            return;
        }
        if (!formData.email.includes("@")) {
            toast.warning("Email không hợp lệ!");
            return;
        }
        if (!/^\d{9,11}$/.test(formData.phone)) {
            toast.warning("SĐT không hợp lệ!");
            return;
        }
        if (!formData.address) {
            toast.warning("Vui lòng nhập địa chỉ!");
            return;
        }
        if (!formData.city || !formData.district || !formData.ward) {
            toast.warning("Vui lòng chọn đầy đủ Tỉnh/TP, Quận/Huyện, Phường/Xã!");
            return;
        }
        if (orderItems.length === 0) {
            toast.warning("Giỏ hàng trống!");
            return;
        }

        // --- MAP ORDER DATA ---
        const province = provinces.find((p) => p.code === Number(formData.city));
        const district = districts.find((d) => d.code === Number(formData.district));
        const ward = wards.find((w) => w.name === formData.ward);

        const orderData = {
            items: orderItems.map((item) => ({
                productId: item.productId,
                variantName: item.variantName,
                color: item.color,
                quantity: item.quantity,
                price: item.price,
                originalPrice: item.originalPrice,
                image: item.image,
            })),
            shippingAddress: {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phoneNumber: formData.phone,
                address: formData.address,
                provinceCode: Number(formData.city),
                provinceName: province?.name || "",
                districtCode: Number(formData.district),
                districtName: district?.name || "",
                wardCode: ward?.code || "",
                wardName: ward?.name || "",
            },
            payment: {
                method: formData.paymentMethod,
                status: "pending",
            },
            note: formData.note,
            shippingFee: 50000,
            subtotal: calculateSubtotal(),
            total: calculateTotal(),
            status: "pending",
        };

        try {
            const order = await createOrder(orderData);
            //MOMO
            if (formData.paymentMethod === "momo") {
                await checkoutWithMomo(order._id)
            } else {
                //COD
                await clearCart();
                toast.success("Đặt hàng thành công!");
            }
        } catch (error) {
            console.error(error);
            toast.error("Đặt hàng thất bại!");
        }
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 text-black">
            <Header />

            {/* Breadcrumb */}
            <div className="max-w-7xl mx-auto px-4 py-4" data-aos="fade-down">
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
                                <Link to="/cart" className="text-gray-700 hover:text-gray-900">
                                    Giỏ hàng
                                </Link>
                            </div>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <span className="mx-2 text-gray-400">/</span>
                                <span className="text-gray-500">Thanh toán</span>
                            </div>
                        </li>
                    </ol>
                </nav>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8" data-aos="fade-up">
                    Thanh toán
                </h1>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form bên trái */}
                    <div className="lg:col-span-2 space-y-8" data-aos="fade-right" data-aos-delay="200">
                        {/* Thông tin khách hàng */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Thông tin khách hàng</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    placeholder="Họ và tên đệm"
                                    className="w-full px-4 py-3 border rounded-lg"
                                />
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    placeholder="Tên"
                                    className="w-full px-4 py-3 border rounded-lg"
                                />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Email"
                                    className="w-full px-4 py-3 border rounded-lg"
                                />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="Số điện thoại"
                                    className="w-full px-4 py-3 border rounded-lg"
                                />
                            </div>
                        </div>

                        {/* Địa chỉ */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Địa chỉ giao hàng</h2>
                            <div className="space-y-6">
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    placeholder="Số nhà, tên đường..."
                                    className="w-full px-4 py-3 border rounded-lg"
                                />
                                <select name="city" value={formData.city} onChange={handleProvinceChange} className="w-full px-4 py-3 border rounded-lg">
                                    <option value="">Chọn Tỉnh/TP</option>
                                    {provinces.map((p) => (
                                        <option key={p.code} value={p.code}>
                                            {p.name}
                                        </option>
                                    ))}
                                </select>
                                <select name="district" value={formData.district} onChange={handleDistrictChange} className="w-full px-4 py-3 border rounded-lg">
                                    <option value="">Chọn Quận/Huyện</option>
                                    {districts.map((d) => (
                                        <option key={d.code} value={d.code}>
                                            {d.name}
                                        </option>
                                    ))}
                                </select>
                                <select name="ward" value={formData.ward} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-lg">
                                    <option value="">Chọn Phường/Xã</option>
                                    {wards.map((w) => (
                                        <option key={w.code} value={w.name}>
                                            {w.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Thanh toán */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Phương thức thanh toán</h2>
                            <label className="flex items-center p-4 border rounded-lg cursor-pointer">
                                <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === "cod"} onChange={handleInputChange} />
                                <span className="ml-3">Thanh toán khi nhận hàng (COD)</span>
                            </label>
                            <label className="flex items-center p-4 border rounded-lg cursor-pointer mt-3">
                                <input type="radio" name="paymentMethod" value="momo" checked={formData.paymentMethod === "momo"} onChange={handleInputChange} />
                                <span className="ml-3">Ví MoMo</span>
                            </label>
                        </div>

                        {/* Ghi chú */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Ghi chú đơn hàng</h2>
                            <textarea
                                name="note"
                                value={formData.note}
                                onChange={handleInputChange}
                                rows="3"
                                placeholder="Ghi chú..."
                                className="w-full px-4 py-3 border rounded-lg"
                            ></textarea>
                        </div>
                    </div>

                    {/* Tóm tắt đơn hàng */}
                    <div className="lg:col-span-1" data-aos="fade-left" data-aos-delay="400">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Tóm tắt đơn hàng</h2>
                            <div className="space-y-4 mb-6">
                                {orderItems.map((item, index) => (
                                    <div
                                        key={`${item.productId}-${item.variantName || ""}-${item.color || ""}-${index}`}
                                        className="flex items-center space-x-4"
                                    >
                                        <img src={item.image} alt={item.variantName || item.color || "Sản phẩm"} className="w-16 h-16 object-contain rounded-lg" />
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900">{item.variantName || item.color || "Sản phẩm"}</h3>
                                            <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                                            <p className="text-sm font-semibold text-gray-900">{formatPrice(item.price)}₫</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Tổng */}
                            <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between text-gray-600">
                                    <span>Tạm tính:</span>
                                    <span>{formatPrice(calculateSubtotal())}₫</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Phí vận chuyển:</span>
                                    <span>50,000₫</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg text-gray-900 border-t pt-3">
                                    <span>Tổng cộng:</span>
                                    <span>{formatPrice(calculateTotal())}₫</span>
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-lg mt-6 hover:bg-blue-700 transition">
                                Đặt hàng ngay
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <Footer />
        </div>
    );
};

export default CheckoutPage;
