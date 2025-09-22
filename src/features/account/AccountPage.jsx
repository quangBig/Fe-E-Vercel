import AccountInfo from './components/AccountInfo';
import OrderSidebar from '../orders/components/OrderSidebar';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';


const MOCK_USER = {
    avatar: '/avatar.png',
    name: 'beewoo.shop',
    email: 'beewoo@gmail.com',
    phone: '0901234567',
    birthday: '01/01/2000',
    gender: 'Nam',
    address: '123 Đường ABC, Quận 1, TP.HCM'
};

export default function AccountPage() {
    return (
        <>
            <Header />
            <div className="flex bg-[#fafafa] min-h-screen text-black">
                <OrderSidebar />
                <div className="flex-1 p-8 mt-20">
                    <h1 className="text-2xl font-bold mb-6">Hồ Sơ Của Tôi</h1>
                    <AccountInfo user={MOCK_USER} onEdit={() => alert('Sửa thông tin!')} />
                </div>
            </div>
            <Footer />
        </>
    );
} 