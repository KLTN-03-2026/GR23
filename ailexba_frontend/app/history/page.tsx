"use client";

import { useEffect, useState } from "react";
import api from "@/services/common";

interface HistoryItem {
  id: number;
  examTitle?: string;
  title?: string;
  score?: number;
  totalQuestions?: number;
  correctAnswers?: number;
  takenAt?: string;
  completedAt?: string;
  createdAt?: string;
  subjectName?: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] =
    useState<boolean>(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory =
    async (): Promise<void> => {
      try {
        setLoading(true);

        const token =
          localStorage.getItem("token");

        const response = await api.get(
          "https://localhost:7083/api/Exams/history",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (
          response.data &&
          Array.isArray(response.data)
        ) {
          setHistory(response.data);
        } else {
          setHistory([]);
        }
      } catch (error) {
        console.error(
          "Lỗi load history:",
          error
        );

        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">

      <div className="max-w-6xl mx-auto px-6 py-14">

        {/* HEADER */}
        <div className="text-center mb-14">

          <h1 className="text-5xl font-extrabold mb-4">
            Lịch sử làm bài
          </h1>

          <p className="text-slate-300 text-lg">
            Theo dõi kết quả và tiến trình
            học tập của bạn
          </p>

        </div>

        {/* LOADING */}
        {loading && (

          <div className="flex justify-center py-24">

            <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>

          </div>

        )}

        {/* EMPTY */}
        {!loading &&
          history.length === 0 && (

            <div className="bg-[#1e293b] border border-white/10 rounded-3xl p-12 text-center">

              <div className="text-6xl mb-4">
                📝
              </div>

              <h2 className="text-2xl font-bold mb-2">
                Chưa có lịch sử làm bài
              </h2>

              <p className="text-slate-400">
                Không tìm thấy dữ liệu
              </p>

            </div>

          )}

        {/* DATA */}
        {!loading &&
          history.length > 0 && (

            <div className="grid gap-6">

              {history.map(
                (item, index) => (

                  <div
                    key={item.id || index}
                    className="bg-[#1e293b] border border-white/10 rounded-3xl p-8 shadow-xl hover:border-blue-500/30 transition-all"
                  >

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                      {/* LEFT */}
                      <div>

                        <h2 className="text-2xl font-bold text-white mb-3">

                          {item.examTitle ||
                            item.title ||
                            "Bài thi"}

                        </h2>

                        <div className="flex flex-wrap gap-4 text-slate-300">

                          <span>
                            📚{" "}
                            {item.subjectName ||
                              "Môn học"}
                          </span>

                          <span>
                            ✅ Đúng:{" "}
                            {item.correctAnswers ||
                              0}
                            /
                            {item.totalQuestions ||
                              0}
                          </span>

                          <span>
                            📅{" "}
                            {new Date(
                              item.takenAt ||
                                item.completedAt ||
                                item.createdAt ||
                                Date.now()
                            ).toLocaleDateString(
                              "vi-VN"
                            )}
                          </span>

                        </div>

                      </div>

                      {/* RIGHT */}
                      <div className="flex items-center gap-4">

                        <div className="text-right">

                          <p className="text-slate-400 text-sm mb-1">
                            Điểm số
                          </p>

                          <h3 className="text-4xl font-extrabold text-blue-400">

                            {item.score || 0}

                          </h3>

                        </div>

                        <div
                          className={`px-4 py-2 rounded-2xl font-bold text-sm border ${
                            (item.score || 0) >=
                            8
                              ? "bg-green-500/10 text-green-400 border-green-500/20"
                              : (item.score ||
                                  0) >= 6.5
                              ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                              : "bg-red-500/10 text-red-400 border-red-500/20"
                          }`}
                        >

                          {(item.score || 0) >=
                          8
                            ? "Giỏi"
                            : (item.score ||
                                0) >= 6.5
                            ? "Khá"
                            : "Trung bình"}

                        </div>

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

      </div>

    </div>
  );
}