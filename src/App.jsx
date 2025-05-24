import React, { useState } from "react";
import FaceRecognition from "./components/FaceRecognition";
import DownloadCSVButton from "./components/DownloadCSVButton";
import AttendanceSummary from "./components/AttendanceSummary";
import EmployeeList from "./components/EmployeeList";
import MonthlySummary from "./components/MonthlySummary";

function App() {
  const [mode, setMode] = useState("認証");
  const [employee, setEmployee] = useState(null);
  const [status, setStatus] = useState("");

  const handleFaceMatch = (userData) => {
    setEmployee(userData);
  };

  const handleStatus = (type) => {
    const now = new Date().toLocaleString();
    const record = {
      ...employee,
      type,
      time: now,
    };

    const records = JSON.parse(localStorage.getItem("attendance") || "[]");
    records.push(record);
    localStorage.setItem("attendance", JSON.stringify(records));

    setStatus(`✅ ${employee.name} さんが ${type} しました（${now}）`);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">顔認証勤怠システム</h1>

      <div className="flex gap-2 mb-4">
        <button onClick={() => setMode("認証")} className="btn">
          認証モード
        </button>
        <button onClick={() => setMode("登録")} className="btn">
          登録モード
        </button>
      </div>

      <FaceRecognition mode={mode} onMatch={handleFaceMatch} />
      <DownloadCSVButton />
      <AttendanceSummary />
      <EmployeeList />
      <MonthlySummary />

      {mode === "認証" && employee && (
        <div className="mt-4">
          <p>
            ようこそ、{employee.name}（社員番号: {employee.id}）さん！
          </p>
          <div className="flex gap-2 mt-2">
            <button onClick={() => handleStatus("出勤")} className="btn">
              出勤
            </button>
            <button onClick={() => handleStatus("退勤")} className="btn">
              退勤
            </button>
            <button onClick={() => handleStatus("外出")} className="btn">
              外出
            </button>
            <button onClick={() => handleStatus("早退")} className="btn">
              早退
            </button>
          </div>
        </div>
      )}

      {status && <p className="mt-4 text-green-600">{status}</p>}
    </div>
  );
}

export default App;
