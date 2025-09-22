import { Link } from "react-router-dom";

const ProductDetailComparison = ({ products = [] }) => {
    return (
        <div className="w-full bg-[#fafafd] py-8 px-2 md:px-8">
            <div className="text-3xl font-semibold ml-20 mt-10 whitespace-pre-line">
                <h1>Khám phá các dòng sản phẩm</h1>
            </div>

            <div className="w-full flex justify-center mt-10">
                {/* items-stretch để các card có cùng chiều cao */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch max-w-7xl">
                    {products.map((product) => (
                        <div
                            key={product._id || product.name}
                            className="bg-white rounded-xl shadow p-4 flex flex-col items-center h-full"
                            style={{ boxShadow: "0 2px 8px 0 rgba(0,0,0,0.04)" }}
                        >
                            {/* IMAGE WRAPPER: cố định khung để ảnh đều nhau */}
                            <div className="w-28 h-40 flex items-center justify-center mb-3">
                                <img
                                    src={product.images?.[0] || "/placeholder-product.png"}
                                    alt={product.name}
                                    className="max-w-full max-h-full object-contain"
                                />
                            </div>

                            {/* Thông tin giữ khoảng cách đều bằng flex-1 */}
                            <div className="flex-1 flex flex-col items-center justify-center text-center px-2">
                                {/* Dots màu */}
                                {product.colors && (
                                    <div className="flex gap-1 mb-2">
                                        {product.colors.map((color, i) => (
                                            <span
                                                key={i}
                                                className="w-3 h-3 rounded-full border border-gray-200"
                                                style={{ background: color }}
                                            />
                                        ))}
                                    </div>
                                )}

                                <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                                <p className="text-gray-500 text-sm mb-2">
                                    {product.Outstandingfeatures}
                                </p>
                                <p className="text-black font-bold text-base mb-2">
                                    {product.price}
                                </p>
                            </div>

                            {/* Actions luôn nằm dưới cùng */}
                            <div className="flex gap-2 mt-3">
                                <Link
                                    to={`/product/${product._id}`} // hoặc product.slug nếu dùng slug
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded text-sm font-medium"
                                >
                                    Tìm hiểu thêm
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductDetailComparison;
