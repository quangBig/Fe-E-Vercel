import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useProductStore } from "../../stores/useProductStore";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import AOS from "aos";
import "aos/dist/aos.css";

export default function ProductsPage() {
    const { products, getProducts, loading } = useProductStore();
    const [searchParams, setSearchParams] = useSearchParams();

    // Filters & Sorting state
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sortBy, setSortBy] = useState("default");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        getProducts();
        AOS.init({ duration: 800, easing: "ease-in-out", once: true });
    }, [getProducts]);

    // Read category from query param if available (e.g. /products?category=iphone)
    useEffect(() => {
        const catParam = searchParams.get("category");
        if (catParam) {
            setSelectedCategory(catParam.toLowerCase());
        } else {
            setSelectedCategory("all");
        }
    }, [searchParams]);

    // Helper to get minimum price of a product
    const getProductPrice = (product) => {
        let minPrice = Infinity;
        let minDiscounted = Infinity;

        if (product.variants && product.variants.length > 0) {
            product.variants.forEach((v) => {
                const p = Number(v.price) || 0;
                const d = Number(v.discountedPrice) || p;
                if (p < minPrice) minPrice = p;
                if (d < minDiscounted) minDiscounted = d;

                if (v.colors && v.colors.length > 0) {
                    v.colors.forEach((c) => {
                        const cp = Number(c.price) || p;
                        const cd = Number(c.discountedPrice) || cp;
                        if (cp < minPrice) minPrice = cp;
                        if (cd < minDiscounted) minDiscounted = cd;
                    });
                }
            });
        }

        if (minPrice === Infinity) return { price: 0, discountedPrice: 0 };
        return {
            price: minPrice,
            discountedPrice: minDiscounted < minPrice ? minDiscounted : null,
        };
    };

    // Extract all unique categories
    const categories = ["all", ...new Set((products || []).map((p) => p.category?.toLowerCase()).filter(Boolean))];

    // Filter products
    const filteredProducts = (products || []).filter((product) => {
        const matchesCategory = selectedCategory === "all" || product.category?.toLowerCase() === selectedCategory;
        const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             product.description?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Sort products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        const priceA = getProductPrice(a);
        const priceB = getProductPrice(b);
        const actualA = priceA.discountedPrice || priceA.price;
        const actualB = priceB.discountedPrice || priceB.price;

        if (sortBy === "price-asc") {
            return actualA - actualB;
        } else if (sortBy === "price-desc") {
            return actualB - actualA;
        } else if (sortBy === "name-asc") {
            return a.name.localeCompare(b.name);
        } else if (sortBy === "name-desc") {
            return b.name.localeCompare(a.name);
        }
        return 0; // default (no sorting / database order)
    });

    const formatPrice = (price) => new Intl.NumberFormat("vi-VN").format(price);

    const handleCategoryChange = (cat) => {
        setSelectedCategory(cat);
        if (cat === "all") {
            searchParams.delete("category");
        } else {
            searchParams.set("category", cat);
        }
        setSearchParams(searchParams);
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 text-black flex flex-col justify-between">
            <Header />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex-1">
                {/* Title Section */}
                <div className="text-center mb-10" data-aos="fade-up">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                        Danh sách sản phẩm
                    </h1>
                    <p className="mt-4 max-w-xl mx-auto text-base text-gray-500">
                        Khám phá các dòng sản phẩm công nghệ Apple chính hãng mới nhất.
                    </p>
                </div>

                {/* Filters & Search Controls */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6" data-aos="fade-up" data-aos-delay="100">
                    {/* Category Filter Tabs */}
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => handleCategoryChange(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition duration-200 capitalize ${
                                    selectedCategory === cat
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                {cat === "all" ? "Tất cả" : cat}
                            </button>
                        ))}
                    </div>

                    {/* Search and Sort controls */}
                    <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                        {/* Search Input */}
                        <div className="relative flex-1 sm:w-64">
                            <input
                                type="text"
                                placeholder="Tìm kiếm sản phẩm..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            />
                            <svg
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-4.35-4.35M16.5 10.5a6 6 0 11-12 0 6 6 0 0112 0z"
                                />
                            </svg>
                        </div>

                        {/* Sort Selector */}
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer appearance-none pr-8"
                            >
                                <option value="default">Sắp xếp: Mặc định</option>
                                <option value="price-asc">Giá: Thấp đến Cao</option>
                                <option value="price-desc">Giá: Cao đến Thấp</option>
                                <option value="name-asc">Tên: A - Z</option>
                                <option value="name-desc">Tên: Z - A</option>
                            </select>
                            <svg
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600 mb-4"></div>
                        <p className="text-gray-500">Đang tải danh sách sản phẩm...</p>
                    </div>
                ) : sortedProducts.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 p-8">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400 mb-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Không tìm thấy sản phẩm</h3>
                        <p className="text-gray-500">Hãy thử đổi bộ lọc hoặc từ khóa tìm kiếm của bạn.</p>
                    </div>
                ) : (
                    /* Product Grid */
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" data-aos="fade-up" data-aos-delay="200">
                        {sortedProducts.map((product) => {
                            const { price, discountedPrice } = getProductPrice(product);
                            const discountPercentage = discountedPrice 
                                ? Math.round(((price - discountedPrice) / price) * 100) 
                                : 0;

                            return (
                                <Link
                                    key={product._id}
                                    to={`/product/${product._id}`}
                                    className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col justify-between hover:shadow-md hover:border-gray-200 transition duration-300 transform hover:-translate-y-1"
                                >
                                    {/* Product Image Box */}
                                    <div className="relative pt-[100%] bg-gray-50 overflow-hidden">
                                        <img
                                            src={product.images?.[0] || "/placeholder-product.png"}
                                            alt={product.name}
                                            className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition duration-500"
                                        />
                                        {discountPercentage > 0 && (
                                            <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                                                -{discountPercentage}%
                                            </span>
                                        )}
                                        <span className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-sm text-gray-800 text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-gray-100">
                                            {product.category}
                                        </span>
                                    </div>

                                    {/* Product Text Content */}
                                    <div className="p-5 flex-1 flex flex-col justify-between">
                                        <div className="mb-4">
                                            <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition text-base line-clamp-1">
                                                {product.name}
                                            </h3>
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                                {product.description}
                                            </p>
                                        </div>

                                        {/* Pricing Block */}
                                        <div>
                                            {discountedPrice ? (
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-lg font-extrabold text-red-600">
                                                        {formatPrice(discountedPrice)}₫
                                                    </span>
                                                    <span className="text-xs text-gray-400 line-through">
                                                        {formatPrice(price)}₫
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-lg font-extrabold text-gray-900">
                                                    {formatPrice(price)}₫
                                                </span>
                                            )}
                                            <p className="text-[10px] text-gray-400 mt-1">Hỗ trợ trả góp 0%</p>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
