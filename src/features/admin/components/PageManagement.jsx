import React, { useState } from "react";
import PageHomeManagement from "./componentspage/PageHomeManagement";
import PageProductsManagement from "./componentspage/PageProductsManagement";


const PageManagement = () => {
    const [activeTab, setActiveTab] = useState("home");

    return (
        <div className="space-y-6">
            <div className="flex space-x-4 border-b">
                <button
                    className={`px-4 py-2 ${activeTab === "home" ? "border-b-2 border-blue-600 text-blue-600" : ""}`}
                    onClick={() => setActiveTab("home")}
                >
                    Trang chủ
                </button>
                <button
                    className={`px-4 py-2 ${activeTab === "product" ? "border-b-2 border-blue-600 text-blue-600" : ""}`}
                    onClick={() => setActiveTab("product")}
                >
                    Trang sản phẩm
                </button>
            </div>

            {activeTab === "home" ? <PageHomeManagement /> : <PageProductsManagement />}
        </div>
    );
};

export default PageManagement;
