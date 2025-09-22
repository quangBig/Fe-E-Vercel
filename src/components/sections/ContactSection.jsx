import React from "react";

const ContactSection = () => (
    <div data-aos="fade-up">
        <div className="text-3xl font-semibold ml-20 mt-10 whitespace-pre-line">
            <h1>
                Liên hệ với chúng tôi
            </h1>
        </div>
        <section className="w-full max-w-3xl mx-auto my-16 bg-white/80 rounded-2xl shadow-xl p-8 flex flex-col items-center">

            <p className="text-lg text-gray-500 mb-8 text-center">Bạn có câu hỏi hoặc muốn hợp tác? Hãy điền vào form dưới đây, chúng tôi sẽ phản hồi sớm nhất!</p>
            <form className="w-full flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="font-semibold text-gray-700">Họ và tên</label>
                    <input id="name" type="text" className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black" placeholder="Nhập họ tên của bạn" required />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="font-semibold text-gray-700">Email</label>
                    <input id="email" type="email" className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black" placeholder="you@email.com" required />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="message" className="font-semibold text-gray-700">Nội dung</label>
                    <textarea id="message" rows="4" className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black" placeholder="Bạn cần hỗ trợ gì?" required />
                </div>
                <button type="submit" className="mt-2 px-8 py-3 bg-gradient-to-r from-black to-gray-800 text-white rounded-full font-semibold text-lg shadow-lg hover:scale-105 hover:shadow-2xl transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-black">Gửi liên hệ</button>
            </form>
        </section>
    </div>
);

export default ContactSection; 