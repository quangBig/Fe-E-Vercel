import { useEffect } from "react";
import { usePageProductStore } from "../../stores/usePageProduct";
import { Link } from "react-router-dom";

export default function ProductCarousel() {
    const { pageProducts, getPageProducts } = usePageProductStore();

    useEffect(() => {
        getPageProducts();
    }, [getPageProducts]);

    return (
        <div data-aos="fade-up" className="relative w-full">
            <div className="text-3xl font-semibold ml-20 mt-20 whitespace-pre-line">
                <h1>
                    Cửa Hàng. Cách tốt nhất để mua {"\n"}sản phẩm bạn thích.
                </h1>
            </div>

            <div
                id="carousel"
                className="flex space-x-4 overflow-x-auto no-scrollbar ml-20 mt-5"
            >
                {pageProducts.map((p) => (
                    <Link
                        key={p._id}
                        to={p.slug || "#"}
                        className="min-w-[160px] flex flex-col items-center hover:scale-105 transition-transform"
                    >
                        <img
                            src={p.image}
                            alt={p.name}
                            className="w-[120px] h-[90px] object-contain rounded-xl"
                        />
                        <span className="mt-2 text-lg font-medium">{p.name}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
