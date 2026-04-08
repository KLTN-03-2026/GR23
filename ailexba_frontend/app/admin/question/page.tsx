'use client';

import React, { useState, ChangeEvent } from 'react';

// Định nghĩa cấu trúc dữ liệu rõ ràng
interface Question {
  id: number;
  content: string;
  options: string[];
  correct: string;
}

interface NewQuestionState {
  content: string;
  option1: string;
  option2: string;
  option3: string;
  correct: string;
}

export default function QuestionsPage() {
  // Khởi tạo state với kiểu dữ liệu Question[]
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      content: "2 + 2 = ?",
      options: ["3", "4", "5"],
      correct: "4"
    }
  ]);

  const [showForm, setShowForm] = useState<boolean>(false);
  
  const [newQuestion, setNewQuestion] = useState<NewQuestionState>({
    content: '',
    option1: '',
    option2: '',
    option3: '',
    correct: ''
  });

  // Hàm xử lý thay đổi input (Sửa lỗi "implicitly has an any type")
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, field: keyof NewQuestionState) => {
    setNewQuestion({ ...newQuestion, [field]: e.target.value });
  };

  const handleAdd = () => {
    if (!newQuestion.content || !newQuestion.correct) return;

    const newQ: Question = {
      id: Date.now(),
      content: newQuestion.content,
      options: [newQuestion.option1, newQuestion.option2, newQuestion.option3],
      correct: newQuestion.correct
    };

    setQuestions([...questions, newQ]);
    setShowForm(false);
    
    // Reset form
    setNewQuestion({
      content: '',
      option1: '',
      option2: '',
      option3: '',
      correct: ''
    });
  };

  const handleDelete = (id: number) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 text-slate-100">
      
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">📚 Quản lý câu hỏi</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-5 py-2 bg-blue-600 rounded-xl text-white font-bold hover:bg-blue-500 transition-colors"
        >
          + Thêm câu hỏi
        </button>
      </div>

      {/* LIST */}
      <div className="grid gap-4">
        {questions.length === 0 && <p className="text-slate-400">Chưa có câu hỏi nào.</p>}
        {questions.map((q, index) => (
          <div key={q.id}
            className="bg-slate-800/50 border border-white/10 backdrop-blur-md rounded-2xl p-5 shadow-lg">

            <div className="flex justify-between items-start">
              <p className="font-semibold text-lg">
                <span className="text-blue-400">Câu {index + 1}:</span> {q.content}
              </p>
              <button
                onClick={() => handleDelete(q.id)}
                className="text-red-400 hover:text-red-300 font-medium text-sm transition-colors"
              >
                Xoá
              </button>
            </div>

            <ul className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
              {q.options.map((opt, i) => (
                <li key={`${q.id}-opt-${i}`}
                  className={`p-3 rounded-lg border ${
                    opt === q.correct 
                    ? 'bg-green-500/20 border-green-500/50 text-green-400' 
                    : 'bg-white/5 border-white/10 text-slate-300'
                  }`}>
                  <span className="text-xs mr-2 opacity-50">{String.fromCharCode(65 + i)}.</span>
                  {opt}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* FORM POPUP */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 p-8 rounded-2xl w-[90%] max-w-md space-y-4 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-2">Tạo câu hỏi mới</h2>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-400">Nội dung</label>
              <input
                placeholder="Ví dụ: Thủ đô của Việt Nam là gì?"
                value={newQuestion.content}
                onChange={e => handleInputChange(e, 'content')}
                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none"
              />

              <label className="block text-sm font-medium text-slate-400">Các lựa chọn</label>
              <input
                placeholder="Đáp án 1"
                value={newQuestion.option1}
                onChange={e => handleInputChange(e, 'option1')}
                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none"
              />
              <input
                placeholder="Đáp án 2"
                value={newQuestion.option2}
                onChange={e => handleInputChange(e, 'option2')}
                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none"
              />
              <input
                placeholder="Đáp án 3"
                value={newQuestion.option3}
                onChange={e => handleInputChange(e, 'option3')}
                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none"
              />

              <label className="block text-sm font-medium text-green-400">Đáp án đúng (phải khớp với 1 trong 3 ô trên)</label>
              <input
                placeholder="Nhập lại chính xác đáp án đúng"
                value={newQuestion.correct}
                onChange={e => handleInputChange(e, 'correct')}
                className="w-full p-3 rounded-xl bg-green-500/10 border border-green-500/30 focus:border-green-500 outline-none"
              />
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setShowForm(false)}
                className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
                Huỷ
              </button>
              <button
                onClick={handleAdd}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-colors">
                Lưu lại
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}