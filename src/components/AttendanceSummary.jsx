import React, { useEffect, useState } from "react";

const AttendanceSummary = () => {
  const [summary, setSummary] = useState({});

  useEffect(() => {
    const rawData = JSON.parse(localStorage.getItem("attendance") || "[]");

    const grouped = {};

    rawData.forEach((entry) => {
      const date = entry.time.split(" ")[0]; // 日付だけ抜き出し
      if (!grouped[date]) {
        grouped[date] = { 出勤: 0, 退勤: 0, 外出: 0, 早退: 0 };
      }
      if (grouped[date][entry.type] !== undefined) {
        grouped[date][entry.type]++;
      }
    });

    setSummary(grouped);
  }, []);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-2">📊 勤怠集計（日別）</h2>
      <table className="border table-auto">
        <thead>
          <tr>
            <th className="border px-2">日付</th>
            <th className="border px-2">出勤</th>
            <th className="border px-2">退勤</th>
            <th className="border px-2">外出</th>
            <th className="border px-2">早退</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(summary).map(([date, data]) => (
            <tr key={date}>
              <td className="border px-2">{date}</td>
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

export default AttendanceSummary;
