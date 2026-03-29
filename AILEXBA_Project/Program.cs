using AILEXBA_Project.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// --- 1. THÊM MỚI: Cấu hình kết nối SQL Server ---
// Sử dụng LocalDB có sẵn của Visual Studio, tạo database tên là AILEXBA_DB
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer("Server=(localdb)\\mssqllocaldb;Database=AILEXBA_DB;Trusted_Connection=True;MultipleActiveResultSets=true"));

// --- 2. THÊM MỚI: Cấu hình CORS ---
// Cho phép Frontend (ReactJS) ở cổng 5173 hoặc 3000 gọi API mà không bị chặn
builder.Services.AddCors(options => {
    options.AddPolicy("AllowReact", policy =>
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader());
});

// Các cấu hình mặc định của hệ thống
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Tạm ẩn HttpsRedirection để code localhost không bị lỗi chứng chỉ SSL
// app.UseHttpsRedirection(); 

// --- 3. THÊM MỚI: Kích hoạt CORS đã cấu hình ở trên ---
app.UseCors("AllowReact");

app.UseAuthorization();
app.MapControllers();
app.Run();