import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { usePageProductStore } from "../../stores/usePageProduct";

const FeatureCarousel = () => {
    const { slug } = useParams();
    const { pageProducts, loading } = usePageProductStore();
    const [openIndex, setOpenIndex] = useState(null);

    const product = useMemo(
        () =>
            pageProducts.find(
                (p) => p.slug.replace(/^\//, "") === slug?.replace(/^\//, "")
            ),
        [pageProducts, slug]
    );

    // Nếu chưa có dữ liệu → không render
    if (loading || !product) {
        return (
            <div className="w-full py-12 flex justify-center items-center">
                <p className="text-gray-500">Đang tải dữ liệu...</p>
            </div>
        );
    }

    const features = product?.bannerContent || [];
    if (!features.length) return null;


    return (
        <div className="w-full py-12 flex flex-col justify-center gap-6 flex-wrap">
            <div className="text-3xl font-semibold ml-20 mt-10 whitespace-pre-line">
                <h1>Tìm hiểu về {product.name}</h1>
            </div>

            <div className="flex gap-3 ml-80 flex-wrap">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className="relative flex-shrink-0 w-80 h-[550px] rounded-3xl overflow-hidden shadow-lg"
                    >
                        {/* Background image */}
                        <div
                            className="absolute inset-0 bg-black"
                            style={{
                                backgroundImage: `url(${feature.image})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        />

                        {/* Overlay đen nhẹ */}
                        <div className="absolute inset-0 bg-black/50" />

                        {/* Nội dung */}
                        <div className="relative z-10 p-6 flex flex-col h-full justify-between text-white">
                            <div>
                                {feature.subtitle && (
                                    <div className="text-sm font-semibold mb-2 opacity-90 text-white"
                                        style={{ textShadow: "2px 2px 4px #000" }}>
                                        {feature.subtitle}
                                    </div>
                                )}
                                {feature.title && (
                                    <div className="text-xl font-bold mb-3 leading-snug text-white"
                                        style={{ textShadow: "2px 2px 4px #000" }}>
                                        {feature.title}
                                    </div>
                                )}
                            </div>

                            {/* Nút + */}
                            <div className="flex ml-56 mt-6">
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="w-10 h-10 flex items-center justify-center rounded-full border border-white text-white text-2xl hover:bg-white hover:text-black transition"
                                >
                                    {openIndex === index ? "x" : "+"}
                                </button>
                            </div>
                        </div>

                        {/* Overlay chi tiết */}
                        {openIndex === index && (
                            <div className="absolute inset-0 bg-gray-300 p-6 flex flex-col justify-center items-center text-center text-black transition-all duration-300">
                                {feature.description && (
                                    <div className="text-base font-bold opacity-90 leading-relaxed">
                                        {feature.description}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeatureCarousel;
