"use client";

import { authService } from "@/services/auth.service";
import { useEffect, useState } from "react";
import api from "@/services/common";

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
        const response = await api.get(
          "https://localhost:7083/api/Users"
        );

        if (response.status !== 200) {
          throw new Error("Không thể tải danh sách người dùng");
        }

        const result = response.data;

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
        user.role?.toLowerCase().includes(keyword)
    );

    setFilteredUsers(filtered);
  }, [search, users]);

  const handleOpenCreate = () => {
    setSelectedUser(null);

    setFormData({
      fullName: "",
      email: "",
      role: "Student",
    });

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
    if (!confirm("Bạn có chắc muốn xóa người dùng này?")) {
      return;
    }

    try {
      await api.delete(
        `https://localhost:7083/api/Users/${id}`
      );

      setUsers((prev) =>
        prev.filter((user) => user.id !== id)
      );

      setFilteredUsers((prev) =>
        prev.filter((user) => user.id !== id)
      );
    } catch {
      alert("Xóa người dùng thất bại");
    }
  };

  const handleSave = async () => {
    try {
      if (selectedUser) {
        await api.put(
          `https://localhost:7083/api/Users/admin-update/${selectedUser.id}`,
          formData
        );
      } else {
        await api.post(
          `https://localhost:7083/api/Users`,
          {
            ...formData,
            password: "123456",
          }
        );
      }

      window.location.reload();
    } catch {
      alert("Lưu thất bại");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">

          <div>
            <h1 className="text-4xl font-extrabold mb-2 text-white">
              Quản lý người dùng
            </h1>

            <p className="text-slate-300">
              Theo dõi và quản lý toàn bộ tài khoản trong hệ thống
            </p>
          </div>

          <div className="flex gap-3">

            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-[280px] px-4 py-3 rounded-xl bg-[#1e293b] border border-white/10 text-white placeholder:text-slate-400 outline-none"
            />

            <button
              onClick={handleOpenCreate}
              className="px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 hover:shadow-lg active:scale-95 transition-all"
            >
              + Thêm người dùng
            </button>

          </div>

        </div>

        {/* TABLE */}
        <div className="bg-[#1e293b] border border-white/10 rounded-3xl overflow-hidden shadow-xl">

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-20">

              <div className="text-6xl mb-4">
                👤
              </div>

              <h2 className="text-2xl font-bold mb-2 text-white">
                Không tìm thấy người dùng
              </h2>

              <p className="text-slate-400">
                Thử tìm kiếm với từ khóa khác
              </p>

            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-[#0f172a] border-b border-white/10">

                  <tr>

                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-300">
                      Người dùng
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-300">
                      Email
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-300">
                      Vai trò
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-300">
                      Ngày tạo
                    </th>

                    <th className="px-6 py-4 text-center text-sm font-bold text-slate-300">
                      Hành động
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-white/10">

                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-white/5 transition"
                    >

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-4">

                          <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                            {user.fullName?.charAt(0).toUpperCase()}
                          </div>

                          <div>

                            <p className="font-semibold text-white">
                              {user.fullName}
                            </p>

                            <p className="text-xs text-slate-400 font-mono">
                              ID: #{user.id}
                            </p>

                          </div>

                        </div>

                      </td>

                      <td className="px-6 py-5 text-slate-300">
                        {user.email}
                      </td>

                      <td className="px-6 py-5">

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold border ${
                            user.role === "Admin"
                              ? "bg-red-500/10 text-red-400 border-red-500/20"
                              : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                          }`}
                        >
                          {user.role.toUpperCase()}
                        </span>

                      </td>

                      <td className="px-6 py-5 text-slate-400 text-sm">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString("vi-VN")
                          : "---"}
                      </td>

                      <td className="px-6 py-5">

                        <div className="flex justify-center gap-2">

                          <button
                            onClick={() => handleOpenEdit(user)}
                            className="px-3 py-1.5 rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/20 transition text-sm font-medium"
                          >
                            Sửa
                          </button>

                          <button
                            onClick={() => handleDelete(user.id)}
                            className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition text-sm font-medium"
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

        {/* MODAL */}
        {showModal && (

          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">

            <div className="w-full max-w-md bg-[#1e293b] border border-white/10 rounded-3xl p-8 shadow-2xl">

              <h2 className="text-2xl font-bold mb-6 text-white">

                {selectedUser
                  ? "Cập nhật người dùng"
                  : "Thêm người dùng mới"}

              </h2>

              <div className="space-y-4">

                <div>

                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Họ và tên
                  </label>

                  <input
                    type="text"
                    placeholder="Nhập tên đầy đủ"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fullName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-white/10 text-white placeholder:text-slate-400 outline-none focus:border-blue-500"
                  />

                </div>

                <div>

                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Email
                  </label>

                  <input
                    type="email"
                    placeholder="example@gmail.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        email: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-white/10 text-white placeholder:text-slate-400 outline-none focus:border-blue-500"
                  />

                </div>

                <div>

                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Vai trò
                  </label>

                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        role: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-white/10 text-white outline-none focus:border-blue-500"
                  >
                    <option value="Student">
                      Student
                    </option>

                    <option value="Admin">
                      Admin
                    </option>

                  </select>

                </div>

              </div>

              <div className="flex justify-end gap-3 mt-8">

                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2.5 rounded-xl text-slate-300 hover:bg-white/10 font-medium transition"
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