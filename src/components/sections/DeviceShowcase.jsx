import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../layout/Header";

const DeviceShowcase = ({ products = [], title = "", desc = "" }) => {
    const [selected, setSelected] = useState(0);
    const [animating, setAnimating] = useState(false);
    const [showImage, setShowImage] = useState(false);

    useEffect(() => {
        setShowImage(false);
        const timer = setTimeout(() => setShowImage(true), 600);
        return () => clearTimeout(timer);
    }, [selected]);

    useEffect(() => {
        setAnimating(true);
        setShowImage(false);
        const timer1 = setTimeout(() => {
            setShowImage(true);
            setAnimating(false);
            setSelected(0);
        }, 600);
        return () => clearTimeout(timer1);
    }, [products, title, desc]);

    const handleColorClick = (idx) => {
        if (idx === selected) return;
        setAnimating(true);
        setTimeout(() => {
            setSelected(idx);
            setAnimating(false);
        }, 650);
    };

    const variant = products[selected] || {};

    const getLogoColor = () => {
        if (variant.bg === "bg-white" || variant.bg === "bg-gray-100") return "#111";
        return "#fff";
    };

    return (
        <section
            data-aos="fade-up"
            className={`relative w-full min-h-screen flex flex-col transition-colors duration-500 ${variant.bg || ""}`}
        >
            <Header logoColor={getLogoColor()} />

            <div className="flex-1 flex flex-col items-center justify-center mt-48 relative w-full px-4 sm:px-6 lg:px-8 ">
                <div className="relative flex flex-col items-center justify-center w-full">
                    <h1
                        data-aos="fade-up"
                        data-aos-delay="100"
                        className={`select-none font-extrabold text-center leading-none ${variant.text || ""} opacity-10 pointer-events-none`}
                        style={{
                            fontSize: "clamp(2rem, 20vw, 18rem)",
                            zIndex: 1,
                            letterSpacing: "-0.05em",
                        }}
                    >
                        {title}
                    </h1>

                    {showImage && (
                        <div
                            data-aos="zoom-in"
                            data-aos-delay="0"
                            className={`absolute mt-8 sm:mt-12 md:mt-32 -translate-x-1/2 flex flex-col items-center transition-all duration-500 ${animating ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"}`}
                            style={{
                                zIndex: 2,
                                transition: "all 0.5s cubic-bezier(.4,0,.2,1)",
                            }}
                            key={selected}
                        >
                            <div className="relative group">
                                {variant.productId ? (
                                    <Link
                                        to={`/product/${variant.productId}`}
                                        className="block outline-none focus:outline-none"
                                        aria-label={`Xem chi tiết ${variant.name || title}`}
                                    >
                                        <img
                                            src={variant.image}
                                            alt={variant.name || title}
                                            className="h-[220px] sm:h-[280px] md:h-[400px] lg:h-[600px] xl:h-[800px] object-contain drop-shadow-2xl cursor-pointer"
                                        />
                                    </Link>
                                ) : (
                                    <img
                                        src={variant.image}
                                        alt={variant.name || title}
                                        className="h-[220px] sm:h-[280px] md:h-[400px] lg:h-[600px] xl:h-[800px] object-contain drop-shadow-2xl"
                                    />
                                )}

                                {/* overlay + CTA optional (đã loại bỏ để sạch), nếu muốn mình thêm hover CTA */}
                            </div>
                        </div>
                    )}
                </div>

                <div
                    data-aos="fade-up"
                    data-aos-delay="400"
                    className="mt-6 sm:mt-8 md:mt-10 flex flex-col items-center z-10 w-full max-w-2xl px-4"
                >
                    <p className={`mb-4 sm:mb-6 text-sm sm:text-base md:text-lg lg:text-xl mt-36 sm:mt-12 md:mt-64 text-center ${variant.text || ""}`}>
                        {desc || variant.desc}
                    </p>

                    <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                        {products.map((v, idx) => (
                            <button
                                key={(v.name || "") + idx}
                                className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full border-2 ${selected === idx ? "border-black scale-110" : "border-gray-300"} transition-transform`}
                                style={{ background: v.color || "#ddd" }}
                                onClick={() => handleColorClick(idx)}
                                aria-label={v.name || `option-${idx}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DeviceShowcase;
