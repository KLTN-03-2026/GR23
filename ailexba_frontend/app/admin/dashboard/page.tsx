'use client';

import { useEffect, useState } from 'react';

type Stats = {
    totalUsers: number;
    totalExams: number;
    totalQuestions: number;
    totalAttempts: number;
    averageScore: number;
};

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');

                const res = await fetch('https://localhost:7083/api/Dashboard/stats', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error('Không thể tải dữ liệu dashboard');
                }

                const data = await res.json();
                setStats(data);
            } catch (err: any) {
                setError(err.message || 'Lỗi không xác định');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="text-white text-lg">
                Đang tải dashboard...
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-400">
                {error}
            </div>
        );
    }

    if (!stats) {
        return null;
    }

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div>
                <h1 className="text-3xl font-bold text-white">
                    Dashboard Admin
                </h1>
                <p className="text-slate-400 mt-1">
                    Tổng quan hệ thống AILEXBA
                </p>
            </div>

            {/* STATS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">

                <Card title="Users" value={stats.totalUsers} />
                <Card title="Exams" value={stats.totalExams} />
                <Card title="Questions" value={stats.totalQuestions} />
                <Card title="Attempts" value={stats.totalAttempts} />
                <Card
                    title="Avg Score"
                    value={Number(stats.averageScore).toFixed(2)}
                />

            </div>
        </div>
    );
}

function Card({
    title,
    value,
}: {
    title: string;
    value: string | number;
}) {
    return (
        <div className="bg-[#1e293b] border border-white/10 rounded-xl p-5 hover:scale-[1.02] transition">
            <p className="text-slate-400 text-sm">{title}</p>
            <p className="text-white text-2xl font-bold mt-2">
                {value}
            </p>
        </div>
    );
}