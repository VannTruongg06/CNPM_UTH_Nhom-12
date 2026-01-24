HƯỚNG DẪN BÀN GIAO & CHẠY DỰ ÁN (DOCKER)

3 Bước sau:

Bước 1: Cài đặt môi trường
Yêu cầu máy người nhận phải có sẵn:

1.  Docker Desktop (Đã cài và đang bật).
2.  Git (Không bắt buộc nhưng nên có).

Bước 2: Khởi chạy hệ thống

1.  Giải nén thư mục dự án.
2.  Mở Terminal (PowerShell hoặc CMD) tại thư mục đó.
3.  Chạy lệnh duy nhất sau để dựng toàn bộ Server, Database và Web:

docker-compose up --build -d
(Đợi khoảng 3-5 phút cho lần đầu tiên để nó tải và cài đặt mọi thứ).

Bước 3: Nạp dữ liệu (Chỉ làm 1 lần đầu tiên)
Vì là máy mới nên Database sẽ trống trơn. Bảo họ chạy lần lượt 3 lệnh này trong Terminal để nạp Menu và tạo Admin:

1.  Tạo bảng & Bàn ăn:
    1 docker-compose exec backend python manage.py migrate
    2 docker-compose exec backend python create_tables.py
2.  Nạp thực đơn món ăn:
    1 docker-compose exec backend python import_menu.py
3.  Tạo tài khoản Quản lý (Admin):

1 docker-compose exec backend python manage.py createsuperuser
(Nhập Username/Password tùy ý).

---

CÁCH SỬ DỤNG
Sau khi xong Bước 3, họ có thể truy cập ngay:

- Trang Khách: http://localhost.
- Trang Login (Admin): http://localhost/login. -> đăng nhập tài khoản admin đã tạo
- Trang Staff: sau khi tạo tài khoản Staff trong Admin -> về trang login http://localhost/login đăng nhập tài khoản staff đã tạo
