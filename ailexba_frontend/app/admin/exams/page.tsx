"use client";

import { useEffect, useState } from "react";
import { authService } from "@/services/auth.service";

interface ExamItem {
  id: number;
  title: string;
  description: string;
  durationMinutes: number;
  subjectId: number;
  isActive: boolean;
  createdAt: string;
}

export default function AdminExam() {
  const [exams, setExams] = useState<ExamItem[]>([]);
  const [filteredExams, setFilteredExams] = useState<ExamItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState<ExamItem | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    durationMinutes: 60,
    subjectId: 1,
    isActive: true,
  });

  useEffect(() => {
    if (!authService.isAdmin()) {
      window.location.href = "/";
      return;
    }
    loadExams();
  }, []);

  useEffect(() => {
    const keyword = search.toLowerCase();
    const filtered = exams.filter((exam) => {
      return (
        exam.title?.toLowerCase().includes(keyword) ||
        exam.subjectId?.toString().includes(keyword) ||
        exam.id?.toString().includes(keyword)
      );
    });
    setFilteredExams(filtered);
  }, [search, exams]);

  const loadExams = async () => {
    try {
      const response = await fetch("https://localhost:7083/api/Exams");
      const text = await response.text();
      let result = [];
      try {
        result = JSON.parse(text);
      } catch {
        console.error("API không trả về JSON");
      }
      setExams(result);
      setFilteredExams(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setSelectedExam(null);
    setFormData({
      title: "",
      description: "",
      durationMinutes: 60,
      subjectId: 1,
      isActive: true,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (exam: ExamItem) => {
    setSelectedExam(exam);
    setFormData({
      title: exam.title,
      description: exam.description,
      durationMinutes: exam.durationMinutes,
      subjectId: exam.subjectId,
      isActive: exam.isActive,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      let response;
      if (selectedExam) {
        response = await fetch(
          `https://localhost:7083/api/Exams/${selectedExam.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: formData.title,
              durationMinutes: formData.durationMinutes,
              isActive: formData.isActive,
            }),
          },
        );
      } else {
        response = await fetch("https://localhost:7083/api/Exams", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            durationMinutes: formData.durationMinutes,
            subjectId: formData.subjectId,
            isActive: formData.isActive,
          }),
        });
      }

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Lưu đề thi thất bại");

      alert(data.message || "Lưu đề thi thành công");
      setShowModal(false);
      loadExams();
    } catch (error: unknown) {
      console.error(error);
      const message =
        error instanceof Error ? error.message : "Lưu đề thi thất bại";
      alert(message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa đề thi này?")) return;
    try {
      const response = await fetch(`https://localhost:7083/api/Exams/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Xóa đề thi thất bại");
      alert(data.message || "Xóa đề thi thành công");
      loadExams();
    } catch (error: unknown) {
      console.error(error);
      const message =
        error instanceof Error ? error.message : "Xóa đề thi thất bại";
      alert(message);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold mb-2 text-slate-900">
              Quản lý đề thi
            </h1>
            <p className="text-slate-600">
              Quản lý toàn bộ đề thi trong hệ thống
            </p>
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Tìm theo tên đề hoặc mã môn học..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-[300px] px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm"
            />

            <button
              onClick={handleOpenCreate}
              className="px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 hover:shadow-lg active:scale-95 transition-all"
            >
              + Thêm đề thi
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredExams.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📝</div>
              <h2 className="text-2xl font-bold mb-2 text-slate-900">
                Không tìm thấy đề thi
              </h2>
              <p className="text-slate-500">
                Hãy thử tìm kiếm bằng từ khóa khác
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-600">
                      Đề thi
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-600">
                      Mã môn học
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-600">
                      Thời gian
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-600">
                      Trạng thái
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
                  {filteredExams.map((exam) => (
                    <tr key={exam.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-5">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {exam.title}
                          </p>
                          <p className="text-xs text-slate-500 font-mono">
                            ID: #{exam.id}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-100 text-sm font-medium">
                          #{exam.subjectId}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-slate-700">
                        {exam.durationMinutes} phút
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold border ${
                            exam.isActive
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          }`}
                        >
                          {exam.isActive ? "ĐANG MỞ" : "ĐÃ KHÓA"}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-slate-500 text-sm">
                        {new Date(exam.createdAt).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(exam)}
                            className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition text-sm font-medium"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(exam.id)}
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
            <div className="w-full max-w-lg bg-white rounded-3xl p-8 shadow-2xl">
              <h2 className="text-2xl font-bold mb-6 text-slate-900">
                {selectedExam ? "Cập nhật đề thi" : "Thêm đề thi mới"}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Tên đề thi
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Mô tả
                  </label>
                  <textarea
                    value={formData.description || '' }
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 min-h-[100px] outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Mã môn học
                    </label>
                    <input
                      type="number"
                      value={formData.subjectId}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          subjectId: Number(e.target.value),
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Thời gian (phút)
                    </label>
                    <input
                      type="number"
                      value={formData.durationMinutes}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          durationMinutes: Number(e.target.value),
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Trạng thái
                  </label>
                  <select
                    value={formData.isActive ? "true" : "false"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isActive: e.target.value === "true",
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-blue-500"
                  >
                    <option value="true">Đang mở (Active)</option>
                    <option value="false">Đã khóa (Disabled)</option>
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
                  Lưu dữ liệu
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
