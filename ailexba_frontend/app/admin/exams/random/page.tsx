'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/common';

interface Subject {
    id: number;
    name: string;
}

export default function RandomExamPage() {
    const router = useRouter();

    const [subjects, setSubjects] =
        useState<Subject[]>([]);

    const [loading, setLoading] =
        useState(false);

    const [formData, setFormData] =
        useState({
            title: 'Đề ngẫu nhiên',
            subjectId: '',
            questionCount: '',
            duration: '',
        });

    useEffect(() => {
        loadSubjects();
    }, []);

    const loadSubjects = async () => {
        try {
            const token =
                localStorage.getItem('token');

            const response = await api.get(
                '/Subjects',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setSubjects(response.data || []);

        } catch (error) {
            console.error(error);

            alert(
                'Không thể tải môn học'
            );
        }
    };

    const handleCreateExam = async () => {
        try {
            setLoading(true);

            const token =
                localStorage.getItem('token');

            const payload = {
                title: formData.title,
                subjectId: Number(
                    formData.subjectId
                ),
                questionCount: Number(
                    formData.questionCount
                ),
                duration: Number(
                    formData.duration
                ),
            };

            const response = await api.post(
                '/Exams/create-random',
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert(
                'Tạo đề ngẫu nhiên thành công!'
            );

           router.push('/admin/exams');

        } catch (error: any) {
            console.error(error);

            if (
                error?.response?.status === 403
            ) {
                alert(
                    'Chỉ Admin mới được tạo đề ngẫu nhiên'
                );
            } else {
                alert(
                    'Không thể tạo đề ngẫu nhiên'
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-white">

            <div className="max-w-2xl mx-auto px-6 py-14">

                <div className="mb-10">

                    <button
                        onClick={() =>
                            router.push('/admin/exams')
                        }
                        className="text-blue-400 hover:text-blue-300 mb-5"
                    >

                        ← Quay lại

                    </button>

                    <h1 className="text-5xl font-extrabold mb-4">

                        Tạo đề ngẫu nhiên

                    </h1>

                    <p className="text-slate-400 text-lg">

                        Hệ thống sẽ tự tạo đề thi
                        ngẫu nhiên theo môn học

                    </p>

                </div>

                <div className="bg-[#1e293b] border border-white/10 rounded-3xl p-8 space-y-6">

                    {/* TITLE */}
                    <div>

                        <label className="block mb-3 text-slate-300 font-semibold">

                            Tên đề thi

                        </label>

                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    title:
                                        e.target.value,
                                })
                            }
                            className="w-full bg-[#0f172a] border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-blue-500"
                        />

                    </div>

                    {/* SUBJECT */}
                    <div>

                        <label className="block mb-3 text-slate-300 font-semibold">

                            Môn học

                        </label>

                        <select
                            value={formData.subjectId}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    subjectId:
                                        e.target.value,
                                })
                            }
                            className="w-full bg-[#0f172a] border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-blue-500"
                        >

                            <option value="">
                                Chọn môn học
                            </option>

                            {subjects.map((s) => (
                                <option
                                    key={s.id}
                                    value={s.id}
                                >

                                    {s.name}

                                </option>
                            ))}

                        </select>

                    </div>

                    {/* QUESTION COUNT */}
                    <div>

                        <label className="block mb-3 text-slate-300 font-semibold">

                            Số câu hỏi

                        </label>

                        <input
                            type="number"
                            value={
                                formData.questionCount
                            }
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    questionCount:
                                        e.target.value,
                                })
                            }
                            placeholder="Ví dụ: 20"
                            className="w-full bg-[#0f172a] border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-blue-500"
                        />

                    </div>

                    {/* DURATION */}
                    <div>

                        <label className="block mb-3 text-slate-300 font-semibold">

                            Thời gian (phút)

                        </label>

                        <input
                            type="number"
                            value={formData.duration}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    duration:
                                        e.target.value,
                                })
                            }
                            placeholder="Ví dụ: 30"
                            className="w-full bg-[#0f172a] border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-blue-500"
                        />

                    </div>

                    <button
                        onClick={handleCreateExam}
                        disabled={
                            loading ||
                            !formData.subjectId ||
                            !formData.questionCount ||
                            !formData.duration
                        }
                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 font-bold text-lg hover:scale-[1.02] transition-all disabled:opacity-50"
                    >

                        {loading
                            ? 'Đang tạo đề...'
                            : 'Tạo đề ngẫu nhiên'}

                    </button>

                </div>

            </div>

        </div>
    );
}