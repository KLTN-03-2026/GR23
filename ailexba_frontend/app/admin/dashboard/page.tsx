'use client';

import { useEffect, useState } from 'react';
import api from '@/services/common';

type Stats = {
    totalUsers: number;
    totalExams: number;
    totalQuestions: number;
    totalAttempts: number;
    averageScore: number;
};

type SubjectStat = {
    name: string;
    count: number;
};

export default function AdminDashboardPage() {

    const [stats, setStats] =
        useState<Stats | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    const [topSubjects, setTopSubjects] =
        useState<SubjectStat[]>([]);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            setLoading(true);

            const token =
                localStorage.getItem('token');

            const [
                statsRes,
                examsRes,
            ] = await Promise.all([
                api.get(
                    '/Dashboard/stats',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                ),

                api.get('/Exams', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }),
            ]);

            setStats(statsRes.data);

            const exams =
                examsRes.data || [];

            /* TOP SUBJECTS */
            const subjectMap:
                Record<
                    string,
                    number
                > = {};

            exams.forEach((exam: any) => {
                const subject =
                    exam.subjectName ||
                    'Khác';

                subjectMap[subject] =
                    (subjectMap[
                        subject
                    ] || 0) + 1;
            });

            const top =
                Object.entries(
                    subjectMap
                )
                    .map(
                        ([name, count]) => ({
                            name,
                            count,
                        })
                    )
                    .sort(
                        (a, b) =>
                            b.count -
                            a.count
                    )
                    .slice(0, 5);

            setTopSubjects(top);

        } catch (err: any) {
            console.error(err);

            setError(
                err.message ||
                'Lỗi không xác định'
            );
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">

                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-400 p-10">

                {error}

            </div>
        );
    }

    if (!stats) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#0f172a] text-white">

            <div className="max-w-7xl mx-auto px-6 py-10">

                {/* HEADER */}
                <div className="mb-10">

                    <h1 className="text-5xl font-extrabold mb-4">

                        Dashboard Admin

                    </h1>

                    <p className="text-slate-400 text-lg">

                        Tổng quan hệ thống AILEXBA

                    </p>

                </div>

                {/* PANELS */}
                <div className="grid xl:grid-cols-2 gap-8">

                    {/* SYSTEM OVERVIEW */}
                    <div className="bg-[#1e293b] border border-white/10 rounded-3xl p-8">

                        <h2 className="text-3xl font-bold mb-8">

                            Tổng quan hệ thống

                        </h2>

                        <div className="grid md:grid-cols-2 gap-5">

                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-3xl p-6">

                                <div className="flex items-center justify-between mb-5">

                                    <div className="text-5xl">
                                        👥
                                    </div>

                                    <div className="px-4 py-2 rounded-2xl bg-blue-500 text-sm font-bold">

                                        LIVE

                                    </div>

                                </div>

                                <p className="text-slate-300 text-lg mb-2">

                                    Người dùng

                                </p>

                                <h3 className="text-5xl font-extrabold text-white">

                                    {stats.totalUsers}

                                </h3>

                            </div>

                            <div className="bg-purple-500/10 border border-purple-500/20 rounded-3xl p-6">

                                <div className="flex items-center justify-between mb-5">

                                    <div className="text-5xl">
                                        📝
                                    </div>

                                    <div className="px-4 py-2 rounded-2xl bg-purple-500 text-sm font-bold">

                                        LIVE

                                    </div>

                                </div>

                                <p className="text-slate-300 text-lg mb-2">

                                    Đề thi

                                </p>

                                <h3 className="text-5xl font-extrabold text-white">

                                    {stats.totalExams}

                                </h3>

                            </div>

                            <div className="bg-orange-500/10 border border-orange-500/20 rounded-3xl p-6">

                                <div className="flex items-center justify-between mb-5">

                                    <div className="text-5xl">
                                        📚
                                    </div>

                                    <div className="px-4 py-2 rounded-2xl bg-orange-500 text-sm font-bold">

                                        LIVE

                                    </div>

                                </div>

                                <p className="text-slate-300 text-lg mb-2">

                                    Câu hỏi

                                </p>

                                <h3 className="text-5xl font-extrabold text-white">

                                    {stats.totalQuestions}

                                </h3>

                            </div>

                            <div className="bg-green-500/10 border border-green-500/20 rounded-3xl p-6">

                                <div className="flex items-center justify-between mb-5">

                                    <div className="text-5xl">
                                        🎯
                                    </div>

                                    <div className="px-4 py-2 rounded-2xl bg-green-500 text-sm font-bold">

                                        LIVE

                                    </div>

                                </div>

                                <p className="text-slate-300 text-lg mb-2">

                                    Lượt làm bài

                                </p>

                                <h3 className="text-5xl font-extrabold text-white">

                                    {stats.totalAttempts}

                                </h3>

                            </div>

                            <div className="md:col-span-2 bg-yellow-500/10 border border-yellow-500/20 rounded-3xl p-6">

                                <div className="flex items-center justify-between mb-5">

                                    <div className="text-5xl">
                                        ⭐
                                    </div>

                                    <div className="px-4 py-2 rounded-2xl bg-yellow-500 text-sm font-bold">

                                        LIVE

                                    </div>

                                </div>

                                <p className="text-slate-300 text-lg mb-2">

                                    Điểm trung bình hệ thống

                                </p>

                                <h3 className="text-5xl font-extrabold text-white">

                                    {Number(
                                        stats.averageScore
                                    ).toFixed(2)}

                                </h3>

                            </div>

                        </div>

                    </div>

                    {/* TOP SUBJECTS */}
                    <div className="bg-[#1e293b] border border-white/10 rounded-3xl p-8">

                        <h2 className="text-3xl font-bold mb-8">

                            Top môn học

                        </h2>

                        <div className="space-y-5">

                            {topSubjects.map(
                                (
                                    subject,
                                    index
                                ) => (
                                    <div
                                        key={
                                            index
                                        }
                                        className="bg-[#0f172a] border border-white/10 rounded-2xl p-5"
                                    >

                                        <div className="flex items-center justify-between mb-3">

                                            <div className="flex items-center gap-3">

                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center font-bold">

                                                    {
                                                        index +
                                                        1
                                                    }

                                                </div>

                                                <div>

                                                    <h3 className="font-bold text-lg">

                                                        {
                                                            subject.name
                                                        }

                                                    </h3>

                                                    <p className="text-slate-400 text-sm">

                                                        {
                                                            subject.count
                                                        }{' '}
                                                        đề thi

                                                    </p>

                                                </div>

                                            </div>

                                            <div className="text-2xl">

                                                📚

                                            </div>

                                        </div>

                                        <div className="w-full h-3 bg-[#1e293b] rounded-full overflow-hidden">

                                            <div
                                                className="h-full bg-gradient-to-r from-purple-600 to-pink-500 rounded-full"
                                                style={{
                                                    width: `${subject.count * 15}%`,
                                                }}
                                            ></div>

                                        </div>

                                    </div>
                                )
                            )}

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}