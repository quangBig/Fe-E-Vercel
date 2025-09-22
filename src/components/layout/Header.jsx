import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useAuthStore } from "../../stores/useAuthStore";
import { usePageProductStore } from "../../stores/usePageProduct";
import { useProductStore } from "../../stores/useProductStore";
import { toast } from "react-toastify";
import { useCartStore } from "../../stores/useCartStore";

const Header = ({ logoColor = "#000" }) => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { cart } = useCartStore();
    const { pageProducts, getPageProducts } = usePageProductStore();
    const { getProducts, products } = useProductStore();


    useEffect(() => {
        getProducts();
        getPageProducts();
    }, [getProducts, getPageProducts]);

    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();

    // ---- Search logic ----
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef(null);
    const debounceRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        };
        window.addEventListener("click", handleClickOutside);
        return () => window.removeEventListener("click", handleClickOutside);
    }, []);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (!query.trim()) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        debounceRef.current = setTimeout(() => {
            const q = query.trim().toLowerCase();
            const matched = (products || [])
                .filter((p) => (p.name || "").toLowerCase().includes(q))
                .slice(0, 7);
            setSuggestions(matched);
            setShowSuggestions(true);
        }, 200);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [query, products]);
    const totalItems = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    const handleSelectProduct = (prod) => {
        setQuery("");
        setSuggestions([]);
        setShowSuggestions(false);
        navigate(`/product/${prod._id}`);
        setMobileMenuOpen(false);
    };

    // const handleCart = () => {
    //     if (!user) {
    //         toast.warning("Bạn cần đăng nhập trước khi thêm vào giỏ hàng!");
    //         navigate("/login");
    //         return;
    //     }
    // }
    return (
        <header className="w-full flex justify-between items-center px-6 lg:px-12 py-3 lg:py-4 bg-white/70 backdrop-blur-md shadow-sm z-50 fixed top-0 left-0">
            {/* Mobile menu button */}
            <button
                className="lg:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Open menu"
            >
                {mobileMenuOpen ? (
                    <CloseIcon style={{ fontSize: 24, color: logoColor }} />
                ) : (
                    <MenuIcon style={{ fontSize: 24, color: logoColor }} />
                )}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center">
                <svg
                    width="28"
                    height="28"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                >
                    <path
                        d="M25.7 17.6c-.1-3.2 2.6-4.7 2.7-4.8-1.5-2.2-3.8-2.5-4.6-2.6-2-0.2-3.9 1.2-4.9 1.2-1 0-2.5-1.2-4.1-1.1-2.1.1-4.1 1.2-5.2 3-2.2 3.7-.6 9.1 1.6 12.1 1.1 1.5 2.4 3.2 4.1 3.1 1.6-.1 2.2-1 4.1-1 1.9 0 2.4 1 4.1 1 1.7 0 2.8-1.5 3.8-3 1.2-1.7 1.7-3.4 1.7-3.5 0-.1-3.2-1.2-3.3-4.7zM21.6 7.2c.9-1.1 1.5-2.6 1.3-4.2-1.3.1-2.8.9-3.7 2-0.8.9-1.5 2.5-1.2 4 .1 0 2.1-.1 3.6-1.8z"
                        fill={logoColor}
                    />
                </svg>
            </Link>

            {/* Navigation */}
            <nav className="hidden lg:block">
                <ul className="flex gap-8 font-medium text-gray-500 text-sm tracking-wide">
                    <li>
                        <Link to="/" className="hover:text-black transition">
                            Home
                        </Link>
                    </li>
                    {[...pageProducts]
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((item) => (
                            <li key={item.name}>
                                <Link
                                    to={item.slug}
                                    className="hover:text-black transition"
                                >
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                </ul>
            </nav>

            {/* Search */}
            <div className="flex-1 mx-6 max-w-sm relative" ref={searchRef}>
                <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Tìm sản phẩm..."
                    className="w-full border border-gray-200 rounded-full pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
                />
                {/* search icon */}
                <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
                    />
                </svg>

                {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden max-h-48">
                        <ul className="divide-y divide-gray-100">
                            {suggestions.map((s) => (
                                <li key={s._id}>
                                    <button
                                        onClick={() => handleSelectProduct(s)}
                                        className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2"
                                    >
                                        <img
                                            src={s.images?.[0] || "/placeholder-product.png"}
                                            alt={s.name}
                                            className="w-8 h-8 object-contain"
                                        />
                                        <div className="flex-1">
                                            <div className="font-medium text-xs">{s.name}</div>
                                            <div className="text-[10px] text-gray-500">
                                                {s.category || ""}
                                            </div>
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* User Actions */}
            <div className="flex gap-3 sm:gap-4 items-center text-gray-400">
                <Link
                    to="/cart"
                    className="relative p-1 sm:p-2"
                    onClick={(e) => {
                        if (!user) {
                            e.preventDefault();
                            toast.warning("Bạn cần đăng nhập trước khi thêm vào giỏ hàng!");
                            navigate("/login");
                        }
                    }}
                >
                    <LocalMallIcon style={{ fontSize: 26 }} className="hover:text-blue-500 transition-colors" />

                    {/* Badge hiển thị số lượng */}
                    {totalItems > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                            {totalItems}
                        </span>
                    )}
                </Link>

                <div className="relative p-1 sm:p-2">
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="hover:text-blue-500 transition-colors"
                    >
                        <AccountCircleIcon style={{ fontSize: 26 }} />
                    </button>

                    {/* User Dropdown Menu */}
                    {showUserMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-100 animate-fadein">
                            <div className="px-4 py-3 border-b border-gray-100">
                                {user ? (
                                    <>
                                        <p className="text-sm text-gray-500">Xin chào, <span className="font-semibold text-gray-800">{user.name}</span></p>
                                        <p className="text-xs text-gray-400">{user.email}</p>
                                    </>
                                ) : (
                                    <p className="text-sm text-gray-500">Tài khoản</p>
                                )}
                            </div>
                            {!user && (
                                <>
                                    <Link to="/login" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-500 transition-colors duration-200 flex items-center" onClick={() => setShowUserMenu(false)}>
                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>Đăng nhập
                                    </Link>
                                    <Link to="/register" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-500 transition-colors duration-200 flex items-center" onClick={() => setShowUserMenu(false)}>
                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>Đăng ký
                                    </Link>
                                </>
                            )}
                            {user && (
                                <>
                                    <Link to="/orders" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-500 transition-colors duration-200 flex items-center" onClick={() => setShowUserMenu(false)}>
                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>Đơn mua
                                    </Link>
                                    {user.role === "admin" && (
                                        <Link to="/admin" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-500 transition-colors duration-200 flex items-center" onClick={() => setShowUserMenu(false)}>
                                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" /></svg>Quản lý cửa hàng
                                        </Link>
                                    )}
                                    <button onClick={() => { logout(); setShowUserMenu(false); navigate("/"); }} className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-red-500 transition-colors duration-200 flex items-center">
                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>Đăng xuất
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Overlay to close dropdown when clicking outside */}
            {showUserMenu && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                />
            )}

            {/* Mobile Navigation Drawer */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)}>
                    <div
                        className="absolute top-0 left-0 h-full w-4/5 max-w-xs bg-white shadow-lg z-50 overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                            <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                                <svg
                                    width="32"
                                    height="32"
                                    viewBox="0 0 32 32"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-8 w-8"
                                >
                                    <path
                                        d="M25.7 17.6c-.1-3.2 2.6-4.7 2.7-4.8-1.5-2.2-3.8-2.5-4.6-2.6-2-0.2-3.9 1.2-4.9 1.2-1 0-2.5-1.2-4.1-1.1-2.1.1-4.1 1.2-5.2 3-2.2 3.7-.6 9.1 1.6 12.1 1.1 1.5 2.4 3.2 4.1 3.1 1.6-.1 2.2-1 4.1-1 1.9 0 2.4 1 4.1 1 1.7 0 2.8-1.5 3.8-3 1.2-1.7 1.7-3.4 1.7-3.5 0-.1-3.2-1.2-3.3-4.7zM21.6 7.2c.9-1.1 1.5-2.6 1.3-4.2-1.3.1-2.8.9-3.7 2-0.8.9-1.5 2.5-1.2 4 .1 0 2.1-.1 3.6-1.8z"
                                        fill={logoColor}
                                    />
                                </svg>
                            </Link>
                            <button onClick={() => setMobileMenuOpen(false)}>
                                <CloseIcon style={{ fontSize: 28, color: logoColor }} />
                            </button>
                        </div>

                        <nav className="px-4 py-6">
                            <ul className="flex flex-col gap-4">
                                <li>
                                    <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block text-gray-700 font-semibold">Home</Link>
                                </li>

                                {/* Categories grouped by product.category */}
                                {[...new Set((products || []).map((p) => p.category))].map((cat, idx) => (
                                    <li key={cat}>
                                        <button
                                            onClick={() => setMobileSubMenu(mobileSubMenu === idx ? null : idx)}
                                            className="w-full flex items-center justify-between text-left text-gray-700 font-semibold"
                                        >
                                            <span>{cat}</span>
                                            <span>{mobileSubMenu === idx ? "-" : "+"}</span>
                                        </button>

                                        {mobileSubMenu === idx && (
                                            <ul className="mt-2 pl-4">
                                                {products
                                                    .filter((p) => p.category === cat)
                                                    .map((prod) => (
                                                        <li key={prod._id}>
                                                            <Link
                                                                to={`/product/${prod._id}`}
                                                                onClick={() => setMobileMenuOpen(false)}
                                                                className="block py-2 text-gray-600"
                                                            >
                                                                {prod.name}
                                                            </Link>
                                                        </li>
                                                    ))}
                                            </ul>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
