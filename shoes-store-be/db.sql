-- Tạo database
CREATE DATABASE ShoeStore;
USE ShoeStore;

-- Bảng vai trò
CREATE TABLE Roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_name ENUM('USER', 'ADMIN', 'STAFF') UNIQUE NOT NULL
);
-- Thêm dữ liệu vào bảng Roles
INSERT INTO Roles (role_name) VALUES ('ADMIN'), ('STAFF'), ('USER');

-- Bảng người dùng
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(15),
    address TEXT,
    avatar_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    role_id INT,
    FOREIGN KEY (role_id) REFERENCES Roles(id) ON DELETE SET NULL
);

-- Bảng địa chỉ nhận hàng
CREATE TABLE ShippingAddresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    recipient_name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(50) NOT NULL,
    province VARCHAR(50) NOT NULL,
    country VARCHAR(50) NOT NULL,
    is_default bit DEFAULT 1,
    province_id INT, 
    district_id INT,
    ward_code VARCHAR(225),
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- Bảng danh mục sản phẩm
CREATE TABLE Categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- Bảng thương hiệu
CREATE TABLE Brands (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- Bảng sản phẩm
CREATE TABLE Products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL unique,
    description TEXT,
    price  DECIMAL(10,2),
    category_id INT,
    status BIT default 1,
    brand_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES Categories(id) ON DELETE SET NULL,
    FOREIGN KEY (brand_id) REFERENCES Brands(id) ON DELETE SET NULL
);

-- Bảng chi tiết sản phẩm (quản lý size, màu, tồn kho)
CREATE TABLE ProductDetails (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    size INT NOT NULL,
    color VARCHAR(255) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    image_url VARCHAR(255),
    status BIT default 1,
    FOREIGN KEY (product_id) REFERENCES Products(id) ON DELETE CASCADE
);

-- Bảng giỏ hàng
CREATE TABLE Cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- Bảng chi tiết giỏ hàng
CREATE TABLE CartDetails (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT NOT NULL,
    product_detail_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (cart_id) REFERENCES Cart(id) ON DELETE CASCADE,
    FOREIGN KEY (product_detail_id) REFERENCES ProductDetails(id) ON DELETE CASCADE
);

-- Bảng đơn hàng
CREATE TABLE Orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    shipping_address_id INT,
    shipping_fee decimal(10,2),
    shipping_time varchar(255),
    total_price DECIMAL(10,2) NOT NULL,
    statuss ENUM('Chờ xử lý', 'Đã xác nhận', 'Đã hủy')  DEFAULT 'Chờ xử lý',
    payment_method ENUM('VNPay', 'Thanh toán khi nhận hàng') NOT NULL DEFAULT 'Thanh toán khi nhận hàng',
    payment_status ENUM('Chờ thanh toán', 'Đã thanh toán', 'Thanh toán thất bại') DEFAULT 'Chờ thanh toán',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (shipping_address_id) REFERENCES ShippingAddresses(id) ON DELETE SET NULL
);

-- Bảng chi tiết đơn hàng
CREATE TABLE OrderDetails (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_detail_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES Orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_detail_id) REFERENCES ProductDetails(id) ON DELETE CASCADE
);

-- Bảng theo dõi đơn hàng
CREATE TABLE OrderTracking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    status ENUM('Đang xử lý', 'Đang giao hàng', 'Đã giao hàng', 'Đã hủy') DEFAULT 'Đang xử lý',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES Orders(id) ON DELETE CASCADE
);
ALTER TABLE Orders MODIFY COLUMN statuss ENUM('Chờ xử lý', 'Đã xác nhận', 'Hoàn thành', 'Đã hủy') DEFAULT 'Chờ xử lý';
-------------------
INSERT INTO Users (username, password, email, phone, address, role_id) VALUES 
('admin1', 'hashed_password_1', 'admin1@example.com', '0123456789', '123 Main St, City', 1),
('staff1', 'hashed_password_2', 'staff1@example.com', '0987654321', '456 Market St, City', 2),
('user1', 'hashed_password_3', 'user1@example.com', '0369852147', '789 Oak St, City', 3);
-- Thêm dữ liệu vào bảng Categories
INSERT INTO Categories (name) VALUES 
('Giày thể thao'),
('Giày chạy bộ'),
('Giày thời trang');

