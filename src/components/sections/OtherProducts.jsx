import React, { useEffect } from "react";
import { usePageStore } from "../../stores/usePageStore";
import ProductCard from "../product/ProductCard";
import ProductGrid from "../product/ProductGrid";

const OtherProducts = () => {
    const { getPages, pages } = usePageStore();

    useEffect(() => {
        getPages();
    }, [getPages]);

    // Lọc riêng nhóm "Các dòng sản phẩm"
    const productGroup = pages.filter(
        (page) => page.bannerTitle === "Các dòng sản phẩm"
    );

    return (
        <div className="mt-16">
            <h2 className="text-2xl font-bold text-center mb-8" data-aos="fade-up">
                Các dòng sản phẩm
            </h2>

            <ProductGrid>
                {productGroup.map((p, idx) => (
                    <div
                        key={p._id}
                        data-aos="zoom-in"
                        data-aos-delay={idx * 100}
                    >
                        <ProductCard
                            image={p.image}
                            name={p.title}
                            link={p.link}
                        />
                    </div>
                ))}
            </ProductGrid>
        </div>
    );
};

export default OtherProducts;
