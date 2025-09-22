import React from "react";

const Sidebar = ({ activeTab, setActiveTab }) => {
    const menuItems = [
        { id: "dashboard", label: "Dashboard", icon: "📊" },
        { id: "products", label: "Quản lý sản phẩm", icon: "📱" },
        { id: "orders", label: "Đơn hàng", icon: "📦" },
        { id: "users", label: "Người dùng", icon: "👥" },
        { id: "pages", label: "Quản lý trang", icon: "📄" },
        { id: "analytics", label: "Thống kê", icon: "📈" },
        { id: "settings", label: "Cài đặt", icon: "⚙️" }
    ];

    return (
        <aside className="w-64 bg-white shadow-md p-4 hidden md:block" data-aos="fade-right" data-aos-delay="200">
            <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Admin Panel</h2>
                <p className="text-sm text-gray-600">Quản lý AppleStore</p>
            </div>

            <nav>
                <ul className="space-y-2">
                    {menuItems.map((item, index) => (
                        <li key={item.id}>
                            <button
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center space-x-3 hover:bg-gray-100 ${activeTab === item.id
                                    ? 'bg-blue-100 text-blue-700 font-semibold shadow-sm'
                                    : 'text-gray-700 hover:text-gray-900'
                                    }`}
                            >
                                <span className="text-lg">{item.icon}</span>
                                <span>{item.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar; 