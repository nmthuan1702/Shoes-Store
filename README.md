# shoes-store
Hướng dẫn khởi chạy dự án
Bước 1: Khởi tạo cơ sở dữ liệu
Mở MySQL hoặc phần mềm quản lý cơ sở dữ liệu bạn đang dùng (vd: MySQL Workbench,...).
Quét file SQL nằm trong thư mục shoes-store-be với tên db.sql để tạo database và dữ liệu mẫu.
B2: Khởi chạy Back-end:
    Chỉ đúng folder shoes-store-be.
    Chạy với lệnh ./mvnw spring-boot:run.
B3: Khởi chạy Front-end:
    Chỉ đúng folder shoes-store-fe.
    Chạy lệnh yarn install để cài đặt các package cần thiết.
    Chạy lệnh yarn run dev để khỏi chạy web.