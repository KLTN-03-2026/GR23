# AILEXBA

## 1) Yêu cầu

- Cài đặt Docker Desktop
  - Windows: `https://docs.docker.com/desktop/setup/install/windows-install/`
  - Macbook: `https://docs.docker.com/desktop/setup/install/mac-install/`

## 2) Cấu hình nhanh

Lần đầu chạy dự án, tạo file `.env` (copy nội dung mẫu bên dưới).

Tạo file `.env` ở thư mục gốc (cùng cấp `docker-compose.yml`) với nội dung tối thiểu:

```env
MSSQL_SA_PASSWORD=YourStrong_Passw0rd!
DB_NAME=AilexbaDev
DOTNET_STARTUP_PROJECT=YourApi.csproj
```

Sau đó sửa 2 dòng quan trọng:

- `MSSQL_SA_PASSWORD`: mật khẩu SA đủ mạnh
- `DOTNET_STARTUP_PROJECT`: đường dẫn tới `.csproj` startup (tính từ `ailexba_backend`)

Ví dụ:

```env
DOTNET_STARTUP_PROJECT=Ailexba.csproj
```

## 3) Chạy dự án

Tại thư mục có `docker-compose.yml`:

```bash
docker compose up -d
```

Chạy Migration DB
```bash
docker exec -it ailexba_api dotnet ef database update
```

## 4) Mở link demo

- UI: `http://localhost:3000`
- API: `http://localhost:5080`
- DB Viewer: `http://localhost:3001`

## 5) Thêm migration / chạy update bằng docker exec

Thêm migration:

```bash
docker exec -it ailexba_api dotnet ef migrations add TenMigration
```

Update DB:

```bash
docker exec -it ailexba_api dotnet ef database update
```

## 6) Dừng dự án

```bash
docker compose down
```

Xoá luôn dữ liệu DB (cẩn thận vì dữ liệu trước đó sẽ bị mất toàn bộ):

```bash
docker compose down -v
```

