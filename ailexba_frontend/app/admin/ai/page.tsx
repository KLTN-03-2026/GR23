'use client';

import { useEffect, useState } from 'react';

export default function AdminAIPage() {
    const [status, setStatus] = useState<any>(null);

    const fetchStatus = async () => {
        const token = localStorage.getItem('token');

        const res = await fetch(
            'http://localhost:5080/api/AIConfig/status',
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = await res.json();
        setStatus(data);
    };

    useEffect(() => {
        fetchStatus();
    }, []);

    return (
        <div className="space-y-6">

            <h1 className="text-2xl font-bold text-white">
                AI System Control
            </h1>

            {/* STATUS CARD */}
            <div className="bg-[#1e293b] p-6 rounded-xl border border-white/10">
                <p className="text-slate-400">AI Status</p>
                <p className="text-white text-xl mt-2">
                    {status?.status}
                </p>

                <p className="text-slate-400 text-sm mt-2">
                    Model: {status?.model}
                </p>
            </div>

            {/* TEST AI BUTTON */}
            <div className="bg-[#1e293b] p-6 rounded-xl">
                <button
                    className="px-4 py-2 bg-blue-600 rounded"
                    onClick={async () => {
                        const res = await fetch(
                            'http://localhost:5080/api/AI/explain-simple',
                            {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                                },
                                body: JSON.stringify({
                                    question: 'Test question',
                                    userAnswer: 'A',
                                    correctAnswer: 'B',
                                }),
                            }
                        );

                        const data = await res.json();
                        alert(data.explanation);
                    }}
                >
                    Test AI Explain
                </button>
            </div>

        </div>
    );
}