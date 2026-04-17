using AILEXBA_Project.Data;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// 1. Cấu hình SQL Server
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));

// 2. Cấu hình CORS (Mở cửa cho Next.js)
builder.Services.AddCors(options => {
    options.AddPolicy("AllowReact", policy =>
        policy.WithOrigins("http://localhost:3000") // Cổng mặc định của Next.js
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials());
});

// 3. Cấu hình Controllers & Fix lỗi JSON 500
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Chặn vòng lặp vô tận khi load dữ liệu quan hệ
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        // Giữ nguyên tên thuộc tính như trong C# (PascalCase) hoặc camelCase tùy Quốc chọn
        options.JsonSerializerOptions.PropertyNamingPolicy = null;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Cấu hình Pipeline xử lý Request
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// THỨ TỰ NÀY LÀ BẮT BUỘC: CORS -> Auth -> Map
app.UseCors("AllowReact");

app.UseHttpsRedirection(); // Đảm bảo chuyển hướng HTTPS

app.UseAuthentication(); // [QUAN TRỌNG] Xác thực trước
app.UseAuthorization();  // [QUAN TRỌNG] Phân quyền sau

app.MapControllers();

app.Run();