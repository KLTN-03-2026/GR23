"use client";
import { authService } from "@/services/auth.service";
import { useEffect, useState } from "react";

interface UserItem {
  id: number;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "Student",
  });

  useEffect(() => {
    if (!authService.isAdmin()) {
      window.location.href = "/";
    }

    const loadUsers = async () => {
      try {
        const response = await fetch("https://localhost:7083/api/Users");
        if (!response.ok) throw new Error("Không thể tải danh sách người dùng");
        const result = await response.json();
        setUsers(result);
        setFilteredUsers(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  useEffect(() => {
    const keyword = search.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.fullName?.toLowerCase().includes(keyword) ||
        user.email?.toLowerCase().includes(keyword) ||
        user.role?.toLowerCase().includes(keyword),
    );
    setFilteredUsers(filtered);
  }, [search, users]);

  const handleOpenCreate = () => {
    setSelectedUser(null);
    setFormData({ fullName: "", email: "", role: "Student" });
    setShowModal(true);
  };

  const handleOpenEdit = (user: UserItem) => {
    setSelectedUser(user);
    setFormData({
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa người dùng này?")) return;
    try {
      await fetch(`https://localhost:7083/api/Users/${id}`, {
        method: "DELETE",
      });
      setUsers((prev) => prev.filter((user) => user.id !== id));
      setFilteredUsers((prev) => prev.filter((user) => user.id !== id));
    } catch {
      alert("Xóa người dùng thất bại");
    }
  };

  const handleSave = async () => {
    try {
      const config = selectedUser
        ? {
            url: `https://localhost:7083/api/Users/${selectedUser.id}`,
            method: "PUT",
          }
        : { url: "https://localhost:7083/api/Users", method: "POST" };

      await fetch(config.url, {
        method: config.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          selectedUser ? formData : { ...formData, password: "123456" },
        ),
      });
      window.location.reload();
    } catch {
      alert("Lưu thất bại");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-10 relative">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold mb-2 text-slate-900">
              Quản lý người dùng
            </h1>
            <p className="text-slate-600">
              Theo dõi và quản lý toàn bộ tài khoản trong hệ thống
            </p>
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              
              placeholder="Tìm kiếm theo tên, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-[280px] px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm"
            />

            <button
              onClick={handleOpenCreate}
              className="px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 hover:shadow-lg active:scale-95 transition-all"
            >
              + Thêm người dùng
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">👤</div>
              <h2 className="text-2xl font-bold mb-2 text-slate-900">
                Không tìm thấy người dùng
              </h2>
              <p className="text-slate-500">Thử tìm kiếm với từ khóa khác</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-600">
                      Người dùng
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-600">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-600">
                      Vai trò
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-600">
                      Ngày tạo
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-slate-600">
                      Hành động
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                            {user.fullName?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">
                              {user.fullName}
                            </p>
                            <p className="text-xs text-slate-500 font-mono">
                              ID: #{user.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-slate-700">{user.email}</td>
                      <td className="px-6 py-5">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold border ${
                            user.role === "Admin"
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : "bg-blue-50 text-blue-700 border-blue-200"
                          }`}
                        >
                          {user.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-slate-500 text-sm">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString("vi-VN")
                          : "---"}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(user)}
                            className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition text-sm font-medium"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition text-sm font-medium"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl">
              <h2 className="text-2xl font-bold mb-6 text-slate-900">
                {selectedUser ? "Cập nhật người dùng" : "Thêm người dùng mới"}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    placeholder="Nhập tên đầy đủ"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="example@gmail.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Vai trò
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-blue-500"
                  >
                    <option value="Student">Student</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-medium transition"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-md transition"
                >
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
