'use client';

import { useEffect, useState } from 'react';
import { authService } from '@/services/auth.service';

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
const [search, setSearch] = useState('');
const [loading, setLoading] = useState(true);

const [showModal, setShowModal] = useState(false);
const [selectedExam, setSelectedExam] = useState<ExamItem | null>(null);

const [formData, setFormData] = useState({
title: '',
description: '',
durationMinutes: 60,
subjectId: 1,
isActive: true
});

useEffect(() => {
if (!authService.isAdmin()) {
window.location.href = '/';
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
    const response = await fetch('https://localhost:7083/api/Exams');

    const text = await response.text();

    console.log(text);

    let result = [];

    try {
      result = JSON.parse(text);
    } catch {
      console.error('API không trả về JSON');
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
title: '',
description: '',
durationMinutes: 60,
subjectId: 1,
isActive: true
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
isActive: exam.isActive
});
setShowModal(true);
};
const handleSave = async () => {
try {
let response;
  if (selectedExam) {
    response = await fetch(`https://localhost:7083/api/Exams/${selectedExam.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: formData.title,
        durationMinutes: formData.durationMinutes,
        isActive: formData.isActive
      })
    });
  } else {
    response = await fetch('https://localhost:7083/api/Exams', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: formData.title,
        description: formData.description,
        durationMinutes: formData.durationMinutes,
        subjectId: formData.subjectId,
        isActive: formData.isActive
      })
    });
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Lưu đề thi thất bại');
  }

  alert(data.message || 'Lưu đề thi thành công');
  setShowModal(false);
  loadExams();
} catch (error: any) {
  console.error(error);
  alert(error.message || 'Lưu đề thi thất bại');
}
};
const handleDelete = async (id: number) => {
const confirmDelete = confirm('Bạn có chắc muốn xóa đề thi này?');
if (!confirmDelete) return;
try {
  const response = await fetch(`https://localhost:7083/api/Exams/${id}`, {
    method: 'DELETE'
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Xóa đề thi thất bại');
  }

  alert(data.message || 'Xóa đề thi thành công');
  loadExams();
} catch (error: any) {
  console.error(error);
  alert(error.message || 'Xóa đề thi thất bại');
}
};
return ( <div className="relative max-w-7xl mx-auto px-6 py-10"> <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full -z-10"></div>
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
    <div>
      <h1 className="text-4xl font-extrabold mb-2 text-white">
        Quản lý đề thi
      </h1>
      <p className="text-slate-400">
        Quản lý toàn bộ đề thi trong hệ thống
      </p>
    </div>

    <div className="flex gap-3">
      <input
        type="text"
        placeholder="Tìm theo tên đề hoặc mã môn học..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-[300px] px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
      />

      <button
        onClick={handleOpenCreate}
        className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:scale-105 transition-all"
      >
        + Thêm đề thi
      </button>
    </div>
  </div>

  <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl">
    {loading ? (
      <div className="flex justify-center items-center py-20">
        <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    ) : filteredExams.length === 0 ? (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">📝</div>
        <h2 className="text-2xl font-bold mb-2 text-white">
          Không tìm thấy đề thi
        </h2>
        <p className="text-slate-400">
          Hãy thử tìm kiếm bằng từ khóa khác
        </p>
      </div>
    ) : (
      <table className="w-full text-white">
        <thead className="bg-white/10">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-bold text-slate-300">
              Đề thi
            </th>
            <th className="px-6 py-4 text-left text-sm font-bold text-slate-300">
              Mã môn học
            </th>
            <th className="px-6 py-4 text-left text-sm font-bold text-slate-300">
              Thời gian
            </th>
            <th className="px-6 py-4 text-left text-sm font-bold text-slate-300">
              Trạng thái
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
          {filteredExams.map((exam) => (
            <tr
              key={exam.id}
              className="border-t border-white/10 hover:bg-white/5 transition"
            >
              <td className="px-6 py-5">
                <div>
                  <p className="font-semibold text-white">
                    {exam.title}
                  </p>
                  <p className="text-sm text-slate-400">
                    Mã đề: #{exam.id}
                  </p>
                </div>
              </td>

              <td className="px-6 py-5">
                <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-sm">
                  #{exam.subjectId}
                </span>
              </td>

              <td className="px-6 py-5 text-slate-300">
                {exam.durationMinutes} phút
              </td>

              <td className="px-6 py-5">
                <span
                  className={`px-3 py-1 rounded-full text-sm border ${
                    exam.isActive
                      ? 'bg-green-500/10 text-green-400 border-green-500/20'
                      : 'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}
                >
                  {exam.isActive ? 'Đang mở' : 'Đã khóa'}
                </span>
              </td>

              <td className="px-6 py-5 text-slate-400">
                {new Date(exam.createdAt).toLocaleDateString('vi-VN')}
              </td>

              <td className="px-6 py-5">
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => handleOpenEdit(exam)}
                    className="px-4 py-2 rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/20 transition"
                  >
                    Sửa
                  </button>

                  <button
                    onClick={() => handleDelete(exam.id)}
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
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl">
        <h2 className="text-2xl font-bold mb-6 text-white">
          {selectedExam ? 'Sửa đề thi' : 'Thêm đề thi'}
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Tên đề thi"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white"
          />

          <textarea
            placeholder="Mô tả đề thi"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white min-h-[120px]"
          />

          <input
            type="number"
            placeholder="Mã môn học"
            value={formData.subjectId}
            onChange={(e) =>
              setFormData({ ...formData, subjectId: Number(e.target.value) })
            }
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white"
          />

          <input
            type="number"
            placeholder="Thời gian làm bài"
            value={formData.durationMinutes}
            onChange={(e) =>
              setFormData({
                ...formData,
                durationMinutes: Number(e.target.value)
              })
            }
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white"
          />

          <select
            value={formData.isActive ? 'true' : 'false'}
            onChange={(e) =>
              setFormData({
                ...formData,
                isActive: e.target.value === 'true'
              })
            }
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white"
          >
            <option value="true">Đang mở</option>
            <option value="false">Đã khóa</option>
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
