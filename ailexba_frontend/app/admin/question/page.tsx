'use client';
const API_URL = 'https://localhost:7083';
import { useEffect, useState } from 'react';
import { authService } from '@/services/auth.service';

interface Answer {
  id?: number;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: number;
  content: string;
  subjectId: number;
  answers: Answer[];
}

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [newQuestion, setNewQuestion] = useState({
    content: '',
    subjectId: 1,
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    correct: 'A'
  });

  useEffect(() => {
    if (!authService.isAdmin()) {
      window.location.href = '/';
      return;
    }

    loadQuestions();
  }, []);

  useEffect(() => {
    const keyword = search.toLowerCase();

    const filtered = questions.filter(
      (q: any) =>
        q.content?.toLowerCase().includes(keyword) ||
        q.subjectId?.toString().includes(keyword)
    );

    setFilteredQuestions(filtered);
  }, [search, questions]);

  const loadQuestions = async () => {
    try {
      const response = await fetch('https://localhost:7083/api/Questions');

      const text = await response.text();

      console.log(text);

      let result: any[] = [];

      try {
        result = JSON.parse(text);
      } catch {
        console.error('API không trả JSON');
      }

      setQuestions(result);
      setFilteredQuestions(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNewQuestion({
      content: '',
      subjectId: 1,
      option1: '',
      option2: '',
      option3: '',
      option4: '',
      correct: 'A'
    });
  };

  const handleOpenCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const handleSave = async () => {
    try {
      const payload = {
        content: newQuestion.content,
        subjectId: Number(newQuestion.subjectId),
        answers: [
          {
            text: newQuestion.option1,
            isCorrect: newQuestion.correct === 'A'
          },
          {
            text: newQuestion.option2,
            isCorrect: newQuestion.correct === 'B'
          },
          {
            text: newQuestion.option3,
            isCorrect: newQuestion.correct === 'C'
          },
          {
            text: newQuestion.option4,
            isCorrect: newQuestion.correct === 'D'
          }
        ]
      };

      const response = await fetch('https://localhost:7083/api/Questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Lưu câu hỏi thất bại');
      }

      alert(data.message || 'Lưu câu hỏi thành công');
      setShowForm(false);
      resetForm();
      loadQuestions();
    } catch (error) {
      console.error(error);
      alert('Lưu câu hỏi thất bại');
    }
  };

  const handleUploadExcel = async () => {
    if (!selectedFile) {
      alert('Vui lòng chọn file Excel');
      return;
    }

    try {
      const excelFormData = new FormData();
      excelFormData.append('file', selectedFile);

      const response = await fetch(
        `https://localhost:7083/api/Questions/upload-excel?subjectId=${newQuestion.subjectId}`,
        {
          method: 'POST',
          body: excelFormData
        }
      );

      const text = await response.text();

      console.log('Status:', response.status);
      console.log('Response:', text);

      if (!response.ok) {
        throw new Error(text || 'Upload Excel thất bại');
      }

      alert('Upload Excel thành công');
      loadQuestions();
    } catch (error) {
      console.error(error);
      alert('Failed to fetch - kiểm tra backend hoặc CORS');
    }
  };
  return (
    <div className="relative max-w-7xl mx-auto px-6 py-10">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full -z-10"></div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
        <div>
          <h1 className="text-4xl font-extrabold mb-2 text-white">
            Quản lý câu hỏi
          </h1>
          <p className="text-slate-400">
            Thêm và quản lý toàn bộ câu hỏi trong hệ thống
          </p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <input
            type="text"
            placeholder="Tìm kiếm câu hỏi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[300px] px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />

          <input
            type="number"
            placeholder="Mã môn học"
            value={newQuestion.subjectId}
            onChange={(e) =>
              setNewQuestion({
                ...newQuestion,
                subjectId: Number(e.target.value)
              })
            }
            className="w-[150px] px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white"
          />

          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setSelectedFile(e.target.files[0]);
              }
            }}
            className="text-sm text-slate-300"
          />

          <button
            onClick={handleUploadExcel}
            className="px-5 py-3 bg-green-600 rounded-xl text-white font-bold hover:bg-green-700 transition"
          >
            Upload Excel
          </button>

          <button
            onClick={handleOpenCreate}
            className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white font-bold hover:opacity-90 hover:scale-105 transition"
          >
            + Thêm câu hỏi
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold mb-2 text-white">
            Chưa có câu hỏi nào
          </h2>
          <p className="text-slate-400">
            Hãy thêm câu hỏi đầu tiên cho hệ thống
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredQuestions.map((q, index) => (
            <div
              key={q.id}
              className="bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-6 shadow-xl hover:bg-white/10 transition"
            >
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-sm">
                    Câu {index + 1}
                  </span>

                  <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-sm">
                    Môn #{q.subjectId}
                  </span>
                </div>

                <p className="font-semibold text-xl text-white">
                  {q.content}
                </p>

                <div className="grid md:grid-cols-2 gap-3">
                  {q.answers?.map((opt: any) => (
                    <div
                      key={opt.text}
                      className={`p-3 rounded-xl border ${
                        opt.isCorrect
                          ? 'bg-green-500/10 border-green-500/20 text-green-400'
                          : 'bg-white/5 border-white/10 text-slate-300'
                      }`}
                    >
                      {opt.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-white">
              Thêm câu hỏi
            </h2>

            <div className="space-y-4">
              <textarea
                placeholder="Nội dung câu hỏi"
                value={newQuestion.content}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, content: e.target.value })
                }
                className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white min-h-[100px]"
              />

              <input
                type="number"
                placeholder="Mã môn học"
                value={newQuestion.subjectId}
                onChange={(e) =>
                  setNewQuestion({
                    ...newQuestion,
                    subjectId: Number(e.target.value)
                  })
                }
                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white"
              />

              <div className="grid md:grid-cols-2 gap-4">
                <input
                  placeholder="Đáp án A"
                  value={newQuestion.option1}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, option1: e.target.value })
                  }
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white"
                />

                <input
                  placeholder="Đáp án B"
                  value={newQuestion.option2}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, option2: e.target.value })
                  }
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white"
                />

                <input
                  placeholder="Đáp án C"
                  value={newQuestion.option3}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, option3: e.target.value })
                  }
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white"
                />

                <input
                  placeholder="Đáp án D"
                  value={newQuestion.option4}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, option4: e.target.value })
                  }
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white"
                />
              </div>

              <select
                value={newQuestion.correct}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, correct: e.target.value })
                }
                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white"
              >
                <option value="A" className="bg-slate-900">
                  Đáp án A
                </option>
                <option value="B" className="bg-slate-900">
                  Đáp án B
                </option>
                <option value="C" className="bg-slate-900">
                  Đáp án C
                </option>
                <option value="D" className="bg-slate-900">
                  Đáp án D
                </option>
              </select>

              <div className="flex gap-3 justify-end pt-4">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-5 py-3 bg-white/10 rounded-xl text-white hover:bg-white/20 transition"
                >
                  Huỷ
                </button>

                <button
                  onClick={handleSave}
                  className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white font-bold hover:opacity-90"
                >
                  Lưu câu hỏi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}