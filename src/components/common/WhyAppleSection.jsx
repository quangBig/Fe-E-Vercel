import React, { useMemo } from "react";
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import { usePageProductStore } from "../../stores/usePageProduct";
import { useParams } from "react-router-dom";

const reasons = [
    {
        icon: "/Screenshot 2025-09-10 152825.png",
        title: "Thanh toán hàng tháng dễ dàng",
        desc: "Hỗ trợ trả góp 0% lãi suất, linh hoạt nhiều ngân hàng.",
        ctaLink: "#"
    },
    {
        icon: "/Screenshot 2025-09-10 153309.png",
        title: "Mua sắm trực tuyến cùng chuyên gia",
        desc: "Chọn sản phẩm Apple mới cho bạn với sự hỗ trợ từ chuyên gia trực tuyến.",
        ctaLink: "#"
    },
    {
        icon: <SettingsSuggestIcon fontSize="large" className="text-gray-800" />,
        title: "Tùy chỉnh sản phẩm Apple của bạn",
        desc: "Chọn chip, bộ nhớ, dung lượng, màu sắc theo ý muốn.",
        ctaLink: "#"
    },
    {
        icon: "/Screenshot 2025-09-10 153248.png",
        title: "Giao hàng miễn phí tận nơi",
        desc: "Giao hàng nhanh chóng, miễn phí trên toàn quốc.",
        ctaLink: "#"
    },
];

const WhyAppleSection = () => {
    const { pageProducts } = usePageProductStore();
    const { slug } = useParams();

    const product = useMemo(
        () =>
            pageProducts.find(
                (p) => p.slug.replace(/^\//, "") === slug?.replace(/^\//, "")
            ),
        [pageProducts, slug]
    );

    return (
        <div className="w-full py-16 bg-gray-50">

            {/* Tiêu đề */}
            <div className="text-3xl font-semibold ml-20 mt-10 mb-10 whitespace-pre-line">
                <h1>
                    Vì sao Apple Store là nơi tốt nhất để mua sản phẩm {product?.name}
                </h1>
            </div>
            <div className="max-w-7xl mx-auto px-6">
                {/* Lý do */}
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {reasons.map((item, idx) => (
                        <li
                            key={idx}
                            className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center text-center transition-transform duration-300 hover:scale-105"
                        >
                            {/* Icon / Ảnh */}
                            <div className="h-24 mb-6 flex items-center justify-center">
                                {typeof item.icon === "string" ? (
                                    <img
                                        src={item.icon}
                                        alt={item.title}
                                        className="h-24 object-contain transition-transform duration-300 hover:scale-110"
                                    />
                                ) : (
                                    item.icon
                                )}
                            </div>

                            {/* Tiêu đề */}
                            <h3 className="font-semibold text-xl text-gray-900 mb-3">
                                {item.title}
                            </h3>

                            {/* Mô tả */}
                            <p className="text-gray-600 text-base leading-relaxed">
                                {item.desc}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default WhyAppleSection;
