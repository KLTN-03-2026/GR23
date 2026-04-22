"use client";

import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  BookOpen,
  LayoutDashboard,
  Filter,
  RefreshCcw,
  XCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { authService } from "@/services/auth.service";

const API_URL = "https://localhost:7083/api/Subjects";

interface Subject {
  id: number;
  name: string;
}

interface StatCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  color: string;
}

export default function AdminSubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({ name: "" });
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSubjects = async () => {
    setLoading(true);

    try {
      const res = await axios.get<Subject[]>(API_URL);
      setSubjects(res.data);
    } catch {
      console.error("Lỗi lấy dữ liệu môn học từ Backend");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authService.isAdmin()) {
      window.location.href = "/";
    }

    fetchSubjects();
  }, []);

  const filteredSubjects = subjects.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, {
          id: editId,
          ...formData,
        });

        alert("Cập nhật môn học thành công!");
      } else {
        await axios.post(API_URL, formData);

        alert("Thêm môn học thành công!");
      }

      resetForm();
      fetchSubjects();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<{ message?: string }>;

        alert(
          axiosError.response?.data?.message || "Lỗi thao tác dữ liệu!"
        );
      }
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm(
      "Bạn có chắc muốn xóa môn học này không?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchSubjects();
    } catch {
      alert("Không thể xóa môn học!");
    }
  };

  const startEdit = (subject: Subject) => {
    setEditId(subject.id);
    setFormData({ name: subject.name });
  };

  const resetForm = () => {
    setEditId(null);
    setFormData({ name: "" });
  };

  return (
    <div className="relative min-h-screen px-6 py-10 max-w-7xl mx-auto">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-indigo-500/10 blur-[120px] rounded-full -z-10"></div>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
        <div>
          <div className="flex items-center gap-4 mb-3">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-r from-indigo-600 to-blue-600 flex items-center justify-center shadow-xl">
              <BookOpen className="text-white" size={30} />
            </div>

            <div>
              <h1 className="text-4xl font-extrabold text-white">
                Quản lý môn học
              </h1>

              <p className="text-slate-400 mt-1">
                Quản lý danh sách môn học và dữ liệu liên quan trong hệ thống
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={fetchSubjects}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 border border-white/20 shadow-[0_0_0_1px_rgba(255,255,255,0.05)] text-slate-100 hover:bg-white/15 hover:border-white/30 transition-all"
        >
          <RefreshCcw
            size={18}
            className={loading ? "animate-spin" : ""}
          />
          Làm mới dữ liệu
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <StatCard
          title="Tổng môn học"
          count={subjects.length}
          icon={<BookOpen size={24} />}
          color="from-blue-500 to-indigo-600"
        />

        <StatCard
          title="Đang hiển thị"
          count={filteredSubjects.length}
          icon={<Filter size={24} />}
          color="from-emerald-500 to-green-600"
        />

        <StatCard
          title="Hệ thống"
          count={1}
          icon={<LayoutDashboard size={24} />}
          color="from-pink-500 to-rose-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-4"
        >
          <div className="bg-white/10 border border-white/20 rounded-3xl backdrop-blur-xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.4)] sticky top-8">
            <div className="flex items-center gap-3 mb-6">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  editId
                    ? "bg-gradient-to-r from-indigo-600 to-blue-600"
                    : "bg-gradient-to-r from-emerald-500 to-green-600"
                }`}
              >
                {editId ? (
                  <Edit2 className="text-white" size={22} />
                ) : (
                  <Plus className="text-white" size={22} />
                )}
              </div>

              <div>
                <h2 className="text-xl font-bold text-white">
                  {editId ? "Cập nhật môn học" : "Thêm môn học"}
                </h2>

                <p className="text-sm text-slate-400">
                  {editId
                    ? "Chỉnh sửa thông tin môn học"
                    : "Tạo môn học mới cho hệ thống"}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Tên môn học
                </label>

                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Lập trình Web"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ name: e.target.value })
                  }
                  className="w-full px-4 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-white/15"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className={`flex-1 py-4 rounded-2xl font-bold text-white transition-all hover:scale-[1.02] border border-white/10 ${
                    editId
                      ? "bg-gradient-to-r from-indigo-600 to-blue-600"
                      : "bg-gradient-to-r from-emerald-500 to-green-600"
                  }`}
                >
                  {editId ? "Lưu thay đổi" : "Thêm môn học"}
                </button>

                {editId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/15 hover:border-white/30 transition-all"
                  >
                    <XCircle size={22} />
                  </button>
                )}
              </div>
            </form>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-8"
        >
          <div className="bg-white/10 border border-white/20 rounded-3xl overflow-hidden backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.4)]">
            <div className="p-5 border-b border-white/20 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white/[0.03]">
              <div>
                <h2 className="text-xl font-bold text-white">
                  Danh sách môn học
                </h2>

                <p className="text-slate-400 text-sm mt-1">
                  Tổng cộng {filteredSubjects.length} môn học
                </p>
              </div>

              <div className="relative w-full md:w-[320px]">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type="text"
                  placeholder="Tìm kiếm môn học..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-white/15"
                />
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-24">
                <div className="w-14 h-14 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredSubjects.length === 0 ? (
              <div className="text-center py-24">
                <BookOpen
                  className="mx-auto text-slate-500 mb-4"
                  size={60}
                />

                <h3 className="text-2xl font-bold text-white mb-2">
                  Không tìm thấy môn học
                </h3>

                <p className="text-slate-400">
                  Thử tìm kiếm với từ khóa khác
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-white">
                  <thead className="bg-white/10">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-300">
                        ID
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-300">
                        Tên môn học
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-bold text-slate-300">
                        Hành động
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <AnimatePresence>
                      {filteredSubjects.map((sub) => (
                        <motion.tr
                          key={sub.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="border-t border-white/15 hover:bg-white/10 transition"
                        >
                          <td className="px-6 py-5">
                            <span className="px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/20 text-indigo-300 font-semibold text-sm">
                              #{sub.id}
                            </span>
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                              <div className="w-11 h-11 rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-600 flex items-center justify-center">
                                <BookOpen className="text-white" size={18} />
                              </div>

                              <div>
                                <p className="font-semibold text-white text-lg">
                                  {sub.name}
                                </p>

                                <p className="text-slate-400 text-sm">
                                  Môn học trong hệ thống
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex items-center justify-center gap-3">
                              <button
                                onClick={() => startEdit(sub)}
                                className="w-11 h-11 rounded-xl bg-blue-500/15 border border-blue-500/20 text-blue-300 hover:bg-blue-500/25 hover:border-blue-500/40 transition-all flex items-center justify-center"
                              >
                                <Edit2 size={18} />
                              </button>

                              <button
                                onClick={() => handleDelete(sub.id)}
                                className="w-11 h-11 rounded-xl bg-red-500/15 border border-red-500/20 text-red-300 hover:bg-red-500/25 hover:border-red-500/40 transition-all flex items-center justify-center"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({ title, count, icon, color }: StatCardProps) {
  return (
    <div className="bg-white/10 border border-white/20 rounded-3xl p-6 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.35)] hover:border-white/30 transition-all">
      <div className="flex items-center justify-between mb-5">
        <div
          className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${color} flex items-center justify-center text-white shadow-lg`}
        >
          {icon}
        </div>

        <LayoutDashboard className="text-slate-500" size={22} />
      </div>

      <h3 className="text-slate-400 text-sm font-medium mb-2">
        {title}
      </h3>

      <p className="text-3xl font-extrabold text-white">{count}</p>
    </div>
  );
}