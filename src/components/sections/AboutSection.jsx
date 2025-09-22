import React from "react";

const AboutSection = ({ aboutUsData }) => {
    // Dữ liệu mặc định nếu không có dữ liệu từ Page Management
    const features = [
        {
            icon: "✅",
            title: "Chính hãng 100%",
            desc: "Sản phẩm Apple chính hãng, bảo hành toàn quốc."
        },
        {
            icon: "🚚",
            title: "Giao hàng nhanh",
            desc: "Giao hàng toàn quốc, nhận hàng trong 1-3 ngày."
        },
        {
            icon: "🔒",
            title: "Thanh toán an toàn",
            desc: "Nhiều phương thức thanh toán, bảo mật tuyệt đối."
        },
        {
            icon: "💬",
            title: "Hỗ trợ 24/7",
            desc: "Tư vấn và hỗ trợ khách hàng mọi lúc, mọi nơi."
        },
    ];

    return (
        <div data-aos="fade-up">
            <div className="text-3xl font-semibold ml-20 mt-10 whitespace-pre-line">
                <h1>
                    Về Chúng Tôi
                </h1>
            </div>
            <section

                className="w-[80%] flex my-16 p-0 bg-gradient-to-r from-gray-100 via-white to-gray-100 animate-gradient-x overflow-hidden rounded-xl mx-auto"
                style={{ minHeight: '420px' }}
            >
                <div className="w-full flex flex-col items-center py-12 px-2 md:px-8">

                    <p className="text-lg text-gray-500 mb-8 text-center max-w-2xl">
                        {aboutUsData?.description || "Apple Store cam kết mang đến cho khách hàng sản phẩm và dịch vụ tốt nhất, hàng Apple chính hãng, trải nghiệm mua sắm hiện đại, an toàn và tiện lợi."}
                    </p>

                    {aboutUsData?.image && (
                        <div className="mb-8">
                            <img
                                src={aboutUsData.image}
                                alt={aboutUsData.nameaboutUs}
                                className="max-h-64 rounded-lg shadow-lg"
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full mt-4">
                        {features.map((f) => (
                            <div
                                key={f.title}
                                className="flex flex-col items-center bg-white rounded-xl shadow p-6 h-full transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
                            >
                                <div className="text-4xl mb-2 animate-bounce-slow">{f.icon}</div>
                                <div className="font-bold text-lg mb-1 text-gray-900">{f.title}</div>
                                <div className="text-gray-500 text-center text-sm">{f.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutSection;