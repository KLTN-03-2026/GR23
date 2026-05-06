'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { authService } from '../../services/auth.service';
import { Eye, EyeOff, Pencil, Save, Lock } from 'lucide-react';
import api from '@/services/common';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [avatar, setAvatar] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profileForm, setProfileForm] = useState({
    fullName: '',
    email: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);

    if (currentUser) {
      setProfileForm({
        fullName: currentUser.fullName || '',
        email: currentUser.email || ''
      });
    }
  }, []);

  const handleUpdateProfile = async () => {
  try {
    const response = await api.put(
      `https://localhost:7083/api/Users/${user.userId}/profile`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: profileForm.fullName
        })
      }
    );

    const data = await response.data;

    if (response.status != 200) {
      throw new Error(data.message || 'Cập nhật thất bại');
    }

    const updatedUser = {
      ...user,
      fullName: profileForm.fullName
    };

    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditing(false);

    alert(data.message || 'Cập nhật thông tin thành công');
  } catch (error: any) {
    console.error(error);
    alert(error.message || 'Không thể cập nhật thông tin');
  }
};

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp');
      return;
    }

    try {
      const response = await api.put(
  `https://localhost:7083/api/Users/${user.userId}/change-password`,
  {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      oldPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword
    })
  }
);

const data = await response.data;

if (response.status != 200) {
  console.log(data);
  throw new Error(data.message || 'Đổi mật khẩu thất bại');
}

      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      alert(data.message || 'Đổi mật khẩu thành công');
      } catch (error) {
      console.error(error);
      alert('Không thể đổi mật khẩu');
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
    <div className="relative max-w-6xl mx-auto px-6 py-12">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full -z-10"></div>

      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold mb-3 text-white">
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
              <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-5xl font-bold shadow-lg border-4 border-white/10">
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{user.fullName?.charAt(0).toUpperCase()}</span>
                )}
              </div>

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

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Thông tin cá nhân
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">
                    Cập nhật thông tin tài khoản của bạn
                  </p>
                </div>

                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center hover:bg-blue-500/20 transition"
                >
                  <Pencil size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={profileForm.fullName}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, fullName: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    disabled={!isEditing}
                    value={profileForm.email}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, email: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white disabled:opacity-60"
                  />
                </div>

                {isEditing && (
                  <button
                    onClick={handleUpdateProfile}
                    className="w-full mt-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                  >
                    <Save size={18} />
                    Lưu thông tin
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center">
                  <Lock size={22} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-white">
                    Đổi mật khẩu
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">
                    Cập nhật mật khẩu để bảo mật tài khoản
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <label className="block text-sm text-slate-400 mb-2">
                    Mật khẩu hiện tại
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                    }
                    className="w-full px-4 py-3 pr-12 rounded-xl bg-white/5 border border-white/10 text-white"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-[42px] text-slate-400"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="relative">
                  <label className="block text-sm text-slate-400 mb-2">
                    Mật khẩu mới
                  </label>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                    }
                    className="w-full px-4 py-3 pr-12 rounded-xl bg-white/5 border border-white/10 text-white"
                  />

                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-[42px] text-slate-400"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="relative">
                  <label className="block text-sm text-slate-400 mb-2">
                    Xác nhận mật khẩu mới
                  </label>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                    }
                    className="w-full px-4 py-3 pr-12 rounded-xl bg-white/5 border border-white/10 text-white"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-[42px] text-slate-400"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <button
                  onClick={handleChangePassword}
                  className="w-full mt-2 px-5 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold hover:scale-[1.02] transition-all"
                >
                  Đổi mật khẩu
                </button>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-4 justify-center md:justify-end">
          </div>
        </div>
      </div>
    </div>
  );
}
