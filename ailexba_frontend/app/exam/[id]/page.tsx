'use client';

import { useEffect, useState } from 'react';
import {
  useParams,
  useRouter,
} from 'next/navigation';

import api from '@/services/common';

interface Answer {
  id: number;
  text: string;
}

interface Question {
  id: number;
  content: string;
  answers: Answer[];
}

interface Exam {
  id: number;
  title: string;
  duration: number;
  questions: Question[];
}

export default function ExamTakePage() {
  const params = useParams();

  const router = useRouter();

  const examId = params.id;

  const [exam, setExam] =
    useState<Exam | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [submitted, setSubmitted] =
    useState(false);

  const [selectedAnswers, setSelectedAnswers] =
    useState<Record<number, number>>({});

  const [timeLeft, setTimeLeft] =
    useState(0);

  const [initialTime, setInitialTime] =
    useState(0);

  useEffect(() => {
    loadExam();
  }, []);

  useEffect(() => {
    if (
      timeLeft <= 0 ||
      !exam ||
      submitting ||
      submitted
    )
      return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [
    timeLeft,
    exam,
    submitting,
    submitted,
  ]);

  useEffect(() => {
    if (
      timeLeft === 0 &&
      exam &&
      !submitted
    ) {
      handleSubmit(true);
    }
  }, [timeLeft]);

  const loadExam = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem('token');

      const response = await api.get(
        `/Exams/${examId}/take`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;

      setExam(data);

      setTimeLeft(data.duration * 60);

      setInitialTime(data.duration * 60);

    } catch (error) {
      console.error(error);

      alert('Không thể tải đề thi');

      router.push('/exam');

    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = (
    questionId: number,
    answerId: number
  ) => {
    if (submitted) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));
  };

  const formatTime = (
    seconds: number
  ) => {
    const mins = Math.floor(
      seconds / 60
    );

    const secs = seconds % 60;

    return `${String(mins).padStart(
      2,
      '0'
    )}:${String(secs).padStart(
      2,
      '0'
    )}`;
  };

  const handleSubmit = async (
    autoSubmit = false
  ) => {
    if (
      !exam ||
      submitting ||
      submitted
    )
      return;

    const answeredCount =
      Object.keys(
        selectedAnswers
      ).length;

    const unansweredCount =
      exam.questions.length -
      answeredCount;

    if (
      unansweredCount > 0 &&
      !autoSubmit
    ) {
      alert(
        `Bạn còn ${unansweredCount} câu chưa hoàn thành!`
      );

      return;
    }

    try {
      setSubmitting(true);

      const token =
        localStorage.getItem('token');

      const answers =
        exam.questions.map((q) => ({
          questionId: q.id,
          selectedAnswerId:
            selectedAnswers[q.id],
          timeSpent: 0,
        }));

      const payload = {
        examId: exam.id,
        answers,
      };

      const response = await api.post(
        '/Exams/submit',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = response.data;

      const usedTime =
        initialTime - timeLeft;

      setSubmitted(true);

      alert(
        `Nộp bài thành công!\nĐiểm của bạn: ${result.score}`
      );

      router.push(
        `/exam/result/${result.resultId}?usedTime=${usedTime}`
      );

    } catch (error) {
      console.error(error);

      alert('Nộp bài thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">

        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center gap-6 text-white">

        <h1 className="text-3xl font-bold">

          Không tìm thấy đề thi

        </h1>

        <button
          onClick={() =>
            router.push('/exam')
          }
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 font-bold"
        >

          Quay lại danh sách đề

        </button>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* HEADER */}
        <div className="mb-10">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>

              <button
                onClick={() =>
                  router.push('/exam')
                }
                className="mb-4 text-blue-400 hover:text-blue-300 transition-all"
              >

                ← Quay lại danh sách đề

              </button>

              <h1 className="text-4xl font-extrabold mb-3">

                {exam.title}

              </h1>

              <p className="text-slate-400">

                Tổng số câu hỏi:{' '}
                {exam.questions.length}

              </p>

            </div>

            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-6 py-4 rounded-2xl text-2xl font-bold">

              {formatTime(timeLeft)}

            </div>

          </div>

        </div>

        {/* QUESTIONS */}
        <div className="space-y-8">

          {exam.questions.map(
            (question, index) => (
              <div
                key={question.id}
                className="bg-[#1e293b] border border-white/10 rounded-3xl p-6"
              >

                <h2 className="text-xl font-bold mb-6">

                  Câu {index + 1}:{' '}
                  {question.content}

                </h2>

                <div className="space-y-4">

                  {question.answers.map(
                    (answer) => {
                      const isSelected =
                        selectedAnswers[
                          question.id
                        ] === answer.id;

                      return (
                        <button
                          key={answer.id}
                          onClick={() =>
                            handleSelectAnswer(
                              question.id,
                              answer.id
                            )
                          }
                          disabled={submitted}
                          className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 ${
                            isSelected
                              ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                              : 'bg-[#0f172a] border-white/10 hover:border-blue-500/50'
                          } ${
                            submitted
                              ? 'opacity-70 cursor-not-allowed'
                              : ''
                          }`}
                        >

                          {answer.text}

                        </button>
                      );
                    }
                  )}

                </div>

              </div>
            )
          )}

        </div>

        {/* FOOTER */}
        <div className="mt-10 flex justify-end">

          <button
            onClick={() =>
              handleSubmit(false)
            }
            disabled={
              submitting || submitted
            }
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 font-bold text-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >

            {submitting
              ? 'Đang nộp bài...'
              : submitted
              ? 'Đã nộp bài'
              : 'Nộp bài'}

          </button>

        </div>

      </div>

    </div>
  );
}