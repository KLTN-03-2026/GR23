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
    isCorrect: boolean;
}

interface Question {
    id: number;
    content: string;
    answers: Answer[];
}

interface Detail {
    id: number;
    questionId: number;
    selectedAnswerId: number;
    isCorrect: boolean;
    timeSpent: number;
    question: Question;
}

interface ResultData {
    id: number;
    score: number;
    correctAnswers: number;
    totalQuestions: number;
    takenAt: string;
    details: Detail[];
}

export default function ExamResultPage() {
    const params = useParams();

    const router = useRouter();

    const resultId = params.id;

    const [result, setResult] =
        useState<ResultData | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [aiLoadingId, setAiLoadingId] =
        useState<number | null>(null);

    const [aiExplanations, setAiExplanations] =
        useState<Record<number, string>>({});

    useEffect(() => {
        loadResult();
    }, []);

    const loadResult = async () => {
        try {
            setLoading(true);

            const token =
                localStorage.getItem('token');

            const response = await api.get(
                `/Exams/result/${resultId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setResult(response.data);

        } catch (error) {
            console.error(error);

            alert(
                'Không thể tải kết quả bài thi'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleExplainAI = async (
        detailId: number
    ) => {
        try {
            setAiLoadingId(detailId);

            const token =
                localStorage.getItem('token');

            const response = await api.post(
                `/AI/explain-result-detail/${detailId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const explanation =
                response.data?.explanation ||
                response.data ||
                'Không có giải thích';

            setAiExplanations((prev) => ({
                ...prev,
                [detailId]: explanation,
            }));

        } catch (error) {
            console.error(error);

            alert(
                'Không thể tạo giải thích AI'
            );
        } finally {
            setAiLoadingId(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">

                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

            </div>
        );
    }

    if (!result) {
        return (
            <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white text-2xl">

                Không tìm thấy dữ liệu bài thi

            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f172a] text-white">

            <div className="max-w-6xl mx-auto px-6 py-10">

                {/* HEADER */}
                <div className="mb-10">

                    <div className="bg-[#1e293b] border border-white/10 rounded-3xl p-8">

                        <h1 className="text-4xl font-extrabold mb-8">

                            Kết quả bài thi

                        </h1>

                        <div className="grid md:grid-cols-4 gap-5">

                            <div className="bg-[#0f172a] rounded-2xl p-5 border border-white/10">

                                <p className="text-slate-400 mb-2">

                                    Điểm số

                                </p>

                                <h2 className="text-4xl font-bold text-blue-400">

                                    {result.score}

                                </h2>

                            </div>

                            <div className="bg-[#0f172a] rounded-2xl p-5 border border-white/10">

                                <p className="text-slate-400 mb-2">

                                    Số câu đúng

                                </p>

                                <h2 className="text-4xl font-bold text-green-400">

                                    {result.correctAnswers}

                                </h2>

                            </div>

                            <div className="bg-[#0f172a] rounded-2xl p-5 border border-white/10">

                                <p className="text-slate-400 mb-2">

                                    Tổng câu hỏi

                                </p>

                                <h2 className="text-4xl font-bold text-white">

                                    {result.totalQuestions}

                                </h2>

                            </div>

                            <div className="bg-[#0f172a] rounded-2xl p-5 border border-white/10">

                                <p className="text-slate-400 mb-2">

                                    Thời gian thi

                                </p>

                                <h2 className="text-lg font-bold text-white">

                                    {new Date(
                                        result.takenAt
                                    ).toLocaleString('vi-VN')}

                                </h2>

                            </div>

                        </div>

                    </div>

                </div>

                {/* DETAILS */}
                <div className="space-y-8">

                    {result.details.map(
                        (detail, index) => {
                            const selectedAnswer =
                                detail.question.answers.find(
                                    (a) =>
                                        a.id ===
                                        detail.selectedAnswerId
                                );

                            const correctAnswer =
                                detail.question.answers.find(
                                    (a) => a.isCorrect
                                );

                            return (
                                <div
                                    key={detail.id}
                                    className={`rounded-3xl p-6 border ${detail.isCorrect
                                            ? 'bg-green-500/10 border-green-500/30'
                                            : 'bg-red-500/10 border-red-500/30'
                                        }`}
                                >

                                    <div className="flex items-start justify-between gap-5 mb-6">

                                        <h2 className="text-2xl font-bold">

                                            Câu {index + 1}:{' '}
                                            {
                                                detail.question
                                                    .content
                                            }

                                        </h2>

                                        <div
                                            className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap ${detail.isCorrect
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : 'bg-red-500/20 text-red-400'
                                                }`}
                                        >

                                            {detail.isCorrect
                                                ? 'Đúng'
                                                : 'Sai'}

                                        </div>

                                    </div>

                                    <div className="space-y-4">

                                        {detail.question.answers.map(
                                            (answer) => {
                                                const isUserSelected =
                                                    answer.id ===
                                                    selectedAnswer?.id;

                                                const isCorrectAnswer =
                                                    answer.isCorrect;

                                                return (
                                                    <div
                                                        key={answer.id}
                                                        className={`p-4 rounded-2xl border ${isCorrectAnswer
                                                                ? 'bg-green-500/20 border-green-500 text-green-300'
                                                                : isUserSelected
                                                                    ? 'bg-red-500/20 border-red-500 text-red-300'
                                                                    : 'bg-[#1e293b] border-white/10'
                                                            }`}
                                                    >

                                                        <div className="flex items-center justify-between gap-4">

                                                            <span>

                                                                {answer.text}

                                                            </span>

                                                            <div className="flex items-center gap-2">

                                                                {isUserSelected && (
                                                                    <span className="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-300 text-sm">

                                                                        Bạn chọn

                                                                    </span>
                                                                )}

                                                                {isCorrectAnswer && (
                                                                    <span className="px-3 py-1 rounded-lg bg-green-500/20 text-green-300 text-sm">

                                                                        Đáp án đúng

                                                                    </span>
                                                                )}

                                                            </div>

                                                        </div>

                                                    </div>
                                                );
                                            }
                                        )}

                                    </div>

                                    {!detail.isCorrect &&
                                        correctAnswer && (
                                            <>
                                                <div className="mt-6 p-4 rounded-2xl bg-green-500/10 border border-green-500/20">

                                                    <p className="text-green-300">

                                                        Đáp án đúng:{' '}
                                                        <span className="font-bold">

                                                            {
                                                                correctAnswer.text
                                                            }

                                                        </span>

                                                    </p>

                                                </div>

                                                <div className="mt-4">

                                                    <button
                                                        onClick={() =>
                                                            handleExplainAI(
                                                                detail.id
                                                            )
                                                        }
                                                        disabled={
                                                            aiLoadingId ===
                                                            detail.id
                                                        }
                                                        className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 font-bold hover:scale-105 transition-all disabled:opacity-50"
                                                    >

                                                        {aiLoadingId ===
                                                        detail.id
                                                            ? 'AI đang giải thích...'
                                                            : 'Giải thích bằng AI'}

                                                    </button>

                                                </div>

                                                {aiExplanations[
                                                    detail.id
                                                ] && (
                                                    <div className="mt-5 p-5 rounded-2xl bg-purple-500/10 border border-purple-500/20">

                                                        <h3 className="text-purple-300 font-bold mb-3 text-lg">

                                                            Giải thích AI

                                                        </h3>

                                                        <p className="text-slate-200 leading-8 whitespace-pre-line">

                                                            {
                                                                aiExplanations[
                                                                    detail.id
                                                                ]
                                                            }

                                                        </p>

                                                    </div>
                                                )}
                                            </>
                                        )}

                                </div>
                            );
                        }
                    )}

                </div>

                {/* FOOTER */}
                <div className="mt-10 flex flex-wrap gap-4 justify-end">

                    <button
                        onClick={() =>
                            router.push('/history')
                        }
                        className="px-6 py-3 rounded-2xl bg-[#1e293b] border border-white/10 hover:bg-[#273449] transition-all"
                    >

                        Lịch sử thi

                    </button>

                    <button
                        onClick={() =>
                            router.push('/exam')
                        }
                        className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 font-bold hover:scale-105 transition-all"
                    >

                        Danh sách đề thi

                    </button>

                </div>

            </div>

        </div>
    );
}