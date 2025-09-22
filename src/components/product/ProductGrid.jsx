import React from "react";
import "../../index.css";

/**
 * ProductGrid: Bọc các ProductCard với hiệu ứng filter card đẹp như hình mẫu
 * Sử dụng: <ProductGrid>{products.map(p => <ProductCard ... />)}</ProductGrid>
 */
const ProductGrid = ({ children }) => {
    return (
        <div className="card-grid max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-10 mt-8">
            {React.Children.map(children, (child, idx) => (
                <div className="card group relative overflow-hidden rounded-2xl transition-all duration-500 h-full flex flex-col">
                    {/* Card content */}
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        {child}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductGrid;

