import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { useAuthStore } from "../../stores/useAuthStore";
import { toast } from "react-toastify";


const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreeToTerms: false,
        receiveNewsletter: true
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const register = useAuthStore((state) => state.register);
    const loading = useAuthStore((state) => state.loading);
    const navigate = useNavigate();

    // Initialize AOS
    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: "ease-in-out",
            once: true,
            offset: 100
        });
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Check password strength
        if (name === 'password') {
            let strength = 0;
            if (value.length >= 8) strength++;
            if (/[a-z]/.test(value)) strength++;
            if (/[A-Z]/.test(value)) strength++;
            if (/[0-9]/.test(value)) strength++;
            if (/[^A-Za-z0-9]/.test(value)) strength++;
            setPasswordStrength(strength);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const phoneRegex = /^(\+84|0)[3|5|7|8|9][0-9]{8}$/;
        if (!formData.phone) {
            toast.error("Vui lòng nhập số điện thoại!");
            return;
        }
        if (!phoneRegex.test(formData.phone)) {
            toast.error("Số điện thoại không hợp lệ! Vui lòng nhập số điện thoại Việt Nam (10-11 số).");
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            toast.warning("Mật khẩu xác nhận không khớp!");
            return;
        }

        if (!formData.agreeToTerms) {
            toast.warning("Vui lòng đồng ý với điều khoản sử dụng!");
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

        if (!passwordRegex.test(formData.password)) {
            toast.error("Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt!");
            return;
        }

        try {
            await register({

                name: formData.name,
                email: formData.email,
                phonenumber: formData.phone,
                password: formData.password,
                confirmpassword: formData.confirmPassword
            });

            navigate("/login");
        } catch (error) {
            toast.error("Đăng ký thất bại")
        }
    };

    const handleSocialRegister = (provider) => {
        // Xử lý đăng ký bằng mạng xã hội
        console.log(`Register with ${provider}`);
        toast.success(`Đang đăng ký bằng ${provider}...`);
    };

    const getPasswordStrengthColor = () => {
        if (passwordStrength <= 9) return "bg-red-500";
        if (passwordStrength <= 12) return "bg-yellow-500";
        if (passwordStrength <= 15) return "bg-blue-500";
        return "bg-green-500";
    };

    const getPasswordStrengthText = () => {
        if (passwordStrength <= 9) return "Yếu";
        if (passwordStrength <= 12) return "Trung bình";
        if (passwordStrength <= 15) return "Khá";
        return "Mạnh";
    };

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 text-black">
            <Header />

            {/* Breadcrumb */}
            <div className="max-w-7xl mx-auto px-4 py-4" data-aos="fade-down">
                <nav className="flex" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-3">
                        <li className="inline-flex items-center">
                            <Link to="/" className="text-gray-700 hover:text-gray-900 transition-colors duration-200">
                                Trang chủ
                            </Link>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <span className="mx-2 text-gray-400">/</span>
                                <span className="text-gray-500">Đăng ký</span>
                            </div>
                        </li>
                    </ol>
                </nav>
            </div>

            <div className="max-w-lg mx-auto px-4 py-12">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20" data-aos="fade-up" data-aos-delay="200">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <span className="text-3xl">👤</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-3">Đăng ký tài khoản</h1>
                        <p className="text-gray-600 text-lg">Tạo tài khoản mới để bắt đầu mua sắm</p>
                    </div>

                    {/* Social Register Buttons */}
                    <div className="space-y-4 mb-8">
                        <button
                            onClick={() => handleSocialRegister('Google')}
                            className="w-full flex items-center justify-center space-x-3 bg-white border-2 border-gray-200 rounded-xl px-6 py-4 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg"
                        >
                            <svg className="w-6 h-6" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            <span className="text-gray-700 font-semibold text-lg">Đăng ký với Google</span>
                        </button>

                        <button
                            onClick={() => handleSocialRegister('Facebook')}
                            className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl px-6 py-4 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
                        >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            <span className="font-semibold text-lg">Đăng ký với Facebook</span>
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="relative mb-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white/80 text-gray-500 font-medium">hoặc đăng ký bằng email</span>
                        </div>
                    </div>

                    {/* Register Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">


                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Tên *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-lg"
                                placeholder="Tên"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Email *
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-lg"
                                placeholder="example@email.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Số điện thoại *
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-lg"
                                placeholder="0123456789"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Mật khẩu *
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-4 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-lg"
                                    placeholder="Tối thiểu 8 ký tự"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-blue-600 transition-colors duration-200"
                                >
                                    {showPassword ? (
                                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>

                            {/* Password Strength Indicator */}
                            {formData.password && (
                                <div className="mt-3">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                                                style={{ width: `${(passwordStrength / 5) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-medium text-gray-600">{getPasswordStrengthText()}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Xác nhận mật khẩu *
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-4 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-lg"
                                    placeholder="Nhập lại mật khẩu"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-blue-600 transition-colors duration-200"
                                >
                                    {showConfirmPassword ? (
                                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>

                            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                <p className="mt-2 text-sm text-red-600 font-medium">Mật khẩu xác nhận không khớp</p>
                            )}
                        </div>

                        <div className="space-y-4">
                            <label className="flex items-start">
                                <input
                                    type="checkbox"
                                    name="agreeToTerms"
                                    checked={formData.agreeToTerms}
                                    onChange={handleInputChange}
                                    className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-lg mt-1"
                                />
                                <span className="ml-3 text-gray-700 font-medium">
                                    Tôi đồng ý với{" "}
                                    <Link to="/terms" className="text-blue-600 hover:text-blue-800 transition-colors duration-200">
                                        Điều khoản sử dụng
                                    </Link>{" "}
                                    và{" "}
                                    <Link to="/privacy" className="text-blue-600 hover:text-blue-800 transition-colors duration-200">
                                        Chính sách bảo mật
                                    </Link>{" "}
                                    *
                                </span>
                            </label>

                            <label className="flex items-start">
                                <input
                                    type="checkbox"
                                    name="receiveNewsletter"
                                    checked={formData.receiveNewsletter}
                                    onChange={handleInputChange}
                                    className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-lg mt-1"
                                />
                                <span className="ml-3 text-gray-700 font-medium">
                                    Tôi muốn nhận thông tin về sản phẩm mới và khuyến mãi qua email
                                </span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 px-6 rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            disabled={loading}
                        >
                            {loading ? "Đang đăng ký..." : "Đăng ký"}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-8 text-center">
                        <p className="text-gray-600 text-lg">
                            Đã có tài khoản?{" "}
                            <Link to="/login" className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200">
                                Đăng nhập ngay
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default RegisterPage; 