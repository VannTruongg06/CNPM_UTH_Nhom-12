Dưới đây là tài liệu **HƯỚNG** **DẪN** **KỸ** **THUẬT** **&** **BẢO**
**TRÌ** **HỆ** **THỐNG** **(DEVELOPER** **DOCUMENTATION)** phiên bản chi
tiết nhất, dựa trên toàn bộ source code bạn đã cung cấp.

Tài liệu này được thiết kế để bất kỳ Dev nào (Backend/Fullstack) tiếp
nhận dự án cũng có thể hiểu ngay luồng chạy, các điểm logic phức tạp và
cách vận hành hệ thống.

📘 **EMENU** **SYSTEM** **-** **TECHNICAL** **DOCUMENTATION**

**Phiên** **bản:** 2.0 (Refactored Architecture)

**Ngày** **cập** **nhật:** 28/01/2026

**Framework:** Django 6.0, Django Rest Framework (DRF)

**Database:** MySQL

**1.** **TỔNG** **QUAN** **KIẾN** **TRÚC** **(PROJECT**
**ARCHITECTURE)**

Hệ thống đã được tái cấu trúc (Refactor) từ kiến trúc Monolithic (một
file lớn) sang kiến trúc **Modular**, chia tách theo nghiệp vụ để dễ bảo
trì.

**Cấu** **trúc** **Thư** **mục** **&** **Modules**

> Plaintext

||
||
||
||
||
||
||
||
||
||
||

||
||
||
||
||
||
||
||

**2.** **CẤU** **HÌNH** **HỆ** **THỐNG** **(CONFIGURATION)** **A.**
**Environment** **Variables** **&** **Database**

Hệ thống sử dụng os.environ.get để tương thích linh hoạt giữa môi trường
Dev (Local) và Docker.

> ● **Engine:** django.db.backends.mysql ● **Default** **Config:**
>
> ○ Host: 127.0.0.1 (hoặc db trong Docker network) ○ Port: 3306
>
> ○ User/Pass: root / (rỗng)
>
> ● **Lưu** **ý:** Khi deploy Docker, cần map đúng biến môi trường
> DB_HOST, DB_NAME, DB_USER, DB_PASSWORD vào container.

**B.** **CORS** **&** **Security**

> ● **CORS:** Đã cấu hình CORS_ALLOW_ALL_ORIGINS = True (Dev mode) và
> danh sách CORS_ALLOWED_ORIGINS cụ thể bao gồm các domain Ngrok và
> Localhost (3000, 5173, 8000).
>
> ● **CSRF:** Đã thêm domain Ngrok vào CSRF_TRUSTED_ORIGINS để tránh lỗi
> 403 Forbidden khi test qua internet.

**C.** **Authentication** **(JWT)**

Sử dụng thư viện rest_framework_simplejwt.

> ● **Access** **Token:** Sống 1 ngày (timedelta(days=1)). ● **Refresh**
> **Token:** Sống 7 ngày (timedelta(days=7)). ● **Auth** **Header:**
> Bearer Token.

**3.** **CÁC** **MODULE** **NGHIỆP** **VỤ** **&** **LOGIC** **PHỨC**
**TẠP** **(CORE** **LOGIC)**

Đây là phần quan trọng nhất mà Dev bảo trì cần nắm rõ.

**MODULE** **1:** **ORDER** **&** **GEOFENCING** **(Đặt** **món** **&**
**Vị** **trí)**

**1.** **Logic** **Chặn** **Vị** **Trí** **(Geofencing)** **-**
**create_order**

> ● **Mục** **đích:** Chỉ cho phép khách đặt món khi đang ở gần quán
> (bán kính 150m).
>
> ● **Thuật** **toán:** Haversine Formula (tính khoảng cách đường chim
> bay giữa 2 tọa độ GPS). ● **Workflow:**
>
> 1\. Nhận lat, lon từ Body Request.
>
> 2\. So sánh với SHOP_LAT, SHOP_LON (đang hardcode: 10.824225,
> 106.719581). 3. Nếu khoảng cách \> MAX_DISTANCE (150m) -\> Trả về lỗi
> 403.
>
> ● ⚠ **TECHNICAL** **DEBT** **(Cần** **chú** **ý):**
>
> Hiện tại code đang có đoạn logic **Bypass** để test môi trường HTTP
> (không có HTTPS/GPS):

||
||
||
||
||
||
||

> *-\>* *Dev* *cần* *xóa* *hoặc* *comment* *đoạn* *này* *khi* *đưa*
> *lên* *Production.*

**2.** **Logic** **Cộng** **dồn** **món** **(Order** **Aggregation)**

> ● **Vấn** **đề:** Database lưu trữ dạng dòng (mỗi lần bấm đặt là 1 row
> OrderItem). Frontend cần hiển thị dạng gộp (Ví dụ: "Bia x3").
>
> ● **Giải** **pháp:** Xử lý tại tầng Serializer (OrderSerializer). ●
> **Hàm** **xử** **lý:** get_items(self, obj)
>
> ○ Sử dụng Dictionary grouped = {} với Key là product_id. ○ Nếu gặp món
> trùng ID: quantity += item.quantity.
>
> ○ Ghi chú (note) được nối chuỗi: Note cũ, Note mới.

