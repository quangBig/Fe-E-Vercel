import React, { useEffect, useState } from "react";
import { useProductStore } from "../../../stores/useProductStore";
import { useAuthStore } from "../../../stores/useAuthStore";
import { useOrderStore } from "../../../stores/useOrderStore";

const Dashboard = () => {
    const { products, getProducts } = useProductStore();
    const [count, setCount] = useState(0);
    const { user, getUserCount } = useAuthStore();
    const { statistics, getStatistics } = useOrderStore()
    useEffect(() => {
        getStatistics();
    }, [getStatistics]);
    console.log(statistics, "statistics")

    useEffect(() => {
        getProducts();
    }, [getProducts]);
    useEffect(() => {
        (async () => {
            const total = await getUserCount();
            setCount(total);
        })();
    }, [getUserCount]);
    console.log(count, "dfg")

    console.log(products, "dfg")
    return (
        <div className="space-y-6" data-aos="fade-up" data-aos-delay="300">
            <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                    data-aos="zoom-in"
                    data-aos-delay="400"
                >
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                            <span className="text-2xl">📱</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Tổng sản phẩm</p>
                            <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                        </div>
                    </div>
                </div>

                <div
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                    data-aos="zoom-in"
                    data-aos-delay="500"
                >
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100 text-green-600">
                            <span className="text-2xl">💰</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Doanh thu</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {statistics?.revenue?.toLocaleString("vi-VN")} ₫
                            </p>
                        </div>
                    </div>
                </div>

                <div
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                    data-aos="zoom-in"
                    data-aos-delay="600"
                >
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                            <span className="text-2xl">📦</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Đơn hàng</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {statistics?.totalOrders}
                            </p>
                        </div>
                    </div>
                </div>


                <div
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                    data-aos="zoom-in"
                    data-aos-delay="700"
                >
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                            <span className="text-2xl">👥</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Người dùng</p>
                            <p className="text-2xl font-bold text-gray-900">{count}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div
                className="bg-white p-6 rounded-lg shadow-md"
                data-aos="fade-up"
                data-aos-delay="800"
            >
                <h3 className="text-lg font-semibold mb-4">Hoạt động gần đây</h3>
                <div className="space-y-3">
                    {[
                        { action: "Đơn hàng mới", time: "2 phút trước", type: "order" },
                        { action: "Sản phẩm được cập nhật", time: "15 phút trước", type: "product" },
                        { action: "Người dùng mới đăng ký", time: "1 giờ trước", type: "user" },
                        { action: "Thanh toán thành công", time: "2 giờ trước", type: "payment" }
                    ].map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                            data-aos="fade-left"
                            data-aos-delay={900 + index * 100}
                        >
                            <div className="flex items-center">
                                <span className="text-lg mr-3">
                                    {item.type === 'order' ? '📦' :
                                        item.type === 'product' ? '📱' :
                                            item.type === 'user' ? '👤' : '💰'}
                                </span>
                                <span className="font-medium">{item.action}</span>
                            </div>
                            <span className="text-sm text-gray-500">{item.time}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 