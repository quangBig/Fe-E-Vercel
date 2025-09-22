import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "../../components/layout/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import ProductManagement from "./components/ProductManagement";
import PageManagement from "./components/PageManagement";
import OrderManagement from "./components/OrderManagenement";
import AnalyticsManagement from "./components/AnalyticsManagement";

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState("dashboard");

    // Initialize AOS
    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: "ease-in-out",
            once: true,
            offset: 100
        });
    }, []);

    const renderContent = () => {
        switch (activeTab) {
            case "dashboard":
                return <Dashboard />;

            case "products":
                return <ProductManagement />;

            case "pages":
                return <PageManagement />;

            case "orders":
                return <OrderManagement />;

            case "analytics":
                return <AnalyticsManagement />


            default:
                return (
                    <div className="space-y-6" data-aos="fade-up" data-aos-delay="300">
                        <h2 className="text-2xl font-bold text-gray-800 capitalize">{activeTab.replace('-', ' ')}</h2>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <p className="text-gray-600">Tính năng {activeTab} đang được phát triển...</p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 flex flex-col text-black">
            <Header />
            <div className="flex flex-1 mt-20">
                {/* Sidebar */}
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

                {/* Main Content */}
                <main className="flex-1 p-8">
                    <div className="mb-6" data-aos="fade-down" data-aos-delay="100">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Chào mừng bạn đến Admin Dashboard</h1>
                        <p className="text-gray-600">Quản lý và theo dõi hoạt động của AppleStore</p>
                    </div>

                    {renderContent()}
                </main>
            </div>

        </div>
    );
};

export default AdminPage; 