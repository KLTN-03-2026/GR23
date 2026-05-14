"use client";

import { useEffect, useState } from "react";
import { authService } from "@/services/auth.service";
import api from "@/services/common";
import { service } from "@/services/service";

interface ExamItem {
  id: number;
  title: string;
  description?: string;
  subjectId: number;
  duration: number;
  createdAt: string;
  difficulty?: string;
  isActive: boolean;
}

export default function AdminExam() {
  const [exams, setExams] = useState<ExamItem[]>([]);
  const [filteredExams, setFilteredExams] = useState<ExamItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedExam, setSelectedExam] =
    useState<ExamItem | null>(null);
  const [subjects, setSubjects] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subjectId: 1,
    duration: 60,
    difficulty: "Easy",
    isActive: true,
  });

  useEffect(() => {
    if (!authService.isAdmin()) {
      window.location.href = "/";
      return;
    }

    loadExams();

    (async () => {
      try {
        const data = await service.getListSubject();
        setSubjects(data);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  useEffect(() => {
    const keyword = search.toLowerCase();

    const filtered = exams.filter((exam) => {
      return (
        exam.title.toLowerCase().includes(keyword) ||
        exam.id.toString().includes(keyword) ||
        exam.subjectId.toString().includes(keyword)
      );
    });

    setFilteredExams(filtered);
  }, [search, exams]);

  const loadExams = async () => {
  try {

    setLoading(true);

    const response = await api.get(
      `Exams?_=${Date.now()}`
    );

    // CHECK DỮ LIỆU THẬT TỪ DB
    console.log("API DATA:", response.data);

    const data = response.data.map((item: any) => ({
      id: item.id ?? item.Id,
      title: item.title ?? item.Title,
      description:
        item.description ??
        item.Description ??
        "",
      subjectId:
        item.subjectId ??
        item.SubjectId,
      duration:
        item.duration ??
        item.Duration,
      createdAt:
        item.createdAt ??
        item.CreatedAt,

      // CHECK
      difficulty:
        item.difficulty ??
        item.Difficulty,

      // CHECK
      isActive:
        item.isActive ??
        item.IsActive,
    }));

    console.log("MAPPED:", data);

    setExams(data);
    setFilteredExams(data);

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
      subjectId: 1,
      duration: 60,
      difficulty: "Easy",
      isActive: true,
    });

    setShowModal(true);
  };

  const handleOpenEdit = (exam: ExamItem) => {
    setSelectedExam(exam);

    setFormData({
      title: exam.title,
      description: exam.description || "",
      subjectId: exam.subjectId,
      duration: exam.duration,
      difficulty:
        exam.difficulty || "Easy",
      isActive: exam.isActive,
    });

    setShowModal(true);
  };

  const handleSave = async () => {
    try {

      const payload = {
        Id: selectedExam?.id || 0,
        Title: formData.title,
        Description: formData.description,
        SubjectId: Number(formData.subjectId),
        Duration: Number(formData.duration),
        Difficulty: formData.difficulty,
        IsActive: formData.isActive,
        CreatedAt:
          selectedExam?.createdAt ||
          new Date().toISOString(),
      };

      if (selectedExam) {

        await api.put(
          `Exams/${selectedExam.id}`,
          payload
        );

        alert("Cập nhật đề thi thành công");

      } else {

        await api.post(
          "Exams/create-random",
          payload
        );

        alert("Thêm đề thi thành công");
      }

      setShowModal(false);

      // LOAD LẠI TỪ DATABASE
      await loadExams();

    } catch (error: any) {

      console.error(error);

      alert(
        error?.response?.data?.message ||
        JSON.stringify(error?.response?.data) ||
        "Lưu đề thi thất bại"
      );
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa đề thi này?")) {
      return;
    }

    try {

      await api.delete(
        `Exams/${id}`
      );

      alert("Xóa đề thi thành công");

      await loadExams();

    } catch (error: any) {

      console.error(error);

      alert(
        error?.response?.data?.message ||
        "Xóa đề thi thất bại"
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">

      <div className="max-w-7xl mx-auto px-6 py-10">

        <div className="flex justify-between items-center mb-8">

          <div>

            <h1 className="text-4xl font-bold">
              Quản lý đề thi
            </h1>

            <p className="text-slate-400 mt-2">
              Quản lý toàn bộ đề thi
            </p>

          </div>

          <div className="flex gap-3">

            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="px-4 py-3 rounded-xl bg-[#1e293b] border border-white/10 outline-none"
            />

            <button
              onClick={handleOpenCreate}
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700"
            >
              + Thêm đề thi
            </button>

          </div>

        </div>

        <div className="bg-[#1e293b] rounded-3xl overflow-hidden border border-white/10">

          {loading ? (

            <div className="text-center py-20">
              Đang tải...
            </div>

          ) : (

            <table className="w-full">

              <thead className="bg-[#0f172a]">

                <tr>

                  <th className="px-6 py-4 text-left">
                    Đề thi
                  </th>

                  <th className="px-6 py-4 text-left">
                    Môn học
                  </th>

                  <th className="px-6 py-4 text-left">
                    Thời gian
                  </th>

                  <th className="px-6 py-4 text-left">
                    Độ khó
                  </th>

                  <th className="px-6 py-4 text-left">
                    Trạng thái
                  </th>

                  <th className="px-6 py-4 text-center">
                    Hành động
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredExams.map((exam) => (

                  <tr
                    key={exam.id}
                    className="border-t border-white/10"
                  >

                    <td className="px-6 py-5">

                      <div>

                        <p className="font-semibold">
                          {exam.title}
                        </p>

                        <p className="text-xs text-slate-400">
                          #{exam.id}
                        </p>

                      </div>

                    </td>

                    <td className="px-6 py-5">
                      #{exam.subjectId}
                    </td>

                    <td className="px-6 py-5">
                      {exam.duration} phút
                    </td>

                    <td className="px-6 py-5">
                      {exam.difficulty}
                    </td>

                    <td className="px-6 py-5">

                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          exam.isActive
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {exam.isActive
                          ? "Đang mở"
                          : "Đã khóa"}
                      </span>

                    </td>

                    <td className="px-6 py-5">

                      <div className="flex justify-center gap-2">

                        <button
                          onClick={() =>
                            handleOpenEdit(exam)
                          }
                          className="px-3 py-1 rounded-lg bg-yellow-500/20 text-yellow-400"
                        >
                          Sửa
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(exam.id)
                          }
                          className="px-3 py-1 rounded-lg bg-red-500/20 text-red-400"
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

          <div className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center px-4">

            <div className="w-full max-w-lg bg-[#1e293b] rounded-3xl p-8 border border-white/10">

              <h2 className="text-2xl font-bold mb-6">

                {selectedExam
                  ? "Cập nhật đề thi"
                  : "Thêm đề thi"}

              </h2>

              <div className="space-y-4">

                <div>

                  <label className="block mb-2">
                    Tên đề thi
                  </label>

                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        title: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-white/10 outline-none"
                  />

                </div>

                <div>

                  <label className="block mb-2">
                    Mô tả
                  </label>

                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    className="w-full min-h-[100px] px-4 py-3 rounded-xl bg-[#0f172a] border border-white/10 outline-none"
                  />

                </div>

                <div className="grid grid-cols-2 gap-4">

                  <div>

                    <label className="block mb-2">
                      Mã môn học
                    </label>

                    <select
                      value={formData.subjectId}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          subjectId: Number(e.target.value),
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-white/10 outline-none"
                    >
                      <option value="">Chọn môn học</option>

                      {subjects.map((subject: any) => (
                        <option key={subject.id} value={subject.id}>
                          {subject.name}
                        </option>
                      ))}
                    </select>

                  </div>

                  <div>

                    <label className="block mb-2">
                      Thời gian
                    </label>

                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          duration: Number(
                            e.target.value
                          ),
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-white/10 outline-none"
                    />

                  </div>

                </div>

                <div className="grid grid-cols-2 gap-4">

                  <div>

                    <label className="block mb-2">
                      Độ khó
                    </label>

                    <select
                      value={formData.difficulty}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          difficulty: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-white/10 outline-none"
                    >

                      <option value="Easy">
                        Easy
                      </option>

                      <option value="Medium">
                        Medium
                      </option>

                      <option value="Hard">
                        Hard
                      </option>

                    </select>

                  </div>

                  <div>

                    <label className="block mb-2">
                      Trạng thái
                    </label>

                    <select
                      value={
                        formData.isActive
                          ? "true"
                          : "false"
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isActive:
                            e.target.value === "true",
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-white/10 outline-none"
                    >

                      <option value="true">
                        Đang mở
                      </option>

                      <option value="false">
                        Đã khóa
                      </option>

                    </select>

                  </div>

                </div>

              </div>

              <div className="flex justify-end gap-3 mt-8">

                <button
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="px-6 py-2 rounded-xl bg-gray-600 hover:bg-gray-700"
                >
                  Hủy
                </button>

                <button
                  onClick={handleSave}
                  className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700"
                >
                  Lưu
                </button>

              </div>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}