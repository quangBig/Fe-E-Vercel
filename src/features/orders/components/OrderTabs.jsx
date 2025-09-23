const TABS = [
    { label: "Tất cả", value: "all" },
    { label: "Chờ thanh toán", value: "pending" },
    { label: "Vận chuyển", value: "shipping" },
    { label: "Chờ giao hàng", value: "delivering" },
    { label: "Hoàn thành", value: "completed" },
    { label: "Đã hủy", value: "cancelled" },
    { label: "Trả hàng/Hoàn tiền", value: "refund" },
];

export default function OrderTabs({ current, onChange }) {
    return (
        <div className="flex border-b bg-white mt-20">
            {TABS.map(tab => (
                <button
                    key={tab.value}
                    className={`px-4 py-2 font-medium focus:outline-none transition-colors duration-200 ${current === tab.value
                        ? 'text-[#ee4d2d] border-b-2 border-[#ee4d2d] bg-white'
                        : 'text-gray-700'
                        }`}
                    onClick={() => onChange(tab.value)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
} 