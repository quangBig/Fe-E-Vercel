import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ image, name, des, link }) => (
    <div className=" bg-white rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col items-center">
        <img src={image} alt={name} className="h-72 w-full object-contain mb-4" />
        <h3 className="font-semibold text-2xl mb-2">{name}</h3>
        <p className="text-green-600 font-bold mb-2">{des}</p>
        <Link
            to={link}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
            Tìm hiểu ngay
        </Link>
    </div>
);

export default ProductCard; 