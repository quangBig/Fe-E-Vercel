import { useOrderStore } from "../../../stores/useOrderStore";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
    AlertDialogFooter,
} from "../../../components/ui/alert-dialog";

export default function OrderCard({ order }) {
    const { cancelOrder, removeOrder } = useOrderStore();

    return (
        <div className="border rounded-lg p-5 mb-6 bg-white shadow-md">
            {/* Header đơn hàng */}
            <div className="flex justify-between items-center mb-4">
                <div>
                    <span className="text-gray-500">Mã đơn:</span>{" "}
                    <span className="font-semibold text-base">{order._id}</span>
                </div>
                <span
                    className={`px-3 py-1 rounded text-sm font-semibold ${order.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : order.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                >
                    {order.status}
                </span>
            </div>

            {/* Danh sách sản phẩm */}
            <div>
                {order.items.map((item, index) => (
                    <div
                        key={item._id || String(item.productId) || index}
                        className="flex items-center justify-between py-3 border-b last:border-0"
                    >
                        {/* Ảnh */}
                        <img
                            src={item.image}
                            alt={item.variantName || "Sản phẩm"}
                            className="w-20 h-20 object-cover rounded border"
                        />

                        {/* Thông tin */}
                        <div className="flex-1 px-4">
                            <div className="font-semibold text-base">
                                {item.name}
                            </div>
                            <div className="text-gray-600 text-sm">
                                {item.variantName && (
                                    <span>{item.variantName}</span>
                                )}
                                {item.color && <span> / {item.color}</span>}
                            </div>
                            <div className="text-gray-500 text-sm">
                                SL: {item.quantity}
                            </div>
                        </div>

                        {/* Giá */}
                        <div className="text-[#ee4d2d] font-bold text-lg">
                            {Number(item.price).toLocaleString()}₫
                        </div>
                    </div>
                ))}
            </div>

            {/* Địa chỉ nhận hàng */}
            <div className="mt-5 text-gray-800 text-base">
                <div className="font-semibold mb-1">📍 Địa chỉ nhận hàng</div>
                <p>
                    {order.shippingAddress.firstName}{" "}
                    {order.shippingAddress.lastName}
                </p>
                <p>{order.shippingAddress.address}</p>
            </div>

            {/* Ghi chú */}
            {order.note && (
                <div className="mt-3 text-base text-gray-700 italic">
                    📝 Ghi chú: {order.note}
                </div>
            )}

            {/* Tổng tiền */}
            <div className="mt-5 text-right">
                <div className="text-gray-600 text-base">
                    Tạm tính: {Number(order.subtotal).toLocaleString()}₫
                </div>
                <div className="text-gray-600 text-base">
                    Phí ship: {Number(order.shippingFee).toLocaleString()}₫
                </div>
                <div className="text-xl font-bold text-[#ee4d2d]">
                    Tổng: {Number(order.total).toLocaleString()}₫
                </div>
            </div>

            {/* Ngày tạo */}
            <div className="mt-3 text-sm text-gray-500 text-right">
                Ngày đặt: {new Date(order.createdAt).toLocaleString()}
            </div>

            {/* Các nút hành động */}
            <div className="mt-5 flex gap-3 justify-end">
                <button className="px-5 py-2 bg-[#ee4d2d] text-white rounded hover:bg-[#d8431f]">
                    Mua Lại
                </button>
                <button className="px-5 py-2 border rounded hover:bg-gray-100">
                    Đánh Giá
                </button>
                <button className="px-5 py-2 border rounded hover:bg-gray-100">
                    Liên Hệ Người Bán
                </button>

                {/* Nếu đơn còn pending thì cho phép hủy */}
                {order.status === "pending" && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <button className="px-5 py-2 border rounded text-red-500 hover:bg-red-50">
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
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg"
                                >
                                    Xác nhận hủy
                                </button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}

                {/* Nếu đơn đã cancelled thì cho phép xóa hẳn */}
                {order.status === "cancelled" && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <button className="px-5 py-2 border rounded text-red-500 hover:bg-red-50">
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
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg"
                                >
                                    Xác nhận xóa
                                </button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </div>
        </div>
    );
}
