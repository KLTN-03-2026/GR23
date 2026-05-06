'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/services/common';

interface ExamItem {
  id: number;
  title: string;
  description: string;
  duration: number;
  subjectName: string;
  createdAt: string;
}

export default function ExamsPage() {
  const [exams, setExams] = useState<ExamItem[]>([]);
  const [filteredExams, setFilteredExams] = useState<ExamItem[]>([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExams();
  }, []);

  useEffect(() => {
    const search = keyword.toLowerCase();

    const filtered = exams.filter(
      (exam) =>
        exam.title?.toLowerCase().includes(search) ||
        exam.subjectName?.toLowerCase().includes(search)
    );

    setFilteredExams(filtered);
  }, [keyword, exams]);

  const loadExams = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem('token');

      const response = await api.get(
        'https://localhost:7083/api/Exams/available',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status !== 200) {
        throw new Error('Không thể tải danh sách đề thi');
      }

      const result = response.data;

      setExams(result);
      setFilteredExams(result);

    } catch (error) {
      console.error(error);

      setExams([]);
      setFilteredExams([]);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">

      <div className="relative max-w-7xl mx-auto px-6 py-10">

        {/* GLOW */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full -z-10"></div>

        {/* HEADER */}
        <div className="text-center mb-10">

          <h1 className="text-5xl font-extrabold mb-4">
            Danh sách đề thi
          </h1>

          <p className="text-slate-400 text-lg">
            Chọn đề thi phù hợp để bắt đầu luyện tập
          </p>

        </div>

        {/* SEARCH */}
        <div className="mb-8">

          <input
            type="text"
            placeholder="Tìm kiếm theo tên đề hoặc môn học..."
            value={keyword}
            onChange={(e) =>
              setKeyword(e.target.value)
            }
            className="w-full px-5 py-4 rounded-2xl bg-[#1e293b] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />

        </div>

        {/* LOADING */}
        {loading ? (

          <div className="flex justify-center py-20">

            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

          </div>

        ) : filteredExams.length === 0 ? (

          /* EMPTY */
          <div className="text-center py-20 bg-[#1e293b] border border-white/10 rounded-3xl">

            <div className="text-6xl mb-4">
              📝
            </div>

            <h2 className="text-2xl font-bold mb-2">
              Không tìm thấy đề thi
            </h2>

            <p className="text-slate-400">
              Hiện chưa có dữ liệu hoặc API chưa hoạt động
            </p>

          </div>

        ) : (

          /* DATA */
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

            {filteredExams.map((exam) => (

              <div
                key={exam.id}
                className="bg-[#1e293b] border border-white/10 rounded-3xl p-6 hover:bg-[#273449] hover:-translate-y-1 transition-all duration-300 shadow-xl"
              >

                {/* TOP */}
                <div className="flex items-center justify-between mb-4">

                  <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-sm">

                    {exam.subjectName || 'Môn học'}

                  </span>

                  <span className="text-sm text-slate-400">

                    {exam.duration} phút

                  </span>

                </div>

                {/* TITLE */}
                <h2 className="text-2xl font-bold mb-3 text-white">

                  {exam.title}

                </h2>

                {/* DESCRIPTION */}
                <p className="text-slate-400 mb-6 line-clamp-3">

                  {exam.description || 'Không có mô tả'}

                </p>

                {/* FOOTER */}
                <div className="flex items-center justify-between">

                  <span className="text-sm text-slate-500">

                    {exam.createdAt
                      ? new Date(
                          exam.createdAt
                        ).toLocaleDateString(
                          'vi-VN'
                        )
                      : '---'}

                  </span>

                  <Link
                    href={`/exam/${exam.id}`}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:scale-105 transition-all"
                  >
                    Làm bài
                  </Link>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}