import React, { useEffect, useState } from "react";
import { useOrderStore } from "../../../stores/useOrderStore";
import OrderTabs from "../../orders/components/OrderTabs";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
} from "../../../components/ui/alert-dialog";

export default function OrderManagement() {
    const { orders, loading, getOrders, updateOrderStatus, cancelOrder, removeOrder } = useOrderStore();
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        getOrders();
    }, [getOrders]);

    console.log(orders, "poi")

    // Lọc đơn theo tab
    const filteredOrders = orders.filter(order => {
        if (filter === "all") return true;

        if (filter === "pending") {
            // Chỉ hiện đơn COD chưa thanh toán
            return order.payment.method === "cod" && order.payment.status === "pending";
        }

        return order.status === filter;
    });



    return (
        <div className="p-6" data-aos="fade-up">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Quản lý đơn hàng</h2>

            {/* Tabs */}
            <OrderTabs current={filter} onChange={setFilter} />

            {/* Table */}
            <div className="bg-white shadow-md rounded-lg mt-4 overflow-x-auto">
                {loading ? (
                    <p className="p-4">Đang tải...</p>
                ) : (
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700 text-left">
                                <th className="px-4 py-3">Mã ĐH</th>
                                <th className="px-4 py-3">Khách hàng</th>
                                <th className="px-4 py-3">Tổng tiền</th>
                                <th className="px-4 py-3">Thanh toán</th>
                                <th className="px-4 py-3">Trạng thái</th>
                                <th className="px-4 py-3">Ngày tạo</th>
                                <th className="px-4 py-3">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                                        Không có đơn hàng
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map(order => (
                                    <tr key={order._id} className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-3">{order._id.slice(-6).toUpperCase()}</td>
                                        <td className="px-4 py-3">
                                            {order.shippingAddress.lastName} {order.shippingAddress.firstName}
                                            <div className="text-xs text-gray-500">{order.shippingAddress.phoneNumber}</div>
                                        </td>
                                        <td className="px-4 py-3">{order.total.toLocaleString()} ₫</td>
                                        <td className="px-4 py-3">
                                            {order.payment.method === "cod" ? "COD" : "Momo"} -{" "}
                                            <span
                                                className={`font-medium ${order.payment.status === "paid"
                                                    ? "text-green-600"
                                                    : order.payment.status === "failed"
                                                        ? "text-red-600"
                                                        : "text-yellow-600"
                                                    }`}
                                            >
                                                {order.payment.method === "cod" && order.payment.status === "pending"
                                                    ? "chờ thanh toán"
                                                    : order.payment.status}
                                            </span>
                                        </td>

                                        <td className="px-4 py-3">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium
                                                ${order.status === "pending" ? "bg-yellow-100 text-yellow-600" : ""}
                                                ${order.status === "processing" ? "bg-blue-100 text-blue-600" : ""}
                                                ${order.status === "shipping" ? "bg-indigo-100 text-indigo-600" : ""}
                                                ${order.status === "completed" ? "bg-green-100 text-green-600" : ""}
                                                ${order.status === "cancelled" ? "bg-red-100 text-red-600" : ""}`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {new Date(order.createdAt || "").toLocaleString("vi-VN", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                second: "2-digit",
                                                hour12: false
                                            })}
                                        </td>
                                        <td className="px-4 py-3 space-x-2 flex flex-wrap gap-2">
                                            <button
                                                onClick={() => updateOrderStatus(order._id, "shipping")}
                                                className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                                            >
                                                Vận chuyển
                                            </button>

                                            <button
                                                onClick={() => updateOrderStatus(order._id, "delivering")}
                                                className="px-2 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-600"
                                            >
                                                Chờ giao hàng
                                            </button>
                                            <button
                                                onClick={() => updateOrderStatus(order._id, "completed")}
                                                className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                                            >
                                                Hoàn thành
                                            </button>

                                            {/* Hủy đơn hàng */}
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <button className="px-2 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600">
                                                        Hủy Đơn Hàng
                                                    </button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Hủy đơn hàng?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Bạn có chắc chắn muốn hủy đơn này không? Hành động này
                                                            không thể hoàn tác.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Quay lại</AlertDialogCancel>
                                                        <button
                                                            onClick={async () => {
                                                                try {
                                                                    await cancelOrder(order._id);
                                                                } catch (err) {
                                                                    console.error(err);
                                                                }
                                                            }}
                                                            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                                                        >
                                                            Xác nhận hủy
                                                        </button>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>

                                            {/* Xóa đơn hàng */}
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <button className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600">
                                                        Xóa Đơn Hàng
                                                    </button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Xóa đơn hàng?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Sau khi xóa, bạn sẽ không thể xem lại đơn này nữa.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Quay lại</AlertDialogCancel>
                                                        <button
                                                            onClick={async () => {
                                                                try {
                                                                    await removeOrder(order._id);
                                                                } catch (err) {
                                                                    console.error(err);
                                                                }
                                                            }}
                                                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                                                        >
                                                            Xác nhận xóa
                                                        </button>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </td>

                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
