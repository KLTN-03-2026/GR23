'use client';
import { authService } from '@/services/auth.service';
import { useEffect, useState } from 'react';

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
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: 'Student'
  });

  useEffect(() => {
    if(!authService.isAdmin()){
      window.location.href = '/'; 
    }

    const loadUsers = async () => {
      try {
        const response = await fetch('https://localhost:7083/api/Users');

        if (!response.ok) {
          throw new Error('Không thể tải danh sách người dùng');
        }

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
        user.role?.toLowerCase().includes(keyword)
    );

    setFilteredUsers(filtered);
  }, [search, users]);

  const handleOpenCreate = () => {
    setSelectedUser(null);
    setFormData({
      fullName: '',
      email: '',
      role: 'Student'
    });
    setShowModal(true);
  };

  const handleOpenEdit = (user: UserItem) => {
    setSelectedUser(user);
    setFormData({
      fullName: user.fullName,
      email: user.email,
      role: user.role
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm('Bạn có chắc muốn xóa người dùng này?');
    if (!confirmDelete) return;

    try {
      await fetch(`https://localhost:7083/api/Users/${id}`, {
        method: 'DELETE'
      });

      setUsers((prev) => prev.filter((user) => user.id !== id));
      setFilteredUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (error) {
      console.error(error);
      alert('Xóa người dùng thất bại');
    }
  };

  const handleSave = async () => {
    try {
      if (selectedUser) {
        await fetch(`https://localhost:7083/api/Users/${selectedUser.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
      } else {
        await fetch('https://localhost:7083/api/Users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...formData,
            password: '123456'
          })
        });
      }

      window.location.reload();
    } catch (error) {
      console.error(error);
      alert('Lưu thất bại');
    }
  };

  return (
    <div className="relative max-w-7xl mx-auto px-6 py-10">

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full -z-10"></div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
        <div>
          <h1 className="text-4xl font-extrabold mb-2">
            Quản lý người dùng
          </h1>
          <p className="text-slate-400">
            Theo dõi và quản lý toàn bộ tài khoản trong hệ thống
          </p>
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[280px] px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />

          <button
            onClick={handleOpenCreate}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:scale-105 transition-all"
          >
            + Thêm người dùng
          </button>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl">

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">👤</div>
            <h2 className="text-2xl font-bold mb-2">
              Không tìm thấy người dùng
            </h2>
            <p className="text-slate-400">
              Thử tìm kiếm với từ khóa khác
            </p>
          </div>
        ) : (
          <table className="w-full text-white">
            <thead className="bg-white/10">
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

            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-t border-white/10 hover:bg-white/5 transition"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-lg">
                        {user.fullName?.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <p className="font-semibold text-white">
                          {user.fullName}
                        </p>
                        <p className="text-sm text-slate-400">
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
                      className={`px-3 py-1 rounded-full text-sm font-semibold border ${
                        user.role === 'Admin'
                          ? 'bg-red-500/10 text-red-400 border-red-500/20'
                          : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-slate-400">
                    {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleOpenEdit(user)}
                        className="px-4 py-2 rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/20 transition"
                      >
                        Sửa
                      </button>

                      <button
                        onClick={() => handleDelete(user.id)}
                        className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl">

            <h2 className="text-2xl font-bold mb-6">
              {selectedUser ? 'Sửa người dùng' : 'Thêm người dùng'}
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Họ và tên"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white"
              />

              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white"
              />

              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white"
              >
                <option value="Student" className="bg-slate-900">Student</option>
                <option value="Admin" className="bg-slate-900">Admin</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 transition"
              >
                Hủy
              </button>

              <button
                onClick={handleSave}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:scale-105 transition"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}