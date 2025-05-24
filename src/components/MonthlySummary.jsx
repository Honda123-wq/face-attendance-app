import React, { useEffect, useState } from "react";

const MonthlySummary = () => {
  const [summary, setSummary] = useState({});

  useEffect(() => {
    const rawData = JSON.parse(localStorage.getItem("attendance") || "[]");

    const grouped = {};

    rawData.forEach((entry) => {
      const month = entry.time.slice(0, 7); // "2025-05"
      if (!grouped[month]) {
        grouped[month] = { 出勤: 0, 退勤: 0, 外出: 0, 早退: 0 };
      }
      if (grouped[month][entry.type] !== undefined) {
        grouped[month][entry.type]++;
      }
    });

    setSummary(grouped);
  }, []);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-2">📆 勤怠集計（月別）</h2>
      <table className="border table-auto">
        <thead>
          <tr>
            <th className="border px-2">月</th>
            <th className="border px-2">出勤</th>
            <th className="border px-2">退勤</th>
            <th className="border px-2">外出</th>
            <th className="border px-2">早退</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(summary).map(([month, data]) => (
            <tr key={month}>
              <td className="border px-2">{month}</td>
              <td className="border px-2">{data["出勤"]}</td>
              <td className="border px-2">{data["退勤"]}</td>
              <td className="border px-2">{data["外出"]}</td>
              <td className="border px-2">{data["早退"]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MonthlySummary;
