// app/forgot-password/page.tsx

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { authService } from '../../services/auth.service';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      await authService.forgotPassword(email);

      setSuccess(' Đã gửi yêu cầu khôi phục mật khẩu!');
      setEmail('');
    } catch (err: unknown) {
      if (typeof err === 'string') {
        setError(err);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Có lỗi xảy ra!');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-[80vh] px-6">

      <div className="absolute w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full"></div>

      <div className="fade-up w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-6 shadow-2xl">

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold"> Quên mật khẩu</h1>
          <p className="text-slate-400">
            Nhập email để nhận hướng dẫn khôi phục
          </p>
        </div>

        {success && (
          <div className="p-3 bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-xl">
            {success}
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl">
            {error}
          </div>
        )}

        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">📧</span>
          <input
            type="email"
            placeholder="Nhập email của bạn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 p-3 rounded-xl bg-slate-800 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 transition"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl font-bold hover:scale-105 transition shadow-lg disabled:opacity-60"
        >
          {loading ? 'Đang gửi...' : 'Gửi yêu cầu'}
        </button>

        <p className="text-center text-slate-400 text-sm">
          Quay lại{' '}
          <Link href="/login" className="text-blue-400 hover:underline">
            đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}