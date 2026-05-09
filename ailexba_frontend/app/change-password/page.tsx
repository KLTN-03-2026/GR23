'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService, UserData } from '../../services/auth.service';
import axios,{ AxiosError } from "axios";
import api from "@/services/common"

export default function ChangePasswordPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [formData, setFormData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      router.push('/login');
    } else {
      setUser(currentUser);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    if (formData.newPassword !== formData.confirmPassword) {
      setStatus({ type: 'error', message: 'Mật khẩu xác nhận không khớp!' });
      return;
    }

    setLoading(true);
    try {
      await api.post(`https://localhost:7083/api/Auth/change-password`, {
        email: user?.email, 
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword
      });
      setStatus({ type: 'success', message: 'Đổi mật khẩu thành công! Vui lòng đăng nhập lại.' });
      setTimeout(() => {
        authService.logout();
        router.push('/login');
      }, 2000);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setStatus({ type: 'error', message: err.response?.data?.message || 'Có lỗi xảy ra!' });
      } else {
        setStatus({ type: 'error', message: 'Có lỗi không xác định!' });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
      <div className="mb-8 border-b pb-4">
        <h1 className="text-2xl font-bold text-slate-800">🔐 Đổi Mật Khẩu</h1>
        <p className="text-sm text-slate-500 mt-1">Bảo vệ tài khoản AILEXBA của bạn</p>
      </div>

      {status.message && (
        <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${status.type === 'error' ? 'bg-red-50 text-red-700 border-l-4 border-red-500' : 'bg-green-50 text-green-700 border-l-4 border-green-500'}`}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Mật khẩu hiện tại</label>
          <input 
            type="password" required
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={formData.oldPassword}
            onChange={(e) => setFormData({...formData, oldPassword: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Mật khẩu mới</label>
          <input 
            type="password" required minLength={6}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={formData.newPassword}
            onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Xác nhận mật khẩu mới</label>
          <input 
            type="password" required minLength={6}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
          />
        </div>
        
        <div className="flex gap-4 pt-4">
          <Link href="/" className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all text-center flex-1">
            Hủy bỏ
          </Link>
          <button 
            type="submit" disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all flex-1 disabled:opacity-70"
          >
            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </form>
    </div>
  );
}