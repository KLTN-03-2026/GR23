'use client';

import './globals.css';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authService, UserData } from '../services/auth.service';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  
  const [user, setUser] = useState<UserData | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Sửa lỗi ESLint "cascading renders" bằng setTimeout 0ms
    const timer = setTimeout(() => {
      setIsMounted(true);
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [pathname]);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    router.push('/login');
  };

  // Hàm render Link điều hướng có hiệu ứng Active
  const navLink = (href: string, label: string) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        className={`relative px-4 py-2 transition-all duration-300 text-sm font-semibold
          ${isActive ? 'text-blue-400' : 'text-slate-400 hover:text-white'}
        `}
      >
        {label}
        {isActive && (
          <span className="absolute left-0 bottom-0 w-full h-[2px] bg-blue-500 rounded shadow-[0_0_12px_rgba(59,130,246,0.8)]"></span>
        )}
      </Link>
    );
  };

  return (
    <html lang="vi" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.className} bg-[#020617] text-slate-200 min-h-screen flex flex-col`}>

        {/* Navbar */}
        <header className="sticky top-0 z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5">
          <div className="w-full max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

            {/* Logo & Main Nav */}
            <div className="flex items-center gap-8">
              <Link
                href="/"
                className="text-2xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent hover:opacity-80 transition-all tracking-tighter"
              >
                AILEXBA.
              </Link>

              <nav className="hidden md:flex items-center gap-1">
                {navLink("/", "Trang chủ")}
                {navLink("/about", "Giới thiệu")}
                
                {/* Tích hợp Key Admin: Chỉ hiện nếu User có quyền Admin */}
                {isMounted && user?.role === 'Admin' && navLink("/admin/subjects", "Quản trị")}
              </nav>
            </div>

            {/* Auth Section */}
            <div className="flex items-center gap-4">
              {isMounted ? (
                user ? (
                  <div className="flex items-center gap-4 pl-6 border-l border-white/10">
                    <div className="hidden sm:flex flex-col items-end">
                      <span className="text-[9px] uppercase tracking-[0.2em] text-blue-500 font-black">
                        {user.role}
                      </span>
                      <span className="text-sm font-bold text-white tracking-tight">
                        {user.fullName}
                      </span>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="group flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-white/5 transition-all"
                    >
                      ĐĂNG XUẤT
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Link
                      href="/login"
                      className="px-5 py-2 text-xs font-bold text-slate-300 hover:text-white transition-colors"
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      href="/register"
                      className="px-6 py-2 text-xs font-black uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-lg shadow-blue-900/20 active:scale-95"
                    >
                      Bắt đầu ngay
                    </Link>
                  </div>
                )
              ) : (
                <div className="w-20 h-8 bg-white/5 animate-pulse rounded-xl"></div>
              )}
            </div>
          </div>
        </header>

        {/* Nội dung chính */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-10">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-[#020617] border-t border-white/5 py-10">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1">
              <p className="text-white font-bold text-sm">AILEXBA Project</p>
              <p className="text-slate-500 text-xs font-medium">
                © 2026 Duy Tan University - School of Computer Science.
              </p>
            </div>
            
            <div className="flex gap-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
              <Link href="/privacy" className="hover:text-blue-400 transition">Bảo mật</Link>
              <Link href="/terms" className="hover:text-blue-400 transition">Điều khoản</Link>
              <Link href="/contact" className="hover:text-blue-400 transition">Liên hệ</Link>
            </div>
          </div>
        </footer>

      </body>
    </html>
  );
}