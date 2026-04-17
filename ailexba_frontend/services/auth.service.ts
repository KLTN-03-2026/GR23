import axios, { AxiosError } from 'axios';

const API_URL = 'https://localhost:7083/api/Auth';

// --- ĐỊNH NGHĨA INTERFACES ---
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

export const authService = {
  // 1. ĐĂNG KÝ
  register: async (data: RegisterData) => {
    try {
      const response = await axios.post(`${API_URL}/register`, data);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || 'Đăng ký thất bại!';
    }
  },

  // 2. ĐĂNG NHẬP
  login: async (data: LoginData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, data);
    const resData = response.data;
    
    console.log("Dữ liệu thực tế từ BE:", resData);

    // 1. Kiểm tra xem dữ liệu là kiểu PHẲNG (như hình bạn gửi) hay kiểu BỌC (như cũ)
    // Ưu tiên lấy trực tiếp từ resData, nếu không có thì tìm trong resData.user
    const finalId = resData.userId || resData.id || resData.user?.id || resData.user?.userId;
    const finalFullName = resData.fullName || resData.user?.fullName;
    const finalRole = resData.role || resData.user?.role;
    const finalEmail = resData.email || resData.user?.email;

    if (finalId) {
      const userData: UserData = {
        userId: finalId,
        fullName: finalFullName || "Người dùng",
        role: finalRole || "Student",
        email: finalEmail || "",
        token: resData.token || resData.user?.token || ""
      };

      localStorage.setItem('user', JSON.stringify(userData));
      console.log(">>> Đã khớp lệnh! Đăng nhập thành công.");
      return userData;
    } else {
      console.error(">>> Không tìm thấy ID trong dữ liệu trả về:", resData);
      throw new Error("Lỗi cấu trúc dữ liệu từ máy chủ");
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data?.message || "Email hoặc mật khẩu không đúng!";
    }
    throw error instanceof Error ? error.message : "Lỗi hệ thống!";
  }
},

  // 3. ĐĂNG XUẤT
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  },

  // 4. LẤY USER HIỆN TẠI
  getCurrentUser: (): UserData | null => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch {
          return null;
        }
      }
    }
    return null;
  },

  // 5. KIỂM TRA TRẠNG THÁI
  isLoggedIn: (): boolean => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('user');
    }
    return false;
  },

  // 6. KIỂM TRA QUYỀN ADMIN
  isAdmin: (): boolean => {
    const user = authService.getCurrentUser();
    return user?.role === 'Admin';
  }
};