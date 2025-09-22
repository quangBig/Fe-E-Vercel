import { useEffect, useState } from "react";
import axios from "../../../lib/axios";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const COLORS = {
    good: "#34D399", // xanh lá
    bad: "#F87171",  // đỏ
    neutral: "#FBBF24", // vàng
};

const sentimentLabel = (id) => {
    switch (id) {
        case "good": return "Tốt 😄";
        case "bad": return "Xấu 😞";
        default: return "Trung lập 😐";
    }
};

const AnalyticsManagement = () => {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get("/chat/stats/sentiment");
                setStats(res.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const total = stats?.reduce((sum, s) => sum + (s.count || 0), 0) || 0;

    if (loading) return <div>Đang tải thống kê...</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-xl font-bold">Thống kê cảm xúc chat</h2>

            {/* Pie Chart */}
            <PieChart width={300} height={300}>
                <Pie
                    data={stats}
                    dataKey="count"
                    nameKey="_id"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry) => sentimentLabel(entry._id)}
                >
                    {stats.map((entry) => (
                        <Cell
                            key={entry._id}
                            fill={COLORS[entry._id] || COLORS.neutral}
                        />
                    ))}
                </Pie>
                <Tooltip
                    formatter={(value, name) => [
                        `${value} (${((value / total) * 100).toFixed(1)}%)`,
                        sentimentLabel(name),
                    ]}
                />
                <Legend formatter={(name) => sentimentLabel(name)} />
            </PieChart>

            {/* Text stats */}
            {stats.map((s) => (
                <div key={s._id} className="flex justify-between">
                    <span>{sentimentLabel(s._id)}</span>
                    <span>{s.count} ({total ? ((s.count / total) * 100).toFixed(1) : 0}%)</span>
                </div>
            ))}

            <div className="text-gray-500">Tổng: {total} tin nhắn</div>
        </div>
    );
};

export default AnalyticsManagement;
