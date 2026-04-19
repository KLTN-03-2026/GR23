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

const API_URL = "https://localhost:7083/api/Subjects";

// --- ĐỊNH NGHĨA INTERFACES ---
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

  // 1. Lấy danh sách môn học
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
    fetchSubjects();
  }, []);

  // 2. Tìm kiếm môn học
  const filteredSubjects = subjects.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // 3. Xử lý Thêm hoặc Cập nhật
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        // Cập nhật (PUT)
        await axios.put(`${API_URL}/${editId}`, { id: editId, ...formData });
        alert("Cập nhật thành công!");
      } else {
        // Thêm mới (POST)
        await axios.post(API_URL, formData);
        alert("Thêm môn học thành công!");
      }
      resetForm();
      fetchSubjects();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<{ message?: string }>;
        alert(axiosError.response?.data?.message || "Lỗi thao tác dữ liệu!");
      }
    }
  };

  // 4. Xử lý Xóa
  const handleDelete = async (id: number) => {
    if (confirm("Quốc có chắc muốn xóa môn này không?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchSubjects();
      } catch {
        alert("Không thể xóa môn học (có thể do ràng buộc dữ liệu)!");
      }
    }
  };

  const startEdit = (sub: Subject) => {
    setEditId(sub.id);
    setFormData({ name: sub.name });
  };

  const resetForm = () => {
    setEditId(null);
    setFormData({ name: "" });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <LayoutDashboard className="text-indigo-600" />
              DTU Smart Hub <span className="text-indigo-600">/ Subjects</span>
            </h1>
            <p className="text-slate-500 font-medium">
              Hệ thống quản lý môn học chuyên sâu
            </p>
          </div>
          <button
            onClick={fetchSubjects}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-all shadow-sm"
          >
            <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
            Làm mới dữ liệu
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Tổng môn học"
            count={subjects.length}
            icon={<BookOpen />}
            color="bg-indigo-600"
          />
          <StatCard
            title="Đề thi mở"
            count={subjects.length * 2}
            icon={<Filter />}
            color="bg-emerald-500"
          />
          <StatCard
            title="Hệ thống"
            count={1}
            icon={<Plus />}
            color="bg-slate-900"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Quản lý */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4"
          >
            <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-white sticky top-8">
              <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                {editId ? (
                  <Edit2 size={20} className="text-indigo-500" />
                ) : (
                  <Plus size={20} className="text-emerald-500" />
                )}
                {editId ? "Cập nhật môn học" : "Tạo môn học mới"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 tracking-widest uppercase ml-1">
                    Tên môn học
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold text-slate-700"
                    placeholder="Nhập tên môn..."
                    value={formData.name}
                    onChange={(e) => setFormData({ name: e.target.value })}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className={`flex-1 py-4 rounded-2xl font-black text-white shadow-lg transition-all active:scale-95 ${
                      editId
                        ? "bg-indigo-600 hover:bg-indigo-700"
                        : "bg-slate-900 hover:bg-black"
                    }`}
                  >
                    {editId ? "LƯU THAY ĐỔI" : "XÁC NHẬN THÊM"}
                  </button>
                  {editId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="p-4 bg-slate-100 text-slate-400 rounded-2xl hover:bg-slate-200"
                    >
                      <XCircle size={24} />
                    </button>
                  )}
                </div>
              </form>
            </div>
          </motion.div>

          {/* Danh sách hiển thị */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
              <div className="pl-4 text-slate-400">
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm môn học theo tên..."
                className="w-full py-3 bg-transparent outline-none font-medium text-slate-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-white overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr>
                    <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">
                      Mã số
                    </th>
                    <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">
                      Môn học
                    </th>
                    <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest text-right">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <AnimatePresence>
                    {filteredSubjects.map((sub) => (
                      <motion.tr
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        key={sub.id}
                        className="group hover:bg-indigo-50/30 transition-colors"
                      >
                        <td className="p-6 font-mono text-indigo-400 font-bold">
                          #00{sub.id}
                        </td>
                        <td className="p-6 font-black text-slate-700 text-lg">
                          {sub.name}
                        </td>
                        <td className="p-6 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => startEdit(sub)}
                              className="p-3 bg-white text-slate-400 hover:text-indigo-600 hover:shadow-md rounded-xl transition-all"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(sub.id)}
                              className="p-3 bg-white text-slate-400 hover:text-red-600 hover:shadow-md rounded-xl transition-all"
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
              {filteredSubjects.length === 0 && (
                <div className="p-20 text-center text-slate-400 font-bold">
                  Không có dữ liệu môn học phù hợp.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// COMPONENT CARD THỐNG KÊ
function StatCard({ title, count, icon, color }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-md border border-white flex items-center gap-5 transition-transform hover:scale-[1.02]">
      <div
        className={`p-4 rounded-2xl text-white ${color} shadow-lg shadow-indigo-100`}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">
          {title}
        </p>
        <p className="text-3xl font-black text-slate-800">{count}</p>
      </div>
    </div>
  );
}
