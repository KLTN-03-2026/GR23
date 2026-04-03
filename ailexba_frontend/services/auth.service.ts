import axios from 'axios';

const API_URL = 'https://localhost:7083/api/Auth';

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
}

export const authService = {
  register: async (data: RegisterData) => {
    try {
      const response = await axios.post(`${API_URL}/register`, data);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại!';
      }
      throw new Error('Đã xảy ra lỗi không xác định');
    }
  },

  login: async (data: LoginData) => {
    try {
      const response = await axios.post(`${API_URL}/login`, data);
      if (response.data.userId) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data?.message || 'Sai tên đăng nhập hoặc mật khẩu!';
      }
      throw new Error('Đã xảy ra lỗi không xác định');
    }
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
  },

  getCurrentUser: (): UserData | null => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) return JSON.parse(userStr);
    }
    return null;
  }
};