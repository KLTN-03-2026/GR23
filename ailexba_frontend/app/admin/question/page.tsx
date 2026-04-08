'use client';

import React, { useState, ChangeEvent, useEffect, useCallback } from 'react';
import axios from 'axios';
import BulkUpload from '../../components/BulkUpload';

// 1. Interface chuẩn hóa để "chống" mọi kiểu đặt tên của Backend
interface Answer {
  id?: number;
  text?: string;       // camelCase
  Text?: string;       // PascalCase
  isCorrect?: boolean;
  IsCorrect?: boolean;
}

interface Question {
  id: number;
  content?: string;    // camelCase
  Content?: string;    // PascalCase
  answers?: Answer[];  // camelCase
  Answers?: Answer[];  // PascalCase
}

interface NewQuestionState {
  content: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correct: string;
}

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [subjectId] = useState<number>(1); 
  
  const [newQuestion, setNewQuestion] = useState<NewQuestionState>({
    content: '', option1: '', option2: '', option3: '', option4: '', correct: ''
  });

  const fetchQuestions = useCallback(async () => {
    try {
      const res = await axios.get('https://localhost:7083/api/Questions');
      if (res.data) {
        setQuestions(res.data);
      }
    } catch (err) {
      console.error("Lỗi khi load câu hỏi:", err);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      if (isMounted) await fetchQuestions();
    };
    loadData();
    return () => { isMounted = false; };
  }, [fetchQuestions]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, field: keyof NewQuestionState) => {
    setNewQuestion({ ...newQuestion, [field]: e.target.value });
  };

  const handleAdd = () => {
    if (!newQuestion.content || !newQuestion.correct) return;
    const manualAnswers: Answer[] = [
      { text: newQuestion.option1, isCorrect: newQuestion.correct === newQuestion.option1 },
      { text: newQuestion.option2, isCorrect: newQuestion.correct === newQuestion.option2 },
      { text: newQuestion.option3, isCorrect: newQuestion.correct === newQuestion.option3 },
      { text: newQuestion.option4, isCorrect: newQuestion.correct === newQuestion.option4 },
    ];
    const newQ: Question = {
      id: Date.now(),
      content: newQuestion.content,
      answers: manualAnswers,
    };
    setQuestions([newQ, ...questions]);
    setShowForm(false);
    setNewQuestion({ content: '', option1: '', option2: '', option3: '', option4: '', correct: '' });
  };

  const handleDelete = (id: number) => {
    if(confirm("Quốc có chắc muốn xoá câu hỏi này?")) {
      setQuestions(prev => prev.filter(q => q.id !== id));
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 text-slate-100 min-h-screen">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/10 pb-8">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase font-sans">🚀 Ngân hàng câu hỏi</h1>
          <p className="text-slate-500 font-medium mt-1">Dự án <span className="text-blue-500 font-bold">AILEXBA</span> | Duy Tan University</p>
        </div>
        
        <div className="flex items-center gap-4">
          <BulkUpload subjectId={subjectId} onRefresh={fetchQuestions} />
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-blue-600 rounded-2xl text-white font-black hover:bg-blue-500 transition-all text-xs uppercase shadow-xl shadow-blue-900/40"
          >
            + Thêm thủ công
          </button>
        </div>
      </div>

      {/* DANH SÁCH CÂU HỎI */}
      <div className="grid gap-6">
        {questions.length === 0 ? (
          <div className="text-center py-32 bg-white/[0.02] border border-dashed border-white/10 rounded-[2rem]">
            <p className="text-slate-400 italic text-lg">Hệ thống đang rỗng. Hãy thử tải lên file Excel!</p>
          </div>
        ) : (
          questions.map((q, index) => {
            // Lấy nội dung câu hỏi (chấp cả Content và content)
            const qContent = q.content ?? q.Content ?? "Nội dung câu hỏi bị trống";
            // Lấy mảng đáp án
            const currentAnswers = q.answers || q.Answers || [];
            
            return (
              <div key={q.id} className="bg-slate-900/50 border border-white/5 backdrop-blur-xl rounded-[2rem] p-8 shadow-2xl group hover:border-blue-500/30 transition-all">
                <div className="flex justify-between items-start gap-4 mb-6">
                  <h3 className="text-xl font-bold text-slate-100 leading-relaxed">
                    <span className="text-blue-500 mr-2 font-black">CÂU {index + 1}:</span> 
                    {qContent}
                  </h3>
                  <button onClick={() => handleDelete(q.id)} className="px-4 py-2 bg-red-500/10 text-red-500 rounded-xl font-bold text-[10px] uppercase hover:bg-red-500 hover:text-white transition-all">
                    Xoá
                  </button>
                </div>

                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentAnswers.map((opt, i) => {
                    const isCorrect = opt.isCorrect ?? opt.IsCorrect;
                    const text = opt.text ?? opt.Text ?? "Trống";

                    return (
                      <li 
                        key={`${q.id}-${i}`}
                        className={`p-5 rounded-2xl border flex items-center gap-4 transition-all ${
                          isCorrect 
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 ring-1 ring-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]' 
                          : 'bg-white/5 border-white/5 text-slate-400'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shadow-md ${
                          isCorrect ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-500'
                        }`}>
                          {String.fromCharCode(65 + i)}
                        </div>
                        <span className="font-semibold">{text}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL FORM */}
      {showForm && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-white/10 p-10 rounded-[2.5rem] w-full max-w-lg space-y-6 shadow-2xl animate-in fade-in zoom-in duration-300">
              <h2 className="text-2xl font-black text-white uppercase text-center tracking-tighter">Tạo câu hỏi mới</h2>
              <div className="space-y-4">
                 <input placeholder="Nội dung câu hỏi" value={newQuestion.content} onChange={e => handleInputChange(e, 'content')} className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 outline-none text-white focus:border-blue-500" />
                 <div className="grid grid-cols-2 gap-3">
                    <input placeholder="Đáp án A" value={newQuestion.option1} onChange={e => handleInputChange(e, 'option1')} className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white" />
                    <input placeholder="Đáp án B" value={newQuestion.option2} onChange={e => handleInputChange(e, 'option2')} className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white" />
                    <input placeholder="Đáp án C" value={newQuestion.option3} onChange={e => handleInputChange(e, 'option3')} className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white" />
                    <input placeholder="Đáp án D" value={newQuestion.option4} onChange={e => handleInputChange(e, 'option4')} className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white" />
                 </div>
                 <input placeholder="Nhập đáp án đúng (copy từ 1 trong 4 ô trên)" value={newQuestion.correct} onChange={e => handleInputChange(e, 'correct')} className="w-full p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 outline-none text-emerald-400 font-bold" />
              </div>
              <div className="flex gap-4">
                 <button onClick={() => setShowForm(false)} className="flex-1 py-4 rounded-2xl bg-white/5 font-bold hover:bg-white/10 transition-all text-white">HUỶ</button>
                 <button onClick={handleAdd} className="flex-1 py-4 rounded-2xl bg-blue-600 font-black hover:bg-blue-500 transition-all text-white shadow-lg shadow-blue-900/30">LƯU LẠI</button>
              </div>
          </div>
        </div>
      )}
    </div>
  );
}