'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://localhost:7083/api/Subjects';

interface Subject {
  id: number;
  name: string;
  description?: string;
}

export default function AdminSubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newSubject, setNewSubject] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(true);

  const fetchSubjects = async () => {
    try {
      const res = await axios.get<Subject[]>(API_URL);
      setSubjects(res.data);
    } catch (err: unknown) {
      console.error("Lỗi lấy dữ liệu môn học", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, newSubject);
      setNewSubject({ name: '', description: '' }); 
      fetchSubjects(); 
      alert("Thêm môn học thành công!");
    } catch (err: unknown) {
      console.error(err);
      alert("Lỗi khi thêm môn học!");
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800">Quản lý Môn học</h1>
          <p className="text-slate-500 mt-1">Thêm và chỉnh sửa các môn thi THPT Quốc gia</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Thêm Mới */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-24">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Thêm Môn Mới</h2>
            <form onSubmit={handleAddSubject} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Tên môn học</label>
                <input 
                  type="text" required
                  className="w-full px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 outline-none focus:border-blue-500"
                  placeholder="Ví dụ: Toán học"
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                />
              </div>
              <button 
                type="submit" 
                className="w-full py-2.5 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-all"
              >
                + Thêm vào hệ thống
              </button>
            </form>
          </div>
        </div>

        {/* Danh sách môn học */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="p-10 text-center text-slate-500 font-bold">Đang tải dữ liệu...</div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 text-sm border-b border-slate-200">
                    <th className="p-4 font-bold">ID</th>
                    <th className="p-4 font-bold">Tên Môn Học</th>
                    <th className="p-4 font-bold text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="p-8 text-center text-slate-500">Chưa có môn học nào trong hệ thống.</td>
                    </tr>
                  ) : (
                    subjects.map((sub) => (
                      <tr key={sub.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-medium text-slate-500">#{sub.id}</td>
                        <td className="p-4 font-bold text-slate-800">{sub.name}</td>
                        <td className="p-4 text-right">
                          <button className="text-sm font-bold text-blue-600 hover:underline px-3 py-1">Sửa</button>
                          <button className="text-sm font-bold text-red-600 hover:underline px-3 py-1">Xóa</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}