**MODULE** **2:** **CORE** **&** **MENU** **MANAGEMENT**

**1.** **Xử** **lý** **Ảnh** **(Image** **Handling)**

> ● **Logic** **đường** **dẫn:** ItemSerializer trả về đường dẫn
> **tương** **đối** (/anh.jpg) thay vì tuyệt đối
> (http://localhost...).
>
> ○ *Lý* *do:* Để tránh lỗi Mixed Content (HTTP/HTTPS) khi chạy qua
> Ngrok hoặc Docker, và để Frontend tự linh động ghép domain.
>
> ● **Upload** **đa** **năng** **(FlexibleImageField):**
>
> ○ Hỗ trợ upload file Binary thông thường.
>
> ○ Hỗ trợ upload qua **URL** **ảnh** (tự download về server).
>
> ○ Hỗ trợ upload qua chuỗi **Base64**.

**2.** **Quản** **lý** **Danh** **mục** **(Categories)**

> ● **Validate:** Chặn tạo danh mục trùng tên (name\_\_iexact=name).
>
> ● **Permission:** Khách (AllowAny) chỉ được xem, Admin (IsAdminUser)
> mới được thêm/sửa/xóa.

**MODULE** **3:** **DASHBOARD** **&** **ANALYTICS**

**1.** **Thống** **kê** **Doanh** **thu**

> ● **Endpoint:** /api/dashboard/stats/
>
> ● **Filter:** Hỗ trợ query params ?range= (today, yesterday, month,
> year). ● **Logic:** Query vào bảng Revenue, lọc theo paid_at\_\_date.

**2.** **Best** **Sellers** **(Món** **bán** **chạy)**

> ● Logic: Group by item_id trong bảng OrderItem -\> Sum quantity -\>
> Sort DESC -\> Lấy Top 5.
>
> ● **Xử** **lý** **ảnh:** Convert ảnh sang **Base64** trực tiếp để trả
> về Frontend (giảm request tải ảnh lẻ tẻ, nhưng tăng size JSON
> response).

**4.** **API** **ENDPOINTS** **REFERENCE** **(CÁC** **API** **CHÍNH)**
**Nhóm** **Auth** **&** **Users**

||
||
||
||
||

**Nhóm** **Menu** **(Public** **&** **Admin)**

||
||
||

||
||
||
||
||

**Nhóm** **Order** **(Quan** **trọng)**

||
||
||
||
||
||
||

**Nhóm** **Dashboard**

||
||
||
||

**5.** **HƯỚNG** **DẪN** **DEPLOY** **&** **DOCKER**

Do hệ thống sử dụng đường dẫn ảnh tương đối và MySQL, việc cấu hình
Docker cần lưu ý:

> 1\. **Volume** **Mapping:**
>
> Bắt buộc phải map thư mục media trong docker-compose.yml:

||
||
||
||
||

> Nếu không, ảnh upload sẽ mất khi container restart. 2. **Allowed**
> **Hosts:**
>
> Trong settings.py đã set ALLOWED_HOSTS = \['\*'\]. Điều này an toàn
> trong mạng nội bộ/Docker nhưng khi deploy Production thực tế (VPS có
> IP Public), nên giới hạn lại domain cụ thể.
>
> 3\. **Static** **Files:**
>
> Hiện tại urls.py chỉ serve static/media khi DEBUG = True.
>
> ○ *Production:* Cần cấu hình Nginx hoặc WhiteNoise để serve file tĩnh,
> không dựa vào Django runserver.

**6.** **CÁC** **LỖI** **THƯỜNG** **GẶP** **(TROUBLESHOOTING)**

> 1\. **Lỗi:** **"Bạn** **đang** **ở** **quá** **xa** **quán"** **dù**
> **đang** **ngồi** **tại** **chỗ.**
>
> ○ *Nguyên* *nhân:* Trình duyệt chưa gửi tọa độ hoặc tọa độ GPS bị sai
> số lớn.
>
> ○ *Fix:* Kiểm tra log backend xem dist (khoảng cách) đang tính ra bao
> nhiêu mét. Điều chỉnh MAX_DISTANCE trong order_views.py lên cao hơn
> (ví dụ 200m) nếu GPS chập chờn.
>
> 2\. **Lỗi:** **Ảnh** **không** **hiển** **thị** **trên** **Frontend.**
>
> ○ *Nguyên* *nhân:* Frontend chưa ghép chuỗi Base URL vào đường dẫn ảnh
> tương đối. ○ *Fix:* Frontend cần code dạng \<img
> src={\${API_URL}\${item.img}} /\>.
>
> 3\. **Lỗi:** **CORS** **Error** **khi** **gọi** **API** **từ**
> **Frontend** **khác.**
>
> ○ *Fix:* Thêm domain/port của Frontend vào list CORS_ALLOWED_ORIGINS
> trong settings.py.
