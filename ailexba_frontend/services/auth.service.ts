import axios, { AxiosError } from 'axios';

const API_URL = 'https://localhost:7083/api/Auth';

// ===============================
// INTERFACES
// ===============================

export interface RegisterData {
  fullName?: string;
  email?: string;
  password?: string;
}

export interface LoginData {
  email?: string;
  password?: string;
}

export interface UserData {
  userId: number;
  fullName: string;
  role: string;
  email?: string;
  token?: string;
}

interface ErrorResponse {
  message?: string;
}

// ===============================
// AUTH SERVICE
// ===============================

export const authService = {

  // ===============================
  // REGISTER
  // ===============================

  register: async (data: RegisterData) => {
    try {
      const response = await axios.post(
        `${API_URL}/register`,
        data
      );

      return response.data;

    } catch (error: unknown) {

      const axiosError =
        error as AxiosError<ErrorResponse>;

      throw (
        axiosError.response?.data?.message ||
        'Đăng ký thất bại!'
      );
    }
  },

  // ===============================
  // LOGIN
  // ===============================

  login: async (data: LoginData) => {
    try {

      const response = await axios.post(
        `${API_URL}/login`,
        data
      );

      const resData = response.data;

      console.log(
        'Dữ liệu thực tế từ BE:',
        resData
      );

      // LẤY DỮ LIỆU USER
      const finalId =
        resData.userId ||
        resData.id ||
        resData.user?.id ||
        resData.user?.userId;

      const finalFullName =
        resData.fullName ||
        resData.user?.fullName;

      const finalRole =
        resData.role ||
        resData.user?.role;

      const finalEmail =
        resData.email ||
        resData.user?.email;

      const finalToken =
        resData.token ||
        resData.user?.token;

      if (finalId) {

        const userData: UserData = {
          userId: finalId,

          fullName:
            finalFullName ||
            'Người dùng',

          role:
            finalRole ||
            'Student',

          email:
            finalEmail || '',

          token:
            finalToken || '',
        };

        // LƯU LOCAL STORAGE
        localStorage.setItem(
          'user',
          JSON.stringify(userData)
        );

        if (finalToken) {
          localStorage.setItem(
            'token',
            finalToken
          );
        }

        console.log(
          '>>> Đăng nhập thành công'
        );

        return userData;

      } else {

        console.error(
          '>>> Không tìm thấy ID:',
          resData
        );

        throw new Error(
          'Lỗi cấu trúc dữ liệu từ máy chủ'
        );
      }

    } catch (error: unknown) {

      if (axios.isAxiosError(error)) {

        const axiosError =
          error as AxiosError<ErrorResponse>;

        throw (
          axiosError.response?.data?.message ||
          'Email hoặc mật khẩu không đúng!'
        );
      }

      throw (
        error instanceof Error
          ? error.message
          : 'Lỗi hệ thống!'
      );
    }
  },

  // ===============================
// FORGOT PASSWORD
// ===============================

forgotPassword: async (email: string) => {
  try {

    const response = await axios.post(
      `${API_URL}/forgot-password`,
      {
        email,
      }
    );

    return response.data;

  } catch (error: unknown) {

    if (axios.isAxiosError(error)) {

      const axiosError =
        error as AxiosError<ErrorResponse>;

      throw (
        axiosError.response?.data?.message ||
        'Gửi yêu cầu thất bại!'
      );
    }

    throw 'Lỗi hệ thống!';
  }
},

  // ===============================
  // LOGOUT
  // ===============================

  logout: () => {

    if (typeof window !== 'undefined') {

      // XÓA TOÀN BỘ STORAGE
      localStorage.removeItem('user');
      localStorage.removeItem('token');

      sessionStorage.removeItem('user');
      sessionStorage.removeItem('token');

      // XÓA HẾT CACHE LOGIN CŨ
      localStorage.clear();
      sessionStorage.clear();

      // CHUYỂN TRANG
      window.location.href = '/login';
    }
  },

  // ===============================
  // GET CURRENT USER
  // ===============================

  getCurrentUser: (): UserData | null => {

  if (typeof window === 'undefined') {
    return null;
  }

  try {

    const userStr =
      localStorage.getItem('user');

    // KHÔNG CÓ USER
    if (
      !userStr ||
      userStr === 'undefined' ||
      userStr === 'null'
    ) {
      return null;
    }

    const parsedUser =
      JSON.parse(userStr);

    // KHÔNG CÓ ROLE
    if (!parsedUser?.role) {
      return null;
    }

    return parsedUser;

  } catch {

    // JSON LỖI => XÓA LUÔN
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    return null;
  }
},

  // ===============================
  // CHECK LOGIN
  // ===============================

  isLoggedIn: (): boolean => {

    if (typeof window === 'undefined') {
      return false;
    }

    return !!localStorage.getItem('user');
  },

  // ===============================
  // CHECK ADMIN
  // ===============================

  isAdmin: (): boolean => {

    const user =
      authService.getCurrentUser();

    return (
      user?.role?.toLowerCase() ===
      'admin'
    );
  }

  
};