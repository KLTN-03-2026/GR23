'use client';

import { useState } from 'react';
import axios from 'axios';

interface BulkUploadProps {
  subjectId: number;
  onRefresh: () => void;
}

export default function BulkUpload({ subjectId, onRefresh }: BulkUploadProps) {
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Kiểm tra định dạng file
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (fileExtension !== 'xlsx' && fileExtension !== 'xls') {
      alert("Vui lòng chỉ chọn file Excel (.xlsx hoặc .xls)");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      // Quốc nhớ kiểm tra đúng cổng (Port) của Backend nhé
      const response = await axios.post(
        `https://localhost:7083/api/Questions/upload-excel?subjectId=${subjectId}`, 
        formData, 
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      alert(response.data.message || "Nhập dữ liệu thành công! 🚀");
      onRefresh(); // Load lại danh sách câu hỏi
    } catch (err: unknown) {
      console.error(err);
      
      // Khởi tạo một thông báo lỗi mặc định
      let errorMsg = "Lỗi khi kết nối đến Server!";
      
      // Kiểm tra xem err có phải là lỗi do Axios bắn ra không
      if (axios.isAxiosError(err)) {
        // Lúc này TypeScript đã hiểu 'err' là một AxiosError, 
        // bạn có thể truy cập .response mà không cần dùng 'any'
        errorMsg = err.response?.data?.message || err.message;
      } else if (err instanceof Error) {
        // Nếu là lỗi JS thông thường
        errorMsg = err.message;
      }

      alert(`Thất bại: ${errorMsg}`);
    } finally {
      setLoading(false);
      e.target.value = ''; // Reset để có thể chọn lại file cùng tên
    }
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex gap-3 items-center">
        {/* Nút tải mẫu */}
        <a 
          href="/templates/Question_Template.xlsx" 
          download
          className="text-[10px] font-black text-slate-500 hover:text-blue-400 uppercase tracking-widest transition-colors"
        >
          Tải file mẫu (.xlsx)
        </a>

        {/* Nút Upload */}
        <label className={`
          flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer
          ${loading 
            ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/40 active:scale-95'}
        `}>
          {loading ? (
            <>
              <span className="animate-spin inline-block w-3 h-3 border-2 border-white/20 border-t-white rounded-full"></span>
              Đang xử lý...
            </>
          ) : (
            <>
              <span>📥</span> NHẬP TỪ EXCEL
            </>
          )}
          <input 
            type="file" 
            className="hidden" 
            accept=".xlsx, .xls" 
            onChange={handleFileChange} 
            disabled={loading} 
          />
        </label>
      </div>
    </div>
  );
}