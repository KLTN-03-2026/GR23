// app/profile/page.tsx

'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { authService } from '../../services/auth.service';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);

    if (currentUser?.avatarUrl) {
      setAvatar(currentUser.avatarUrl);
    }
  }, []);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const response = await authService.uploadAvatar(file);

      if (response.avatarUrl) {
        setAvatar(response.avatarUrl);
      }
    } catch (error) {
      console.error(error);
      alert('Không thể tải ảnh lên');
    }
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="relative max-w-5xl mx-auto px-6 py-12">

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full -z-10"></div>

      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold mb-3">
          Hồ sơ cá nhân
        </h1>
        <p className="text-slate-400 text-lg">
          Quản lý thông tin tài khoản và theo dõi quá trình học tập
        </p>
      </div>

      <div className="p-[1px] rounded-3xl bg-gradient-to-r from-blue-500/40 to-indigo-500/40 shadow-[0_0_30px_rgba(59,130,246,0.15)]">
        <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl p-8 md:p-10">

          <div className="flex flex-col md:flex-row items-center gap-8">

            <div className="flex flex-col items-center">
              <div
                onClick={handleAvatarClick}
                className="relative w-32 h-32 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-5xl font-bold shadow-lg cursor-pointer group border-4 border-white/10 hover:scale-105 transition-all"
              >
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{user.fullName?.charAt(0).toUpperCase()}</span>
                )}

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-sm font-semibold transition">
                  Đổi ảnh
                </div>
              </div>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                className="hidden"
              />

              <span className="mt-4 px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-medium">
                {user.role || 'Học viên'}
              </span>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5 w-full">

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <p className="text-slate-400 text-sm mb-2">Họ và tên</p>
                <p className="text-lg font-semibold text-white">
                  {user.fullName}
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <p className="text-slate-400 text-sm mb-2">Email</p>
                <p className="text-lg font-semibold text-white">
                  {user.email || 'Chưa cập nhật'}
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <p className="text-slate-400 text-sm mb-2">Vai trò</p>
                <p className="text-lg font-semibold text-white">
                  {user.role || 'User'}
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <p className="text-slate-400 text-sm mb-2">ID người dùng</p>
                <p className="text-lg font-semibold text-white">
                  #{user.userId}
                </p>
              </div>

            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-4 justify-center md:justify-end">
            <Link
              href="/history"
              className="px-6 py-3 rounded-xl bg-white/10 border border-white/10 text-white font-semibold hover:bg-white/20 transition-all"
            >
              Xem lịch sử thi
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}