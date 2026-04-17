'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AboutPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const currentUser = localStorage.getItem('user');

    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
  }, []);

  return (
    <div className="relative max-w-6xl mx-auto px-6 py-20 space-y-24">

      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/20 blur-[120px] rounded-full -z-10"></div>

      {/* HERO */}
      <section className="text-center space-y-6 fade-up">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
          Nền tảng luyện thi <br />
          <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
            AILEXBA
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
          Ứng dụng AI giúp cá nhân hóa việc học, ôn luyện đề thi, cá nhân hoá việc học, chọn lọc giúp nâng cao điểm số
        </p>
      </section>

      {/* FEATURES */}
      <section className="grid md:grid-cols-3 gap-8">

        <div className="fade-up bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 text-center hover:scale-105 hover:shadow-2xl transition-all">
          <div className="text-5xl mb-4">🎯</div>
          <h3 className="text-xl font-bold mb-2">Mục tiêu rõ ràng</h3>
          <p className="text-slate-400">Học theo lộ trình cá nhân hóa.</p>
        </div>

        <div className="fade-up bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 text-center hover:scale-105 hover:shadow-2xl transition-all">
          <div className="text-5xl mb-4">🤖</div>
          <h3 className="text-xl font-bold mb-2">AI thông minh</h3>
          <p className="text-slate-400">Phân tích kết quả.</p>
        </div>

        <div className="fade-up bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 text-center hover:scale-105 hover:shadow-2xl transition-all">
          <div className="text-5xl mb-4">📊</div>
          <h3 className="text-xl font-bold mb-2">Theo dõi tiến độ</h3>
          <p className="text-slate-400">Báo cáo chi tiết kết quả học.</p>
        </div>

      </section>

      {/* BENEFITS */}
      <section className="space-y-10 text-center fade-up">
        <h2 className="text-3xl font-bold">Tại sao chọn AILEXBA?</h2>

        <div className="grid md:grid-cols-2 gap-8">

          {[
            ["📚", "Kho đề phong phú", "Hàng trăm đề thi chuẩn Bộ GD"],
            ["⚡", "Luyện tập nhanh", "Làm bài và chấm điểm ngay"],
            ["📈", "Tăng điểm", "Cải thiện rõ rệt qua từng bài"],
            ["🎓", "Phù hợp mọi trình độ", "Từ cơ bản đến nâng cao"]
          ].map(([icon, title, desc]) => (
            <div
              key={title}
              className="relative p-[1px] rounded-3xl bg-gradient-to-r from-blue-500/40 to-indigo-500/40"
            >
              <div
                className="bg-black/80 border border-white/10 rounded-3xl p-8 flex flex-col 
                items-center justify-center text-center backdrop-blur-md shadow-lg 
                hover:shadow-blue-500/20 hover:-translate-y-1 hover:bg-white/5 transition-all duration-300"
              >
                <div className="flex flex-col items-center gap-3">
                  <span className="text-4xl">{icon}</span>
                  <h3 className="font-bold text-xl text-white">
                    {title}
                  </h3>
                  <p className="text-slate-400 text-sm">
                    {desc}
                  </p>
                </div>
              </div>
            </div>
          ))}

        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="text-center space-y-6 fade-up">
          <h2 className="text-3xl font-bold">Bắt đầu ngay hôm nay 🚀</h2>

          <p className="text-slate-400">
            Tham gia hệ thống để trải nghiệm cách học thông minh hơn.
          </p>

          <div className="flex justify-center gap-4">
            <Link
              href="/register"
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-full hover:scale-105 transition shadow-lg"
            >
              Đăng ký ngay
            </Link>

            <Link
              href="/exam_test"
              className="px-8 py-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition"
            >
              Làm thử
            </Link>
          </div>
        </section>
      )}

    </div>
  );
}