'use client';
import { useEffect, useState } from 'react';

interface Question {
  id: number;
  content: string;
  options: string[];
  correct: string;
  subject?: string;
  level?: string;
}

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const [newQuestion, setNewQuestion] = useState({
    content: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    correct: '',
    subject: '',
    level: 'Dễ'
  });

  useEffect(() => {
    loadQuestions();
  }, []);

  useEffect(() => {
    const keyword = search.toLowerCase();

    const filtered = questions.filter(
      (q) =>
        q.content.toLowerCase().includes(keyword) ||
        q.subject?.toLowerCase().includes(keyword) ||
        q.level?.toLowerCase().includes(keyword)
    );

    setFilteredQuestions(filtered);
  }, [search, questions]);

  const loadQuestions = async () => {
    try {
      const response = await fetch('https://localhost:7083/api/Questions');
      const result = await response.json();

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
      option1: '',
      option2: '',
      option3: '',
      option4: '',
      correct: '',
      subject: '',
      level: 'Dễ'
    });
  };

  const handleOpenCreate = () => {
    setEditingQuestion(null);
    resetForm();
    setShowForm(true);
  };

  const handleOpenEdit = (question: Question) => {
    setEditingQuestion(question);

    setNewQuestion({
      content: question.content,
      option1: question.options[0] || '',
      option2: question.options[1] || '',
      option3: question.options[2] || '',
      option4: question.options[3] || '',
      correct: question.correct,
      subject: question.subject || '',
      level: question.level || 'Dễ'
    });

    setShowForm(true);
  };

  const handleSave = async () => {
    const payload = {
      content: newQuestion.content,
      options: [
        newQuestion.option1,
        newQuestion.option2,
        newQuestion.option3,
        newQuestion.option4
      ].filter(Boolean),
      correct: newQuestion.correct,
      subject: newQuestion.subject,
      level: newQuestion.level
    };

    try {
      if (editingQuestion) {
        await fetch(`https://localhost:7083/api/Questions/${editingQuestion.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
      } else {
        await fetch('https://localhost:7083/api/Questions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
      }

      setShowForm(false);
      loadQuestions();
    } catch (error) {
      console.error(error);
      alert('Lưu câu hỏi thất bại');
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm('Bạn có chắc muốn xóa câu hỏi này?');
    if (!confirmDelete) return;

    try {
      await fetch(`https://localhost:7083/api/Questions/${id}`, {
        method: 'DELETE'
      });

      setQuestions((prev) => prev.filter((q) => q.id !== id));
      setFilteredQuestions((prev) => prev.filter((q) => q.id !== id));
    } catch (error) {
      console.error(error);
      alert('Xóa câu hỏi thất bại');
    }
  };

  return (
    <div className="relative max-w-7xl mx-auto px-6 py-10">

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full -z-10"></div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
        <div>
          <h1 className="text-4xl font-extrabold mb-2">
            Quản lý câu hỏi
          </h1>
          <p className="text-slate-400">
            Thêm, sửa và quản lý toàn bộ câu hỏi trong hệ thống
          </p>
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Tìm kiếm câu hỏi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[300px] px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />

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
          <h2 className="text-2xl font-bold mb-2">
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
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-5">

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-sm">
                      Câu {index + 1}
                    </span>

                    {q.subject && (
                      <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-sm">
                        {q.subject}
                      </span>
                    )}

                    {q.level && (
                      <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 text-sm">
                        {q.level}
                      </span>
                    )}
                  </div>

                  <p className="font-semibold text-xl mb-4 text-white">
                    {q.content}
                  </p>

                  <div className="grid md:grid-cols-2 gap-3">
                    {q.options.map((opt) => (
                      <div
                        key={opt}
                        className={`p-3 rounded-xl border ${
                          opt === q.correct
                            ? 'bg-green-500/10 border-green-500/20 text-green-400'
                            : 'bg-white/5 border-white/10 text-slate-300'
                        }`}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex md:flex-col gap-3">
                  <button
                    onClick={() => handleOpenEdit(q)}
                    className="px-4 py-2 rounded-xl bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/20 transition"
                  >
                    Sửa
                  </button>

                  <button
                    onClick={() => handleDelete(q.id)}
                    className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">

            <h2 className="text-2xl font-bold mb-6">
              {editingQuestion ? 'Sửa câu hỏi' : 'Thêm câu hỏi'}
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

              <div className="grid md:grid-cols-2 gap-4">
                <input
                  placeholder="Đáp án 1"
                  value={newQuestion.option1}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, option1: e.target.value })
                  }
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white"
                />

                <input
                  placeholder="Đáp án 2"
                  value={newQuestion.option2}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, option2: e.target.value })
                  }
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white"
                />

                <input
                  placeholder="Đáp án 3"
                  value={newQuestion.option3}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, option3: e.target.value })
                  }
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white"
                />

                <input
                  placeholder="Đáp án 4"
                  value={newQuestion.option4}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, option4: e.target.value })
                  }
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white"
                />
              </div>

              <input
                placeholder="Đáp án đúng"
                value={newQuestion.correct}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, correct: e.target.value })
                }
                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white"
              />

              <div className="grid md:grid-cols-2 gap-4">
                <input
                  placeholder="Môn học"
                  value={newQuestion.subject}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, subject: e.target.value })
                  }
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white"
                />

                <select
                  value={newQuestion.level}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, level: e.target.value })
                  }
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white"
                >
                  <option value="Dễ" className="bg-slate-900">Dễ</option>
                  <option value="Trung bình" className="bg-slate-900">Trung bình</option>
                  <option value="Khó" className="bg-slate-900">Khó</option>
                </select>
              </div>

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