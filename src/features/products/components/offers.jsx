import React from "react";
import { CheckCircle, Gift } from "lucide-react";

const offers = [
    {
        section: "I. Ưu đãi thanh toán",
        items: [
            { text: "Thanh toán qua QR VNPAY giảm đến 200.000đ", link: "#" },
            { text: "Mua trả thẳng giảm thêm 100.000đ (SL có hạn)", link: "#" },
            { text: "Giảm đến 200.000đ khi thanh toán qua Kredivo", link: "#" },
            { text: "Hỗ trợ trả góp 0% lãi suất, 0đ phí chuyển đổi, 0đ bảo hiểm", link: "#" },
        ],
    },
    {
        section: "II. Ưu đãi mua kèm",
        items: [
            { text: "Ốp chính hãng Apple iPhone 15 series giảm 300.000đ", link: "#" },
            { text: "Mua combo phụ kiện chính hãng giảm đến 200.000đ", link: "#" },
            { text: "Tai nghe mua kèm giảm đến 1.000.000đ", link: "#" },
            { text: "Giảm đến 20% khi mua các gói bảo hành", link: "#" },
        ],
    },
    {
        section: "III. Ưu đãi khác",
        items: [
            { text: "Thu cũ lên đời iPhone tặng Voucher 4 triệu", link: "#" },
        ],
    },
];

const PromotionBox = () => {
    return (
        <div className="bg-white border rounded-xl shadow-md p-6 max-w-xl">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <Gift className="text-pink-600" size={22} />
                <h2 className="text-lg font-semibold">Ưu đãi</h2>
            </div>
            <p className="text-sm text-gray-500 mb-6">
                (Khuyến mãi dự kiến áp dụng đến{" "}
                <span className="font-medium">23h59 | 30/09/2025</span>)
            </p>

            {/* Sections */}
            {offers.map((section, idx) => (
                <div key={idx} className="mb-5">
                    <h3 className="font-semibold text-red-600 mb-3">{section.section}</h3>
                    <ul className="space-y-2">
                        {section.items.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={18} />
                                <span>
                                    {item.text}{" "}
                                    <a href={item.link} className="text-blue-600 hover:underline">
                                        (Xem chi tiết)
                                    </a>
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default PromotionBox;
