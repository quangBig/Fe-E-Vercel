import React, { useState, useEffect } from "react";
import OrderSidebar from "./components/OrderSidebar";
import OrderTabs from "./components/OrderTabs";
import OrderSearchBar from "./components/OrderSearchBar";
import OrderList from "./components/OrderList";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { useAuthStore } from "../../stores/useAuthStore";
import { useOrderStore } from "../../stores/useOrderStore";

export default function OrderPage() {
    const [tab, setTab] = useState("all");
    const { user } = useAuthStore();
    const { orders, getOrdersByUser, loading } = useOrderStore();

    useEffect(() => {
        if (user?.userId) {
            getOrdersByUser(user.userId);
        }
    }, [user]);




    console.log("order", orders)
    console.log("order", user)
    // Lọc đơn theo tab
    // const filteredOrders =
    //     tab === "all" ? orders : orders.filter((o) => o.status === tab);

    const filteredOrders = orders.filter(order => {
        if (tab === "all") return true;

        if (tab === "pending") {
            // Chỉ hiện đơn COD chưa thanh toán
            return (
                order.payment?.method === "cod" &&
                order.payment?.status === "pending"
            );
        }

        return order.status === tab;
    });



    return (
        <>
            <Header />
            <div className="flex bg-[#fafafa] min-h-screen text-black mt-20">
                <OrderSidebar />
                <div className="flex-1 p-8">
                    <OrderTabs current={tab} onChange={setTab} />
                    <OrderSearchBar />

                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Đang tải đơn hàng...</div>
                    ) : (
                        <OrderList orders={filteredOrders} />
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}
