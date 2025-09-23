import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../../stores/useAuthStore';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const MENU = [
    { label: "Thông Báo", to: "#" },
    { label: "Tài Khoản Của Tôi", to: "/account" },
    { label: "Đơn Mua", to: "/orders" },
];

export default function OrderSidebar() {
    const location = useLocation();
    const { user } = useAuthStore();
    console.log(user, "user"); // Debug

    return (
        <aside className="w-64 bg-white border-r min-h-screen p-6 mt-20">
            <div className="flex items-center gap-3 mb-8">
                <AccountCircleIcon style={{ fontSize: 26 }} />
                <div>
                    {/* In ra tên user từ store */}
                    <div className="font-bold">{user?.role || "User"}</div>
                    {/* In ra email hoặc cho sửa hồ sơ */}
                    <div className="text-xs text-gray-500 cursor-pointer">
                        {user?.email || "Sửa Hồ Sơ"}
                    </div>
                </div>
            </div>
            <nav>
                {MENU.map(item => {
                    const isActive = item.to !== "#" && location.pathname.startsWith(item.to);
                    return (
                        <Link
                            key={item.label}
                            to={item.to}
                            className={`flex items-center gap-2 py-2 px-3 rounded cursor-pointer mb-1
                                ${isActive ? 'text-[#ee4d2d] bg-orange-50 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                            {item.label}
                            {item.badge && <span className="ml-2 text-xs bg-yellow-300 text-white px-2 rounded">{item.badge}</span>}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
