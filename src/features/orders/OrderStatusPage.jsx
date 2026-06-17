import React, { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useCartStore } from "../../stores/useCartStore";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

export default function OrderStatusPage() {
    const [searchParams] = useSearchParams();
    const { clearCart } = useCartStore();

    const responseCode = searchParams.get("vnp_ResponseCode");
    const orderId = searchParams.get("vnp_TxnRef");
    const amountStr = searchParams.get("vnp_Amount");
    const transNo = searchParams.get("vnp_TransactionNo");

    const amount = amountStr ? Number(amountStr) / 100 : 0;
    const isSuccess = responseCode === "00";

    useEffect(() => {
        if (isSuccess) {
            clearCart();
        }
    }, [isSuccess, clearCart]);

    return (
        <div className="w-full min-h-screen bg-gray-50 text-black flex flex-col justify-between">
            <Header />
            
            <div className="max-w-md mx-auto my-12 px-4 flex-1 flex flex-col justify-center">
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100 transform transition-all duration-300 hover:scale-[1.01]">
                    {isSuccess ? (
                        <>
                            {/* Success Icon */}
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                                <svg
                                    className="h-10 w-10 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 13l4 4L19 7"
                                    ></path>
                                </svg>
                            </div>
                            
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Thanh toán thành công!</h2>
                            <p className="text-gray-600 text-sm mb-6">Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi.</p>
                        </>
                    ) : (
                        <>
                            {/* Failure Icon */}
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                                <svg
                                    className="h-10 w-10 text-red-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    ></path>
                                </svg>
                            </div>
                            
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Thanh toán thất bại!</h2>
                            <p className="text-gray-600 text-sm mb-6">Đã xảy ra lỗi trong quá trình thanh toán hoặc giao dịch đã bị hủy.</p>
                        </>
                    )}

                    {/* Transaction Info */}
                    <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left border border-gray-100">
                        <div className="flex justify-between py-1 text-sm">
                            <span className="text-gray-500">Mã đơn hàng:</span>
                            <span className="font-semibold text-gray-900">{orderId || "N/A"}</span>
                        </div>
                        {isSuccess && transNo && (
                            <div className="flex justify-between py-1 text-sm">
                                <span className="text-gray-500">Mã giao dịch:</span>
                                <span className="text-gray-700">{transNo}</span>
                            </div>
                        )}
                        <div className="flex justify-between py-1 text-sm">
                            <span className="text-gray-500">Số tiền:</span>
                            <span className="font-semibold text-red-600">{amount.toLocaleString("vi-VN")}₫</span>
                        </div>
                        <div className="flex justify-between py-1 text-sm">
                            <span className="text-gray-500">Phương thức:</span>
                            <span className="text-gray-700">Cổng VNPay</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                        <Link
                            to="/orders"
                            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition duration-200"
                        >
                            Xem đơn hàng của tôi
                        </Link>
                        <Link
                            to="/"
                            className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-xl transition duration-200"
                        >
                            Quay lại Trang chủ
                        </Link>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