-- Thêm dữ liệu vào bảng Brands
INSERT INTO Brands (name) VALUES 
('Nike'),
('Adidas'),	
('Puma');
-- Thêm dữ liệu vào bảng Products
INSERT INTO Products (name, description,price, category_id, brand_id) VALUES 
('Air Jordan 1', 'Classic sneakers from Nike',10000, 1, 1),  -- Air Jordan 1
('Ultraboost 22', 'High-performance running shoes',23000, 1, 2),  -- Ultraboost 22
('Suede Classic', 'Timeless style from Puma',104000, 1, 3);  -- Suede Classic
-- Thêm dữ liệu vào bảng ProductDetails
INSERT INTO ProductDetails (product_id, size, color, stock, image_url) VALUES 
(1, 42, "đỏ", 10, 'https://ash.vn/cdn/shop/files/63c1be95a3ca00a3a5c84b2c0d81c344_300x.png?v=1742442948'),  -- Air Jordan 1 (size 42, color Black)
(1, 43, "trắng", 10, 'https://ash.vn/cdn/shop/files/63c1be95a3ca00a3a5c84b2c0d81c344_300x.png?v=1742442948'),  -- Air Jordan 1 (size 42, color Black)
(1, 44, "vàng", 10, 'https://ash.vn/cdn/shop/files/63c1be95a3ca00a3a5c84b2c0d81c344_300x.png?v=1742442948'),  -- Air Jordan 1 (size 42, color Black)
(2, 40, "hồng", 15, 'https://ash.vn/cdn/shop/files/cf38add24d319142afd32193dfbecb52_300x.png?v=1742442490'),  -- Ultraboost 22 (size 40, color White)
(3, 41, "trắng", 20, 'https://ash.vn/cdn/shop/files/10a84b67fabffbb9bdaaef7dd2277f28_300x.png?v=1742376231');  -- Suede Classic (size 41, color Red)

-- Thêm dữ liệu vào bảng Cart
INSERT INTO Cart (user_id) VALUES 
(1),
(2),
(3);

-- Thêm dữ liệu vào bảng CartDetails
INSERT INTO CartDetails (cart_id, product_detail_id, quantity, price) VALUES 
(1, 1, 2, 100.00),  -- John Doe adds 2 Air Jordan 1 (size 42, color Black) to cart
(1, 2, 2, 100.00), 
(1, 2, 1, 150.00),  -- John Doe adds 1 Ultraboost 22 (size 40, color White) to cart
(2, 3, 3, 80.00),  -- Jane Doe adds 3 Suede Classic (size 41, color Red) to cart
(3, 1, 1, 100.00);  -- Staff Member adds 1 Air Jordan 1 (size 42, color Black) to cart
-- Thêm dữ liệu vào bảng ShippingAddresses
INSERT INTO ShippingAddresses (user_id, recipient_name, phone, address, city, province, country) VALUES 
(1, 'John Doe', '123456789', '123 Main St', 'City', 'Province', 'Country'),
(2, 'Jane Doe', '987654321', '456 Elm St', 'City', 'Province', 'Country'),
(3, 'Staff Member', '555666777', '789 Pine St', 'City', 'Province', 'Country');
-- Thêm dữ liệu vào bảng Orders
INSERT INTO Orders (user_id, shipping_address_id, total_price, payment_method, payment_status) VALUES 
(1, 1, 350.00, 'Thanh toán khi nhận hàng', 'Chờ thanh toán'),
(2, 2, 240.00, 'VNPay', 'Đã thanh toán'),
(3, 3, 100.00, 'VNPAy', 'Chờ thanh toán');

-- Thêm dữ liệu vào bảng OrderDetails
INSERT INTO OrderDetails (order_id, product_detail_id, quantity, price) VALUES 
(1, 1, 2, 100.00),  -- John Doe ordered 2 Air Jordan 1 (size 42, color Black)
(1, 2, 1, 150.00),  -- John Doe ordered 1 Ultraboost 22 (size 40, color White)
(2, 3, 3, 80.00),  -- Jane Doe ordered 3 Suede Classic (size 41, color Red)
(3, 1, 1, 100.00);  -- Staff Member ordered 1 Air Jordan 1 (size 42, color Black)

-- Thêm dữ liệu vào bảng OrderTracking
INSERT INTO OrderTracking (order_id, status) VALUES 
(1, 'Đang xử lý'),
(2, 'Đã giao hàng'),
(3, 'Đang giao hàng');


