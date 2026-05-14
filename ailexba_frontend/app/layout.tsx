'use client';

import './globals.css';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authService, UserData } from '../services/auth.service';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] =
    useState<UserData | null>(null);

  const [mounted, setMounted] =
    useState(false);

  useEffect(() => {
    setMounted(true);

    const currentUser =
      authService.getCurrentUser();

    console.log(
      'CURRENT USER:',
      currentUser
    );

    if (currentUser) {
      setUser(currentUser);
    } else {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    authService.logout();

    setUser(null);

    router.push('/login');
  };

  const navLink = (
    href: string,
    label: string
  ) => (
    <Link
      href={href}
      className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${pathname === href
        ? 'bg-blue-500/10 text-blue-400 font-semibold'
        : 'text-slate-300 hover:text-blue-400'
        }`}
    >
      {label}


    </Link>
  );

  if (!mounted) {
    return (
      <html lang="vi">
        <body className="bg-[#0f172a]" />
      </html>
    );
  }

  console.log('USER STATE:', user);

  /*const isAdmin =
    user?.role?.toLowerCase() === 'admin';*/

  const isAdminPage =
    pathname.startsWith('/admin');

  return (
    <html
      lang="vi"
      suppressHydrationWarning
    >
      <body
        className={`${inter.className} bg-[#0f172a] text-white min-h-screen flex flex-col`}
        suppressHydrationWarning
      >

        {/* !Admin */}
        {!isAdminPage && (
          <header className="sticky top-0 z-50 bg-[#1e293b] border-b border-white/10 h-16 flex items-center px-6">

            <div className="w-full px-6 h-16 flex items-center justify-between">

              {/* LOGO */}
              <Link
                href={
                  user?.role?.toLowerCase() ===
                    'admin'
                    ? '/admin/dashboard'
                    : '/'
                }
                className="text-2xl font-black bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent"
              >
                AILEXBA.
              </Link>

              {/* MENU */}
              <nav className="flex gap-6 items-center font-medium ml-auto">

                {/* CHƯA LOGIN */}
                {!user && (
                  <>
                    {navLink(
                      '/',
                      'Trang chủ'
                    )}

                    {navLink(
                      '/about',
                      'Giới thiệu'
                    )}
                  </>
                )}

                {/* STUDENT */}
                {user?.role?.toLowerCase() ===
                  'student' && (
                    <>
                      {navLink(
                        '/',
                        'Trang chủ'
                      )}

                      {navLink(
                        '/history',
                        'Lịch sử'
                      )}

                      {navLink(
                        '/exam',
                        'Đề thi'
                      )}

                      {navLink(
                        '/profile',
                        'Cá nhân'
                      )}

                      {navLink('/chat-ai', 'Chat AI')}
                    </>
                  )}

                {/* AUTH */}
                {user ? (
                  <div className="flex items-center gap-4 ml-6 pl-6 border-l border-white/10">

                    <span className="text-sm font-semibold text-white bg-[#334155] px-3 py-1 rounded-lg">
                      👋 {user.fullName}
                    </span>

                    <button
                      onClick={handleLogout}
                      className="px-5 py-2 rounded-xl font-semibold bg-gradient-to-r from-red-500 to-pink-500 hover:opacity-90 transition-all"
                    >
                      Đăng xuất
                    </button>

                  </div>
                ) : (
                  <div className="flex gap-3 ml-6">

                    <Link
                      href="/login"
                      className="px-5 py-2 text-white bg-[#334155] hover:bg-[#475569] rounded-xl transition-all"
                    >
                      Đăng nhập
                    </Link>

                    <Link
                      href="/register"
                      className="px-5 py-2 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl transition-all"
                    >
                      Đăng ký
                    </Link>

                  </div>
                )}

              </nav>

            </div>

          </header>)}

        {/* Admin sidebar */}
        <div className="flex flex-row flex-1">

          {isAdminPage && (
            <aside className="w-72 bg-[#111827] border-r border-white/10 h-screen sticky top-0 flex flex-col p-6 shrink-0">
              <div className="mb-10">
                <Link href="/admin" className="text-3xl font-black bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                  AILEXBA.
                </Link>
              </div>

              <nav className="flex flex-col gap-2 w-full">
                {navLink('/admin/dashboard', 'Thống kê hệ thống')}

                {navLink('/admin/subjects', 'Quản lý môn')}

                {navLink('/admin/exams', 'Quản lý đề thi')}

                {navLink('/admin/question', 'Quản lý câu hỏi')}

                {navLink('/admin/users', 'Quản lý gười dùng')}

                {navLink('/admin/ai', 'Quản lý AI')}

                {navLink('/profile', 'Cá nhân')}




              </nav>
              <div className="mt-auto px-4 w-full">
                <button
                  onClick={handleLogout}
                  className="w-full px-5 py-2 rounded-xl font-semibold bg-gradient-to-r from-red-500 to-pink-500 hover:opacity-90 transition-all"
                >
                  Đăng xuất
                </button>
              </div>
            </aside>
          )}

          <main className={`flex-1 bg-[#0f172a] ${isAdminPage ? 'p-8' : 'w-full px-6 py-10'}`}>
            {children}
          </main>

        </div>

        {/* FOOTER */}
        {!isAdminPage && (
          <footer className="bg-[#1e293b] border-t border-white/10 py-6 text-center text-slate-400 text-sm">

            <p className="hover:text-white transition">
              © 2026 AILEXBA Project - Nhóm Duy Tân University.
            </p>

          </footer>)}

      </body>
    </html>
  );
}