// src/pages/BannerPage.tsx
import { useParams } from "react-router-dom";
import { usePageProductStore } from "../../stores/usePageProduct";
import { useMemo } from "react";

const VideoProduct = () => {
    const { slug } = useParams();
    const { pageProducts } = usePageProductStore();

    // ✅ Tìm đúng product theo slug
    const product = useMemo(
        () => pageProducts.find((p) => p.slug === slug),
        [pageProducts, slug]
    );

    if (!product) {
        return <div className="text-center mt-10">❌ Không tìm thấy sản phẩm</div>;
    }

    const { bannerVideo, bannerContent } = product;

    // ✅ Chuẩn hóa URL video
    const videoUrl = useMemo(() => {
        if (!bannerVideo?.url) return null;
        const base = import.meta.env.VITE_API_URL || "";
        return bannerVideo.url.startsWith("http")
            ? bannerVideo.url
            : `${base}${bannerVideo.url}`;
    }, [bannerVideo]);

    return (
        <div className="mt-10 space-y-10">
            {/* Video Banner */}
            {videoUrl ? (
                <div className="flex justify-center">
                    <div className="w-full max-w-7xl aspect-video bg-black rounded-xl overflow-hidden">
                        <video
                            className="w-full h-full object-cover"
                            autoPlay
                            muted
                            loop
                            controls
                            poster={bannerContent?.image || "/placeholder-video.jpg"}
                            onError={(e) => console.error("Video load error:", e)}
                        >
                            <source src={videoUrl} type="video/mp4" />
                            Trình duyệt của bạn không hỗ trợ video.
                        </video>
                    </div>
                </div>
            ) : (
                <div className="text-center">📹 Không có video</div>
            )}
        </div>
    );
};

export default VideoProduct;
