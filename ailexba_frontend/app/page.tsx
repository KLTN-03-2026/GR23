import Link from 'next/link';

export default function HomePage() {
  const sampleExams = [
    { id: 1, name: 'Đề thi Thử Toán THPTQG 2026', subject: 'Toán học', time: '90 Phút', level: 'Khó' },
    { id: 2, name: 'Đề thi Thử Tiếng Anh THPTQG 2026', subject: 'Tiếng Anh', time: '60 Phút', level: 'Trung bình' },
    { id: 3, name: 'Đề thi Đánh giá Năng lực Mẫu', subject: 'Tổng hợp', time: '120 Phút', level: 'Nâng cao' },
  ];

  return (
    <div className="space-y-20 py-10">
      {/* Hero Section (PB01 & PB02) */}
      <section className="text-center space-y-6 max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Hệ thống Luyện thi <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">THPT Quốc Gia AILEXBA</span>
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          Ứng dụng Trí tuệ Nhân tạo (AI) để phân tích hành vi học tập, gợi ý lộ trình ôn thi cá nhân hóa và giúp bạn đạt điểm số mơ ước một cách dễ dàng nhất.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Link href="/register" className="px-8 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 hover:shadow-lg hover:-translate-y-1 transition-all">
            Bắt đầu học ngay
          </Link>
          <Link href="#sample-exams" className="px-8 py-3 bg-white text-slate-700 border border-slate-200 font-bold rounded-full hover:bg-slate-50 transition-all">
            Xem đề thi mẫu
          </Link>
        </div>
      </section>

      {/* Danh sách đề thi mẫu (PB03) */}
      <section id="sample-exams" className="pt-10">
        <h2 className="text-3xl font-bold text-center mb-10 text-slate-800">Đề Thi Mẫu Tham Khảo</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sampleExams.map(exam => (
            <div key={exam.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-100 transition-all group">
              <div className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full w-fit mb-4">
                {exam.subject}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">{exam.name}</h3>
              <div className="flex justify-between text-sm text-slate-500 mb-6">
                <span className="flex items-center gap-1">⏱ {exam.time}</span>
                <span className="flex items-center gap-1">📊 {exam.level}</span>
              </div>
              <button className="w-full py-2.5 bg-slate-50 text-slate-700 font-bold rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                Làm thử ngay
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}