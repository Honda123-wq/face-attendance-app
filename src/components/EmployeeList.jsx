import React, { useEffect, useState } from "react";

const EmployeeList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    setUsers(data);
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("この社員を削除しますか？")) return;

    const updated = users.filter((user) => user.id !== id);
    localStorage.setItem("registeredUsers", JSON.stringify(updated));
    setUsers(updated);
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-2">👥 登録済み社員一覧</h2>
      <table className="border table-auto">
        <thead>
          <tr>
            <th className="border px-2">名前</th>
            <th className="border px-2">社員ID</th>
            <th className="border px-2">操作</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border px-2">{user.name}</td>
              <td className="border px-2">{user.id}</td>
              <td className="border px-2">
                <button
                  onClick={() => handleDelete(user.id)}
                  className="btn text-red-600"
                >
                  削除
                </button>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan="3" className="border px-2 text-center text-gray-500">
                登録されている社員はいません
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;
