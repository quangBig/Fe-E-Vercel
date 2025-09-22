import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { Link } from "react-router-dom";

export default function CardShelfCarousel({ title, decs, image, link, price }) {
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
        <div data-aos="fade-up" className="relative w-full py-6">
            {/* Carousel */}
            <div
                ref={scrollRef}
                className="flex gap-6 px-8"
            >
                <Link
                    to={link}
                    className="relative min-w-[300px] max-w-[400px] h-[500px] rounded-2xl overflow-hidden shadow-lg flex-shrink-0"
                >
                    {/* Ảnh nền */}
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover"
                    />

                    {/* Overlay mờ */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-transparent" />

                    {/* Text */}
                    <div className="absolute top-0 left-0 p-4 text-white">
                        <h3 className="text-xl font-semibold">{title}</h3>
                        {decs && <p className="text-sm mt-2">{decs}</p>}
                        {price && <p className="text-lg font-medium mt-3">{price}</p>}
                    </div>
                </Link>
            </div>
        </div>
    );
}
