'use client';
import { useEffect, useState } from 'react';
// Quốc nhớ kiểm tra đường dẫn import authService cho đúng với dự án của bạn nhé
import { authService } from '../../services/auth.service'; 
import api from "@/services/common"

interface ResultItem {
  id: number;
  examTitle: string; // Đổi từ examName thành examTitle cho khớp với DTO thường gặp ở BE
  score: number;
  completedAt: string; // Đổi từ date thành completedAt cho khớp với Backend
}

export default function HistoryPage() {
  const [data, setData] = useState<ResultItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadResults = async () => {
      try {
        // 1. Lấy thông tin user từ LocalStorage
        const user = authService.getCurrentUser();
        
        if (!user || !user.userId) {
          setError('Vui lòng đăng nhập để xem lịch sử');
          setLoading(false);
          return;
        }

        // 2. GỌI ĐÚNG ĐỊA CHỈ API (Theo Swagger của Quốc)
        const response = await api.get(`https://localhost:7083/api/Exams/history/${user.userId}`);

        if (response.status != 200) {
          throw new Error('Không thể tải dữ liệu từ máy chủ');
        }

        const result = await response.data;
        
        // Console log để Quốc kiểm tra tên các trường (Title, Score, Date...)
        console.log("Dữ liệu lịch sử nhận được:", result);

        setData(Array.isArray(result) ? result : []);
      } catch (error) {
        console.error('Lỗi khi tải lịch sử:', error);
        setError('Không thể kết nối đến máy chủ Backend');
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, []);

  return (
    <div className="relative max-w-6xl mx-auto px-6 py-10">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full -z-10"></div>

      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold mb-3">Lịch sử làm bài</h1>
        <p className="text-slate-400 text-lg">Theo dõi kết quả và tiến trình học tập của bạn</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold mb-2 text-red-400">{error}</h2>
            <p className="text-slate-400">Hãy đảm bảo Backend đang chạy và API hoạt động đúng</p>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📄</div>
            <h2 className="text-2xl font-bold mb-2">Chưa có lịch sử làm bài</h2>
            <p className="text-slate-400">Hãy bắt đầu làm bài để xem kết quả tại đây</p>
          </div>
        ) : (
          <table className="w-full text-white">
            <thead className="bg-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-300">Đề thi</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-300">Điểm</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-300">Ngày làm</th>
              </tr>
            </thead>
            <tbody>
              {data.map((r) => (
                <tr key={r.id} className="border-t border-white/10 hover:bg-white/5 transition">
                  <td className="px-6 py-5 font-medium">
                    {/* Quốc kiểm tra xem BE trả về là r.examTitle hay r.title nhé */}
                    {r.examTitle || "Đề thi không tên"}
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-semibold">
                      {r.score}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-slate-400">
                    {/* Dùng completedAt khớp với DTO */}
                    {r.completedAt ? new Date(r.completedAt).toLocaleDateString('vi-VN') : '---'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}