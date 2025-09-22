import React from 'react';
import { Link } from 'react-router-dom';


const Footer = ({ logoColor = "#fff" }) => {
    return (
        <div className="pt-10">
            <footer className="bg-[#1d1d1f] text-white py-10">
                <div className="max-w-[1200px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-10">

                    {/* Logo và giới thiệu */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center gap-2 cursor-pointer">
                            <Link to="/">
                                <svg
                                    width="32"
                                    height="32"
                                    viewBox="0 0 32 32"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-8 w-8"
                                >
                                    <path
                                        d="M25.7 17.6c-.1-3.2 2.6-4.7 2.7-4.8-1.5-2.2-3.8-2.5-4.6-2.6-2-0.2-3.9 1.2-4.9 1.2-1 0-2.5-1.2-4.1-1.1-2.1.1-4.1 1.2-5.2 3-2.2 3.7-.6 9.1 1.6 12.1 1.1 1.5 2.4 3.2 4.1 3.1 1.6-.1 2.2-1 4.1-1 1.9 0 2.4 1 4.1 1 1.7 0 2.8-1.5 3.8-3 1.2-1.7 1.7-3.4 1.7-3.5 0-.1-3.2-1.2-3.3-4.7zM21.6 7.2c.9-1.1 1.5-2.6 1.3-4.2-1.3.1-2.8.9-3.7 2-0.8.9-1.5 2.5-1.2 4 .1 0 2.1-.1 3.6-1.8z"
                                        fill={logoColor}
                                    />
                                </svg>
                            </Link>
                            <hr className="h-8 w-0.5 bg-gray-400 hidden sm:block" />
                            <span className="text-sm hidden sm:block">Apple Store</span>
                        </Link>


                        {/* Social Media */}

                    </div>

                    {/* Thông tin */}
                    <div>
                        <h3 className="text-lg font-semibold">Thông tin</h3>
                        <ul className="mt-2 space-y-2 text-gray-400 text-sm">
                            <li><a href="#">Newsfeed</a></li>
                            <li><a href="#">Giới thiệu</a></li>
                            <li><a href="#">Check IMEI</a></li>
                            <li><a href="#">Phương thức thanh toán</a></li>
                            <li><a href="#">Thuê điểm bán lẻ</a></li>
                            <li><a href="#">Bảo hành và sửa chữa</a></li>
                            <li><a href="#">Tuyển dụng</a></li>
                            <li><a href="#">Đảm bảo chất lượng, khiếu nại</a></li>
                            <li><a href="#">Tra cứu hóa đơn điện tử</a></li>
                        </ul>
                    </div>

                    {/* Chính sách */}
                    <div>
                        <h3 className="text-lg font-semibold">Chính sách</h3>
                        <ul className="mt-2 space-y-2 text-gray-400 text-sm">
                            <li><a href="#">Thu cũ đổi mới</a></li>
                            <li><a href="#">Giao hàng</a></li>
                            <li><a href="#">Đổi trả</a></li>
                            <li><a href="#">Bảo hành</a></li>
                            <li><a href="#">Hủy giao dịch</a></li>
                            <li><a href="#">Giải quyết khiếu nại</a></li>
                            <li><a href="#">Bảo mật thông tin</a></li>
                            <li><a href="#">Hướng dẫn thanh toán qua VNPAY</a></li>
                        </ul>
                    </div>

                    {/* Liên hệ */}
                    <div>
                        <h3 className="text-lg font-semibold">Liên hệ</h3>
                        <ul className="mt-2 space-y-2 text-gray-400 text-sm">
                            <li>Mua hàng: <a href="tel:19006626" className="text-blue-400">1900.6626</a></li>
                            <li>Bảo hành: <a href="tel:19008036" className="text-blue-400">1900.8036</a></li>
                            <li>Doanh nghiệp: <a href="tel:0822688668" className="text-blue-400">0822.688.668</a></li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 border-t border-gray-700 pt-6 flex flex-col md:flex-row items-center justify-between px-6">
                    <div className="text-gray-500 text-xs text-center md:text-left">
                        <p>&copy; 2016 Công ty Cổ Phần HESMAN Việt Nam GPDKKD: 0107465657 do Sở KH & ĐT TP. Hà Nội cấp ngày 08/06/2016.</p>
                        <p>Địa chỉ: Số 76 Thái Hà, phường Trung Liệt, quận Đống Đa, thành phố Hà Nội, Việt Nam</p>
                        <p>Đại diện pháp luật: PHẠM MẠNH HÒA | ĐT: 0247.305.9999 | Email: lienhe@shopdunk.com</p>
                    </div>

                    {/* Bộ Công Thương */}
                    <div className="mt-4 md:mt-0 ">
                        <img src="https://shopdunk.com/images/uploaded-source/Trang%20ch%E1%BB%A7/Bocongthuong.png" alt="Bộ Công Thương" className="h-10 w-36" />
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Footer;
