
import OrderProductItem from './OrderProductItem';

export default function OrderList({ orders }) {
    if (!orders.length) return <div className="p-8 text-center text-gray-500">Không có đơn hàng nào.</div>;
    return (
        <div>
            {orders.map((order) => (
                <OrderProductItem key={order._id} order={order} />
            ))}
        </div>
    );
} 