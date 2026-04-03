'use client';
import './globals.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authService, UserData } from '../services/auth.service';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(authService.getCurrentUser());
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    router.push('/login');
  };

  return (
    <html lang="vi">
      <body className="bg-slate-50 min-h-screen flex flex-col text-slate-800">
        {/* Navbar */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              AILEXBA.
            </Link>
            
            <nav className="flex gap-4 items-center font-medium">
              <Link href="/" className="hover:text-blue-600 transition-colors">Trang chủ</Link>
              {user ? (
                <div className="flex items-center gap-4 ml-4 pl-4 border-l border-slate-200">
                  <span className="text-sm font-bold text-slate-700">Chào, {user.fullName}</span>
                  <button onClick={handleLogout} className="text-sm bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-all font-bold">
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <div className="flex gap-3 ml-4">
                  <Link href="/login" className="px-5 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all">Đăng nhập</Link>
                  <Link href="/register" className="px-5 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-md shadow-blue-200">Đăng ký</Link>
                </div>
              )}
            </nav>
          </div>
        </header>

        {/* Nội dung chính */}
        <main className="flex-1 w-full max-w-7xl mx-auto p-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t py-8 text-center text-slate-500 text-sm mt-auto">
          <p>© 2026 AILEXBA Project - Nhóm Duy Tân University.</p>
        </footer>
      </body>
    </html>
  );
}