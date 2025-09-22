import { Link, useLocation } from 'react-router-dom';
const MENU = [
    { label: "Hồ Sơ Cá Nhân", to: "/account/profile" },
    { label: "Đổi Mật Khẩu", to: "/account/password" },
    { label: "Địa Chỉ", to: "/account/address" }
];
export default function AccountSidebar() {
    const location = useLocation();
    return (
        <aside className="w-64 bg-white border-r min-h-screen p-6">
            <div className="flex items-center gap-3 mb-8">
                <img src="/avatar.png" className="w-14 h-14 rounded-full" alt="avatar" />
                <div>
                    <div className="font-bold">beewoo.shop</div>
                    <div className="text-xs text-gray-500 cursor-pointer">Sửa Hồ Sơ</div>
                </div>
            </div>
            <nav>
                {MENU.map(item => {
                    const isActive = location.pathname.startsWith(item.to);
                    return (
                        <Link
                            key={item.label}
                            to={item.to}
                            className={`flex items-center gap-2 py-2 px-3 rounded cursor-pointer mb-1
                ${isActive ? 'text-[#ee4d2d] bg-orange-50 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
} 