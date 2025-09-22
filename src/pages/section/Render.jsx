import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductSection from "../../components/product/ProductSection";
import CardShelfCarousel from "../../components/common/CardShelfCarousel.JSX";

const sectionMap = {
    product: ProductSection,
    carousel: CardShelfCarousel,
};

const PageRenderer = ({ pages }) => {
    // Gom nhóm theo bannerTitle
    const groupedPages = pages.reduce((acc, page) => {
        if (!acc[page.bannerTitle]) acc[page.bannerTitle] = [];
        acc[page.bannerTitle].push(page);
        return acc;
    }, {});

    return (
        <div>
            {Object.entries(groupedPages).map(([bannerTitle, group], idx) => {
                const sectionType = group[0]?.section;

                return (
                    <div key={bannerTitle} className="mb-10 relative">
                        {/* Tiêu đề */}
                        <h2 className="text-3xl font-semibold ml-20 mt-10 whitespace-pre-line">
                            {bannerTitle}
                        </h2>

                        {/* Product → hiện dọc */}
                        {sectionType === "product" && (
                            <div className="flex flex-col gap-6 px-6 mt-5">
                                {group.map((page, index) => {
                                    const SectionComponent = sectionMap[page.section];
                                    if (!SectionComponent) return null;

                                    return (
                                        <SectionComponent
                                            key={page._id}
                                            {...page}
                                            aosDelay={(idx + index) * 100}
                                        />
                                    );
                                })}
                            </div>
                        )}

                        {/* Carousel → hiện ngang + nút trái phải */}
                        {sectionType === "carousel" && (
                            <CarouselSection group={group} idx={idx} />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

// Component con cho carousel
const CarouselSection = ({ group, idx }) => {
    const scrollRef = useRef(null);

    const scroll = (dir) => {
        if (!scrollRef.current) return;
        const scrollAmount = 400;
        scrollRef.current.scrollBy({
            left: dir === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
    };

    return (
        <div className="relative">
            {/* List item */}
            <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-hidden scroll-smooth no-scrollbar px-6 mt-5 ml-10"
            >
                {group.map((page, index) => {
                    const SectionComponent = sectionMap[page.section];
                    if (!SectionComponent) return null;

                    return (
                        <div
                            key={page._id}
                            className="min-w-[400px] max-w-[700px] flex-shrink-0"
                        >
                            <SectionComponent
                                {...page}
                                aosDelay={(idx + index) * 100}
                            />
                        </div>
                    );
                })}
            </div>

            {/* Nút trái */}
            <button
                onClick={() => scroll("left")}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Nút phải */}
            <button
                onClick={() => scroll("right")}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
            >
                <ChevronRight className="w-6 h-6" />
            </button>
        </div>
    );
};

export default PageRenderer;
