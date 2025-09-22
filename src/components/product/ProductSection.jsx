import React from "react";
import { Link } from "react-router-dom";

const ProductSection = ({ title, decs, image, link, reverse, aosDelay }) => (
    <section
        data-aos="fade-up"
        data-aos-delay={aosDelay || 0}
        className={`w-full flex flex-col md:flex-row items-center justify-between gap-8 py-12 px-4 md:px-16 ${reverse ? "md:flex-row-reverse" : ""
            } animate-fadein`}
    >
        <div className="flex-1 flex flex-col items-start bg-white/80 rounded-2xl p-8 shadow-xl">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900 drop-shadow-md">
                {title}
            </h2>
            <p className="text-lg text-gray-500 mb-6 max-w-md">{decs}</p>
            {link && (
                <Link
                    to={link}
                    className="inline-block px-6 py-2 bg-gradient-to-r from-black to-gray-800 text-white rounded-full font-semibold text-base shadow-lg hover:scale-105 hover:shadow-2xl transition-transform duration-300"
                >
                    Shop now
                </Link>
            )}
        </div>
        <div className="flex-1 flex justify-center items-center">
            <img
                src={image}
                alt={title}
                className="max-h-72 md:max-h-96 object-contain drop-shadow-2xl rounded-xl transform transition-transform duration-300 hover:scale-105"
            />
        </div>
    </section>
);

export default ProductSection;