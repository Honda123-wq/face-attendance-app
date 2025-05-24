import React from "react";

const DownloadCSVButton = () => {
  const handleDownload = () => {
    const data = JSON.parse(localStorage.getItem("attendance") || "[]");

    if (data.length === 0) {
      alert("出力する勤怠データがありません");
      return;
    }

    const header = ["名前", "社員ID", "区分", "日時"];
    const rows = data.map((row) => [row.name, row.id, row.type, row.time]);

    const csvContent =
      "\uFEFF" + // ここがBOM！
      [header, ...rows]
        .map((e) => e.map((cell) => `"${cell}"`).join(","))
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "勤怠データ.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button onClick={handleDownload} className="btn mt-4">
      CSVダウンロード
    </button>
  );
};

export default DownloadCSVButton;
