import axios, { AxiosError } from 'axios';

const API_URL = 'https://localhost:7083/api/Auth';

// --- ĐỊNH NGHĨA INTERFACES (Để hết lỗi ESLint any) ---
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
  userId: number;   // Phải là userId để khớp với Backend
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

  // 2. ĐĂNG NHẬP (Phần Quốc đang cần nhất)
 login: async (data: LoginData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, data);
    
    // Soi đúng vào object "user" mà bạn vừa gửi
    const serverData = response.data; // Đây là cái JSON { message, user: { id, ... } }
    
    if (serverData && serverData.user) {
      const user = serverData.user;
      
      // CHUẨN HÓA DỮ LIỆU: Đổi 'id' thành 'userId' để khớp với interface UserData của FE
      const userDataForStorage = {
        userId: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        token: serverData.token // Nếu sau này có token thì lưu luôn
      };

      // Lưu vào LocalStorage
      localStorage.setItem('user', JSON.stringify(userDataForStorage));
      
      console.log(">>> Đã khớp lệnh! Đăng nhập thành công cho:", user.fullName);
      return userDataForStorage; 
    }
    
    throw new Error("Cấu trúc phản hồi từ Server không đúng!");
  } catch (error: unknown) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw axiosError.response?.data?.message || 'Email hoặc mật khẩu không đúng!';
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