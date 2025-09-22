import React from "react";
import { Link } from "react-router-dom";

const HeroSection = () => (
    <section className="w-full min-h-[60vh] flex flex-col items-center justify-center bg-gradient-to-br  to-white py-16 px-4 text-center animate-fadein mt-5">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-gray-900 leading-tight drop-shadow-lg">
            Welcome to Apple Store
        </h1>
        <p className="text-xl md:text-2xl text-gray-500 mb-8 max-w-2xl mx-auto">
            Khám phá những sản phẩm mới nhất của Apple với thiết kế ấn tượng và hiệu suất mạnh mẽ.
        </p>
        <Link
            to="/"
            className="inline-block px-8 py-3 bg-gradient-to-r from-black to-gray-800 text-white rounded-full font-semibold text-lg shadow-lg hover:scale-105 hover:shadow-2xl transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-black"
        >
            Buy Now
        </Link>
    </section>
);

export default HeroSection; 