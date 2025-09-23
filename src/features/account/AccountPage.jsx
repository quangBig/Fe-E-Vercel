import AccountInfo from './components/AccountInfo';
import OrderSidebar from '../orders/components/OrderSidebar';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { useAuthStore } from '../../stores/useAuthStore';

export default function AccountPage() {
    const { user } = useAuthStore();

    if (!user) {
        return (
            <>
                <Header />
                <div className="flex items-center justify-center min-h-screen text-gray-600">
                    Vui lòng đăng nhập để xem thông tin tài khoản
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="flex bg-[#fafafa] min-h-screen text-black">
                <OrderSidebar />
                <div className="flex-1 p-8 mt-20">
                    <h1 className="text-2xl font-bold mb-6">Hồ Sơ Của Tôi</h1>
                    <AccountInfo user={user} onEdit={() => alert('Sửa thông tin!')} />
                </div>
            </div>
            <Footer />
        </>
    );
}
