'use client';

import { useState, useEffect } from 'react';
import api from '@/services/common';
import { authService } from '@/services/auth.service';
import { useRef } from 'react';

import {
    Brain,
    Sparkles,
    BarChart3,
    SendHorizontal,
    Loader2,
} from 'lucide-react';

type TabType =
    | 'predict'
    | 'explain'
    | 'analyze';

export default function ChatAIPage() {

    const resultRef =
        useRef<HTMLDivElement>(null);

    const [activeTab, setActiveTab] =
        useState<TabType>('predict');

    const [loading, setLoading] =
        useState(false);

    const [response, setResponse] =
        useState('');

    // EXPLAIN FORM
    const [question, setQuestion] =
        useState('');

    const [userAnswer, setUserAnswer] =
        useState('');

    const [correctAnswer, setCorrectAnswer] =
        useState('');

    useEffect(() => {

        if (!authService.isLoggedIn()) {
            window.location.href = '/login';
        }

    }, []);
    // ANALYZE
    const [detailId, setDetailId] =
        useState('');

    // =========================
    // PREDICT SCORE
    // =========================

    const handlePredict =
        async () => {

            try {

                setLoading(true);
                setResponse('');

                const res =
                    await api.get(
                        '/AI/predict-score'
                    );

                setResponse(`
                🎯 Điểm dự đoán: ${res.data.predictedScore || res.data.score || 'N/A'}            

                📊 Phân tích:
                ${res.data.analysis || 'Chưa có dữ liệu phân tích'}

                🧠 Nhận xét AI:
                ${res.data.recommendation || 'Hãy tiếp tục luyện tập để cải thiện kết quả.'}
                `);

                setTimeout(() => {
                    resultRef.current?.scrollIntoView({
                        behavior: 'smooth',
                    });
                }, 100);

            } catch (err: unknown) {

                if (
                    typeof err === 'object' &&
                    err !== null &&
                    'response' in err
                ) {
                    setResponse(
                        'AI chưa đủ dữ liệu để phân tích hoặc phiên đăng nhập đã hết hạn.'
                    );
                    setTimeout(() => {
                        resultRef.current?.scrollIntoView({
                            behavior: 'smooth',
                        });
                    }, 100);
                } else {
                    setResponse(
                        'Không thể dự đoán điểm.'
                    );
                    setTimeout(() => {
                        resultRef.current?.scrollIntoView({
                            behavior: 'smooth',
                        });
                    }, 100);
                }

            } finally {
                setLoading(false);
            }
        };

    // =========================
    // EXPLAIN AI
    // =========================

    const handleExplain =
        async () => {
            if (
                !question ||
                !userAnswer ||
                !correctAnswer
            ) {
                setResponse(
                    'Vui lòng nhập đầy đủ dữ liệu.'
                );

                return;
            }

            try {

                setLoading(true);
                setResponse('');

                const res =
                    await api.post(
                        '/AI/explain-simple',
                        {
                            question,
                            userAnswer,
                            correctAnswer,
                        }
                    );

                setResponse(
                    res.data.explanation
                );
                setTimeout(() => {
                    resultRef.current?.scrollIntoView({
                        behavior: 'smooth',
                    });
                }, 100);

            } catch {

                setResponse(
                    'Không thể tạo giải thích.'
                );

            } finally {

                setLoading(false);
            }
        };

    // =========================
    // ANALYZE RESULT
    // =========================

    const handleAnalyze =
        async () => {
            if (!detailId) {
                setResponse(
                    'Vui lòng nhập Detail ID.'
                );

                return;
            }

            try {

                setLoading(true);
                setResponse('');

                const res =
                    await api.post(
                        `/AI/explain-result-detail/${detailId}`
                    );

                setResponse(
                    res.data.explanation
                );
                setTimeout(() => {
                    resultRef.current?.scrollIntoView({
                        behavior: 'smooth',
                    });
                }, 100);

            } catch {

                setResponse(
                    'Không thể phân tích bài làm.'
                );

            } finally {

                setLoading(false);
            }
        };

    return (

        <div className="min-h-screen text-white">

            <div className="max-w-7xl mx-auto px-6 py-10">

                {/* HEADER */}

                <div className="mb-10">

                    <div className="flex items-center gap-4 mb-4">

                        <div className="w-16 h-16 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-xl">

                            <Brain size={32} />

                        </div>

                        <div>

                            <h1 className="text-4xl font-extrabold">
                                AI Learning Assistant
                            </h1>

                            <p className="text-slate-400 mt-1">
                                Hỗ trợ học tập thông minh bằng AI
                            </p>

                        </div>

                    </div>

                </div>

                {/* TABS */}

                <div className="flex flex-wrap gap-4 mb-8">

                    <button
                        onClick={() =>
                            setActiveTab('predict')
                        }
                        className={`px-5 py-3 rounded-2xl font-semibold transition-all ${activeTab === 'predict'
                            ? 'bg-blue-600 text-white'
                            : 'bg-[#1e293b] text-slate-300'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <BarChart3 size={18} />
                            Dự đoán điểm
                        </div>
                    </button>

                    <button
                        onClick={() =>
                            setActiveTab('explain')
                        }
                        className={`px-5 py-3 rounded-2xl font-semibold transition-all ${activeTab === 'explain'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-[#1e293b] text-slate-300'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <Sparkles size={18} />
                            AI giải thích
                        </div>
                    </button>

                    <button
                        onClick={() =>
                            setActiveTab('analyze')
                        }
                        className={`px-5 py-3 rounded-2xl font-semibold transition-all ${activeTab === 'analyze'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#1e293b] text-slate-300'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <Brain size={18} />
                            Phân tích bài làm
                        </div>
                    </button>

                </div>

                {/* CONTENT */}

                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* LEFT: Phần nhập liệu/điều khiển */}
                    <div className="w-full lg:w-1/3">
                        <div className="bg-[#1e293b] border border-white/10 rounded-3xl p-6 shadow-xl sticky top-24">

                            {/* PREDICT */}
                            {activeTab === 'predict' && (
                                <div className="space-y-5">
                                    <h2 className="text-2xl font-bold">Dự đoán điểm AI</h2>
                                    <p className="text-slate-400">
                                        AI sẽ phân tích dữ liệu học tập để dự đoán điểm thi của bạn.
                                    </p>
                                    <button
                                        onClick={handlePredict}
                                        disabled={loading}
                                        className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 font-bold transition-all"
                                    >
                                        {loading
                                            ? 'Đang phân tích...'
                                            : 'Phân tích ngay'}
                                    </button>
                                </div>
                            )}

                            {/* EXPLAIN */}

                            {activeTab === 'explain' && (
                                <div className="space-y-5">
                                    <h2 className="text-2xl font-bold">AI giải thích bài</h2>
                                    <textarea
                                        placeholder="Nhập câu hỏi..."
                                        value={question}
                                        onChange={(e) => setQuestion(e.target.value)}
                                        className="w-full h-32 px-4 py-4 rounded-2xl bg-[#0f172a] border border-white/10 outline-none focus:border-indigo-500 transition-all"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Đáp án của bạn"
                                        value={userAnswer}
                                        onChange={(e) => setUserAnswer(e.target.value)}
                                        className="w-full px-4 py-4 rounded-2xl bg-[#0f172a] border border-white/10 outline-none"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Đáp án đúng"
                                        value={correctAnswer}
                                        onChange={(e) => setCorrectAnswer(e.target.value)}
                                        className="w-full px-4 py-4 rounded-2xl bg-[#0f172a] border border-white/10 outline-none"
                                    />
                                    <button
                                        onClick={handleExplain}
                                        disabled={loading}
                                        className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-bold transition-all flex items-center justify-center gap-2"
                                    >
                                        <>
                                            {loading ? (
                                                <>
                                                    <Loader2
                                                        size={18}
                                                        className="animate-spin"
                                                    />
                                                    Đang xử lý...
                                                </>
                                            ) : (
                                                <>
                                                    <SendHorizontal size={18} />
                                                    Gửi yêu cầu
                                                </>
                                            )}
                                        </>
                                    </button>
                                </div>
                            )}

                            {/* ANALYZE */}

                            {activeTab === 'analyze' && (
                                <div className="space-y-5">
                                    <h2 className="text-2xl font-bold">Phân tích bài làm</h2>
                                    <input
                                        type="number"
                                        placeholder="Nhập Detail ID"
                                        value={detailId}
                                        onChange={(e) => setDetailId(e.target.value)}
                                        className="w-full px-4 py-4 rounded-2xl bg-[#0f172a] border border-white/10 outline-none"
                                    />
                                    <button
                                        onClick={handleAnalyze}
                                        disabled={loading}
                                        className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 font-bold transition-all"
                                    >
                                        Phân tích ngay
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT: Phần hiển thị kết quả */}
                    <div className="w-full lg:flex-1">
                        <div ref={resultRef} className="bg-[#1e293b] border border-white/10 rounded-3xl p-8 shadow-xl min-h-[500px]">
                            <div className="flex items-center gap-3 mb-6">
                                <Sparkles className="text-blue-400" size={26} />
                                <h2 className="text-2xl font-bold">Kết quả AI</h2>
                            </div>

                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-32 text-slate-400">
                                    <Loader2 className="animate-spin mb-4" size={40} />
                                    <p>AI đang suy nghĩ...</p>
                                </div>
                            ) : response ? (
                                <div className="bg-[#0f172a]/50 rounded-2xl p-6 border border-white/5 whitespace-pre-wrap leading-8 text-slate-200 text-[15px] overflow-auto max-h-[650px]">
                                    {response}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-32 text-center text-slate-500">
                                    <Brain size={60} className="mb-5 opacity-20" />
                                    <p className="text-lg">Kết quả phân tích sẽ xuất hiện ở đây</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}