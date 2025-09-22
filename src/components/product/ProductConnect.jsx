import { useMemo, useState } from "react";
import { usePageProductStore } from "../../stores/usePageProduct";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductConnect() {
    const [activeIndex, setActiveIndex] = useState(-1);
    const { slug } = useParams();
    const { pageProducts, loading } = usePageProductStore();

    const product = useMemo(
        () =>
            pageProducts.find(
                (p) => p.slug.replace(/^\//, "") === slug?.replace(/^\//, "")
            ),
        [pageProducts, slug]
    );

    const features = product?.bannerConnect || [];

    // ❌ Không có bannerConnect thì ẩn luôn section
    if (!features.length) return null;

    return (
        <section className="bg-gray-50 py-16 px-6 md:px-16 rounded-3xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
                Nửa kia hoàn hảo.
            </h2>
            <div className="flex justify-center">
                <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl p-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                        {/* Text + Accordion */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center md:text-left">
                                Danh sách tính năng
                            </h2>

                            <div className="space-y-3">
                                {features.map((f, idx) => (
                                    <div
                                        key={idx}
                                        className="rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300"
                                    >
                                        <button
                                            onClick={() =>
                                                setActiveIndex(activeIndex === idx ? -1 : idx)
                                            }
                                            className="flex justify-between items-center w-full px-5 py-4 text-left"
                                        >
                                            <span className="text-lg font-semibold text-gray-800">
                                                {f.content}
                                            </span>

                                            {/* chỉ render nút + nếu có mainContent */}
                                            {f.mainContent && (
                                                <span
                                                    className={`ml-3 flex h-7 w-7 items-center justify-center rounded-full border transition-all duration-300 ${activeIndex === idx
                                                            ? "rotate-45 bg-black text-white border-black"
                                                            : "bg-gray-100 text-gray-600 border-gray-300"
                                                        }`}
                                                >
                                                    +
                                                </span>
                                            )}
                                        </button>

                                        {/* Animate Content */}
                                        <AnimatePresence initial={false}>
                                            {activeIndex === idx && f.mainContent && (
                                                <motion.div
                                                    key="content"
                                                    initial={{ height: 0, opacity: 0, y: -5 }}
                                                    animate={{ height: "auto", opacity: 1, y: 0 }}
                                                    exit={{ height: 0, opacity: 0, y: -5 }}
                                                    transition={{ duration: 0.4, ease: "easeInOut" }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="px-5 pb-4 text-gray-600 text-sm leading-relaxed">
                                                        {f.mainContent}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Image (chỉ render nếu có image) */}
                        <div className="flex justify-center">
                            {features[activeIndex]?.image && (
                                <img
                                    src={features[activeIndex].image}
                                    alt={features[activeIndex]?.title || "feature"}
                                    className="w-full max-w-md object-contain rounded-2xl shadow-md"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
