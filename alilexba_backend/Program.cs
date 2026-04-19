using alilexba_backend.Data;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using System.Text.Json; 

var builder = WebApplication.CreateBuilder(args);

// --- 1. Cấu hình Database ---
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));

// --- 2. Cấu hình CORS (Phải khớp với cổng của Next.js) ---
builder.Services.AddCors(options => {
    options.AddPolicy("AllowReact", policy =>
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials());
});

// --- 3. Cấu hình Controllers & JSON (Sửa lỗi "vênh" dữ liệu FE-BE) ---
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Chặn vòng lặp vô tận khi load dữ liệu quan hệ (Lazy Loading)
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;

        // [QUAN TRỌNG]: Đổi null thành CamelCase để FE (Next.js) đọc được res.data.user
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// --- 4. Pipeline xử lý Request (Thứ tự cực kỳ quan trọng) ---

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Chuyển hướng HTTPS (Có thể comment dòng này nếu test localhost bị lỗi chứng chỉ)
app.UseHttpsRedirection();

// Kích hoạt CORS trước khi Map Controllers
app.UseCors("AllowReact");

// Thứ tự Authentication -> Authorization là bắt buộc
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();