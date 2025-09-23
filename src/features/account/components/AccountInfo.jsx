import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function AccountInfo({ user, onEdit }) {
    return (
        <div className="bg-white rounded-lg shadow p-8 max-w-xl mx-auto">
            <div className="flex items-center gap-6 mb-8">
                <AccountCircleIcon style={{ fontSize: 60 }} />
                <div>
                    <div className="text-2xl font-bold">{user.name}</div>
                    <div className="text-gray-500">{user.email}</div>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <div className="text-gray-500 text-sm mb-1">Số điện thoại</div>
                    <div className="font-medium">{user.phonenumber || "Chưa cập nhật"}</div>
                </div>
                {/* <div>
                    <div className="text-gray-500 text-sm mb-1">Ngày sinh</div>
                    <div className="font-medium">{user.birthday || "Chưa cập nhật"}</div>
                </div>
                <div>
                    <div className="text-gray-500 text-sm mb-1">Giới tính</div>
                    <div className="font-medium">{user.gender || "Chưa cập nhật"}</div>
                </div>
                <div>
                    <div className="text-gray-500 text-sm mb-1">Địa chỉ</div>
                    <div className="font-medium">{user.address || "Chưa cập nhật"}</div>
                </div> */}
            </div>
            <button
                className="mt-8 px-6 py-2 bg-[#ee4d2d] text-white rounded hover:bg-orange-600 transition"
                onClick={onEdit}
            >
                Sửa thông tin
            </button>
        </div>
    );
}
