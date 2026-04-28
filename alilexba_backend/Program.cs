using alilexba_backend.Data;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using System.Text.Json;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models; 
var builder = WebApplication.CreateBuilder(args);

// --- 1. Cấu hình Database ---
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));

// --- 2. Cấu hình JWT Authentication ---
// Lấy Key từ appsettings.json, nếu không có sẽ dùng giá trị mặc định
var jwtKey = builder.Configuration["Jwt:Key"] ?? "Chuoi_Bi_Mat_Sieu_Dai_Va_An_Toan_De_Ky_Token_123456";
var keyBytes = Encoding.UTF8.GetBytes(jwtKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(keyBytes)
    };
});

// --- 3. Cấu hình CORS ---
    builder.Services.AddCors(options => {
        options.AddPolicy("AllowNextJS",
            policy => policy.WithOrigins("http://localhost:3000")
                            .AllowAnyMethod()
                            .AllowAnyHeader());
    });

// --- 4. Cấu hình Controllers & JSON ---
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    });

builder.Services.AddEndpointsApiExplorer();

// Cấu hình Swagger với ổ khóa bảo mật
builder.Services.AddSwaggerGen(c => {
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "AILEXBA API", Version = "v1" });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Nhập theo định dạng: Bearer {token}",
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            new string[] { }
        }
    });
});

var app = builder.Build();

// --- 5. Pipeline xử lý Request (Thứ tự cực kỳ quan trọng) ---
app.UseCors("AllowReact");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Bắt buộc: Authentication đứng trước Authorization
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();