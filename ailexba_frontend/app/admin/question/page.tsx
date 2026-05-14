"use client";

import { useEffect, useState } from "react";
import { authService } from "@/services/auth.service";
import api from "@/services/common";
import { service } from "@/services/service";

interface Answer {
  id?: number;
  text: string;
  isCorrect: boolean;
}

interface Subject {
  id: number;
  name: string;
}

interface Question {
  id: number;
  content: string;
  subjectId: number;
  examId: number;
  subject: Subject;
  answers: Answer[];
}

export default function QuestionsPage() {

  const [questions, setQuestions] =
    useState<Question[]>([]);

  const [
    filteredQuestions,
    setFilteredQuestions,
  ] = useState<Question[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [newQuestion, setNewQuestion] =
    useState({
      content: "",
      subjectId: 0,
      examId: 0,
      Level: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      correct: "A",
    });

  const [exams, setExams] = useState([]);
  const [examsFilter, setExamsFilter] = useState([]);

  const [subjects, setSubjects] =
    useState([]);

  const [subjectId, setSubjectId] =
    useState(0);

  useEffect(() => {

    if (!authService.isAdmin()) {
      window.location.href = "/";
      return;
    }

    (async () => {

      try {

        const data =
          await service.getListExam();

        setExams(data);

      } catch (error) {

        console.error(error);
      }

      try {

        const data =
          await service.getListSubject();

        setSubjects(data);

      } catch (error) {

        console.error(error);
      }

      setLoading(false);

    })();

  }, []);

  useEffect(() => {
    loadQuestions();

    setExamsFilter(exams.filter(
      (e: any) => e.subjectId === subjectId
    ));

  }, [subjectId]);

  const loadQuestions = () => {

    (async () => {

      setLoading(true);

      try {

        const data =
          await service.getListQuestions(
            subjectId
          );

        console.log(data);

        setQuestions(data);

        setFilteredQuestions(data);

      } catch (error) {

        console.error(error);

        setQuestions([]);

        setFilteredQuestions([]);

      } finally {

        setLoading(false);
      }

    })();
  };

  const resetForm = () => {

    setNewQuestion({
      content: "",
      subjectId: 0,
      examId: 0,
      Level: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      correct: "A",
    });
  };

  const handleOpenCreate =
    () => {

      resetForm();

      setShowForm(true);
    };

  const handleSave =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const payload = {

          content:
            newQuestion.content,

          subjectId: Number(
            subjectId
          ),

          examId: Number(
            newQuestion.examId
          ),

          Level: newQuestion.Level,

          answers: [
            {
              text:
                newQuestion.option1,

              isCorrect:
                newQuestion.correct ===
                "A",
            },

            {
              text:
                newQuestion.option2,

              isCorrect:
                newQuestion.correct ===
                "B",
            },

            {
              text:
                newQuestion.option3,

              isCorrect:
                newQuestion.correct ===
                "C",
            },

            {
              text:
                newQuestion.option4,

              isCorrect:
                newQuestion.correct ===
                "D",
            },
          ],
        };

        const response =
          await api.post(
            `Questions`,
            payload,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          response.data;

        if (
          response.status !== 200
        ) {
          throw new Error(
            data.message ||
            "Lưu câu hỏi thất bại"
          );
        }

        alert(
          data.message ||
          "Lưu câu hỏi thành công"
        );

        setShowForm(false);

        resetForm();

        loadQuestions();

      } catch (error) {

        console.error(error);

        alert(
          "Lưu câu hỏi thất bại"
        );
      }
    };

  // =====================================================
  // UPLOAD EXCEL
  // =====================================================

  const handleUploadExcel =
    async () => {

      if (!selectedFile) {

        alert(
          "Vui lòng chọn file Excel"
        );

        return;
      }

      if (subjectId === 0) {

        alert(
          "Vui lòng chọn môn học"
        );

        return;
      }

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const excelFormData =
          new FormData();

        excelFormData.append(
          "file",
          selectedFile
        );

        const response =
          await api.post(
            `Questions/upload-excel?subjectId=${subjectId}`,
            excelFormData,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,

                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        if (
          response.status !== 200
        ) {
          throw new Error(
            "Upload Excel thất bại"
          );
        }

        alert(
          response.data.message ||
          "Upload Excel thành công"
        );

        setSelectedFile(null);

        loadQuestions();

      } catch (error) {

        console.error(error);

        alert(
          "Upload Excel thất bại"
        );
      }
    };

  // =====================================================
  // UPLOAD WORD
  // =====================================================

  const handleUploadWord =
    async () => {

      if (!selectedFile) {

        alert(
          "Vui lòng chọn file Word"
        );

        return;
      }

      if (subjectId === 0) {

        alert(
          "Vui lòng chọn môn học"
        );

        return;
      }

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const wordFormData =
          new FormData();

        wordFormData.append(
          "file",
          selectedFile
        );

        const response =
          await api.post(
            `Questions/upload-word?subjectId=${subjectId}`,
            wordFormData,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,

                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        if (
          response.status !== 200
        ) {
          throw new Error(
            "Upload Word thất bại"
          );
        }

        alert(
          response.data.message ||
          "Upload Word thành công"
        );

        setSelectedFile(null);

        loadQuestions();

      } catch (error) {

        console.error(error);

        alert(
          "Upload Word thất bại"
        );
      }
    };

  // =====================================================
  // EXPORT EXCEL
  // =====================================================

  const handleExportExcel =
    async () => {

      if (subjectId === 0) {

        alert(
          "Vui lòng chọn môn học"
        );

        return;
      }

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const response =
          await api.get(
            `Questions/export-excel/${subjectId}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },

              responseType:
                "blob",
            }
          );

        const blob =
          new Blob(
            [response.data],
            {
              type:
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            }
          );

        const url =
          window.URL.createObjectURL(
            blob
          );

        const link =
          document.createElement(
            "a"
          );

        link.href = url;

        link.download =
          `Questions_Subject_${subjectId}.xlsx`;

        link.click();

        window.URL.revokeObjectURL(
          url
        );

      } catch (error) {

        console.error(error);

        alert(
          "Xuất Excel thất bại"
        );
      }
    };

  // =====================================================
  // EXPORT WORD
  // =====================================================

  const handleExportWord =
    async () => {

      if (subjectId === 0) {

        alert(
          "Vui lòng chọn môn học"
        );

        return;
      }

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const response =
          await api.get(
            `Questions/export-word/${subjectId}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },

              responseType:
                "blob",
            }
          );

        const blob =
          new Blob(
            [response.data],
            {
              type:
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            }
          );

        const url =
          window.URL.createObjectURL(
            blob
          );

        const link =
          document.createElement(
            "a"
          );

        link.href = url;

        link.download =
          `Questions_Subject_${subjectId}.docx`;

        link.click();

        window.URL.revokeObjectURL(
          url
        );

      } catch (error) {

        console.error(error);

        alert(
          "Xuất Word thất bại"
        );
      }
    };

  return (

    <div className="min-h-screen bg-[#0f172a] text-white">

      <div className="relative max-w-7xl mx-auto px-6 py-10">

        {/* GLOW */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full -z-10"></div>

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">

          <div>

            <h1 className="text-4xl font-extrabold mb-2 text-white">
              Quản lý câu hỏi
            </h1>

            <p className="text-slate-400">
              Thêm và quản lý toàn bộ
              câu hỏi trong hệ thống
            </p>

          </div>

          <div className="flex gap-3 flex-wrap items-center">

            {/* SEARCH */}
            <input
              type="text"
              placeholder="Tìm kiếm câu hỏi..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="w-[320px] px-5 py-3 rounded-2xl bg-[#1e293b] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />

            {/* SUBJECT */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#1e293b] border border-white/10">

              <div className="flex flex-col">

                <span className="text-xs text-slate-400">
                  Mã môn
                </span>

                <select
                  value={subjectId}
                  onChange={(e) =>
                    setSubjectId(
                      Number(
                        e.target.value
                      )
                    )
                  }
                  className="w-100 bg-transparent text-white font-semibold outline-none"
                >

                  <option
                    value="0"
                    className="bg-black text-white"
                  >
                    Tất cả
                  </option>

                  {subjects.map(
                    (subject: any) => (

                      <option
                        key={subject.id}
                        value={subject.id}
                        className="bg-black text-white"
                      >
                        {subject.name}
                      </option>
                    )
                  )}

                </select>

              </div>

            </div>

            {/* FILE */}
            <label className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#1e293b] border border-white/10 text-slate-300 cursor-pointer hover:bg-[#273449] transition min-w-[280px]">

              <span className="px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-white text-sm font-medium">
                Chọn tệp
              </span>

              <span className="text-sm truncate">

                {selectedFile
                  ? selectedFile.name
                  : "Chưa có tệp"}

              </span>

              <input
                type="file"
                accept=".xlsx,.xls,.docx"
                onChange={(e) => {

                  if (
                    e.target.files &&
                    e.target.files
                      .length > 0
                  ) {

                    setSelectedFile(
                      e.target.files[0]
                    );
                  }
                }}
                className="hidden"
              />

            </label>

            {/* UPLOAD EXCEL */}
            <button
              onClick={
                handleUploadExcel
              }
              className="px-5 py-3 bg-green-600 rounded-2xl text-white font-bold hover:bg-green-700 transition"
            >
              Upload Excel
            </button>

            {/* UPLOAD WORD */}
            <button
              onClick={
                handleUploadWord
              }
              className="px-5 py-3 bg-blue-600 rounded-2xl text-white font-bold hover:bg-blue-700 transition"
            >
              Upload Word
            </button>

            {/* EXPORT EXCEL */}
            <button
              onClick={
                handleExportExcel
              }
              className="px-5 py-3 bg-yellow-600 rounded-2xl text-white font-bold hover:bg-yellow-700 transition"
            >
              Xuất Excel
            </button>

            {/* EXPORT WORD */}
            <button
              onClick={
                handleExportWord
              }
              className="px-5 py-3 bg-purple-600 rounded-2xl text-white font-bold hover:bg-purple-700 transition"
            >
              Xuất Word
            </button>

            {subjectId !== 0 && (

              <button
                onClick={
                  handleOpenCreate
                }
                className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white font-bold hover:opacity-90 transition"
              >
                + Thêm câu hỏi
              </button>
            )}

          </div>

        </div>

        {/* LOADING */}
        {loading ? (

          <div className="flex justify-center py-20">

            <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

          </div>

        ) : filteredQuestions.length === 0 ? (

          <div className="text-center py-20 bg-[#1e293b] border border-white/10 rounded-3xl">

            <div className="text-6xl mb-4">
              📚
            </div>

            <h2 className="text-2xl font-bold mb-2 text-white">
              Chưa có câu hỏi nào
            </h2>

            <p className="text-slate-400">
              Hãy thêm câu hỏi đầu tiên
            </p>

          </div>

        ) : (

          <div className="space-y-5">

            {filteredQuestions.map(
              (q, index) => (

                <div
                  key={q.id}
                  className="bg-[#1e293b] border border-white/10 rounded-3xl p-6 shadow-xl hover:border-blue-500/30 transition"
                >

                  <div className="flex flex-col gap-5">

                    <div className="flex items-center gap-3 mb-3 flex-wrap">

                      <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-sm">
                        Câu {index + 1}
                      </span>

                      <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-sm">
                        Môn&nbsp;
                        {q.subject.name}
                      </span>

                    </div>

                    <p className="font-semibold text-xl text-white">
                      {q.content}
                    </p>

                    <div className="grid md:grid-cols-2 gap-3">

                      {q.answers?.map(
                        (
                          opt: Answer
                        ) => (

                          <div
                            key={
                              opt.text
                            }
                            className={`p-3 rounded-xl border ${opt.isCorrect
                              ? "bg-green-500/10 border-green-500/20 text-green-400 font-bold"
                              : "bg-[#0f172a] border-white/10 text-slate-300"
                              }`}
                          >

                            {opt.text}

                          </div>

                        )
                      )}

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

      {/* FORM */}
      {showForm && (

        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">

          <div className="w-full max-w-2xl bg-[#1e293b] border border-white/10 rounded-3xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">

            <h2 className="text-2xl font-bold mb-6 text-white">
              Thêm câu hỏi
            </h2>

            <div className="space-y-4">

              <textarea
                placeholder="Nội dung câu hỏi"
                value={
                  newQuestion.content
                }
                onChange={(e) =>
                  setNewQuestion({
                    ...newQuestion,
                    content:
                      e.target.value,
                  })
                }
                className="w-full p-4 rounded-xl bg-[#0f172a] border border-white/10 text-white min-h-[100px]"
              />

              <select
                value={newQuestion.examId}
                onChange={(e) =>
                  setNewQuestion({
                    ...newQuestion,
                    examId:
                      Number(
                        e.target.value
                      ),
                  })
                }
                className="w-full p-4 rounded-xl bg-[#0f172a] border border-white/10 text-white"
              >

                <option
                  value="0"
                  className="bg-black text-white"
                >
                  Chọn mã đề
                </option>

                {examsFilter.map(
                  (exam: any) => (

                    <option
                      key={exam.id}
                      value={exam.id}
                      className="bg-black text-white"
                    >
                      {exam.title}
                    </option>
                  )
                )}

              </select>

              <div>

                <label className="block mb-2">
                  Độ khó
                </label>

                <select
                  value={newQuestion.Level}
                  onChange={(e) =>
                    setNewQuestion({
                      ...newQuestion, Level: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-white/10 outline-none"
                >

                  <option value="Easy">
                    Easy
                  </option>

                  <option value="Medium">
                    Medium
                  </option>

                  <option value="Hard">
                    Hard
                  </option>

                </select>

              </div>

              <div className="grid md:grid-cols-2 gap-4">

                <input
                  placeholder="Đáp án A"
                  value={
                    newQuestion.option1
                  }
                  onChange={(e) =>
                    setNewQuestion({
                      ...newQuestion,
                      option1:
                        e.target.value,
                    })
                  }
                  className="w-full p-3 rounded-xl bg-[#0f172a] border border-white/10 text-white"
                />

                <input
                  placeholder="Đáp án B"
                  value={
                    newQuestion.option2
                  }
                  onChange={(e) =>
                    setNewQuestion({
                      ...newQuestion,
                      option2:
                        e.target.value,
                    })
                  }
                  className="w-full p-3 rounded-xl bg-[#0f172a] border border-white/10 text-white"
                />

                <input
                  placeholder="Đáp án C"
                  value={
                    newQuestion.option3
                  }
                  onChange={(e) =>
                    setNewQuestion({
                      ...newQuestion,
                      option3:
                        e.target.value,
                    })
                  }
                  className="w-full p-3 rounded-xl bg-[#0f172a] border border-white/10 text-white"
                />

                <input
                  placeholder="Đáp án D"
                  value={
                    newQuestion.option4
                  }
                  onChange={(e) =>
                    setNewQuestion({
                      ...newQuestion,
                      option4:
                        e.target.value,
                    })
                  }
                  className="w-full p-3 rounded-xl bg-[#0f172a] border border-white/10 text-white"
                />

              </div>

              <select
                value={
                  newQuestion.correct
                }
                onChange={(e) =>
                  setNewQuestion({
                    ...newQuestion,
                    correct:
                      e.target.value,
                  })
                }
                className="w-full p-3 rounded-xl bg-[#0f172a] border border-white/10 text-white"
              >

                <option
                  value="A"
                  className="bg-slate-900"
                >
                  Đáp án A
                </option>

                <option
                  value="B"
                  className="bg-slate-900"
                >
                  Đáp án B
                </option>

                <option
                  value="C"
                  className="bg-slate-900"
                >
                  Đáp án C
                </option>

                <option
                  value="D"
                  className="bg-slate-900"
                >
                  Đáp án D
                </option>

              </select>

              <div className="flex gap-3 justify-end pt-4">

                <button
                  onClick={() =>
                    setShowForm(false)
                  }
                  className="px-5 py-3 bg-white/10 rounded-xl text-white hover:bg-white/20 transition"
                >
                  Huỷ
                </button>

                <button
                  onClick={
                    handleSave
                  }
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