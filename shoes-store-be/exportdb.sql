-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: shoestore
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `brands`
--

DROP TABLE IF EXISTS brands;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE brands (
  id int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brands`
--

LOCK TABLES brands WRITE;
/*!40000 ALTER TABLE brands DISABLE KEYS */;
INSERT INTO brands VALUES (2,'Adidas'),(1,'Nike'),(3,'Puma');
/*!40000 ALTER TABLE brands ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS cart;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE cart (
  id int NOT NULL AUTO_INCREMENT,
  user_id int NOT NULL,
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY user_id (user_id),
  CONSTRAINT cart_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES cart WRITE;
/*!40000 ALTER TABLE cart DISABLE KEYS */;
INSERT INTO cart VALUES (1,1,'2025-04-26 05:01:50'),(2,2,'2025-04-26 05:01:50'),(3,3,'2025-04-26 05:01:50'),(5,5,'2025-04-25 22:21:19'),(10,8,'2025-05-08 04:05:52');
/*!40000 ALTER TABLE cart ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cartdetails`
--

DROP TABLE IF EXISTS cartdetails;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE cartdetails (
  id int NOT NULL AUTO_INCREMENT,
  cart_id int NOT NULL,
  product_detail_id int NOT NULL,
  quantity int NOT NULL DEFAULT '1',
  price decimal(10,2) NOT NULL,
  PRIMARY KEY (id),
  KEY cart_id (cart_id),
  KEY product_detail_id (product_detail_id),
  CONSTRAINT cartdetails_ibfk_1 FOREIGN KEY (cart_id) REFERENCES cart (id) ON DELETE CASCADE,
  CONSTRAINT cartdetails_ibfk_2 FOREIGN KEY (product_detail_id) REFERENCES productdetails (id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cartdetails`
--

LOCK TABLES cartdetails WRITE;
/*!40000 ALTER TABLE cartdetails DISABLE KEYS */;
INSERT INTO cartdetails VALUES (1,1,1,2,100.00),(2,1,2,2,100.00),(3,1,2,1,150.00),(4,2,3,3,80.00),(5,3,1,1,100.00),(7,5,8,1,1900000.00),(12,10,12,3,5500000.00);
/*!40000 ALTER TABLE cartdetails ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS categories;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE categories (
  id int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES categories WRITE;
/*!40000 ALTER TABLE categories DISABLE KEYS */;
INSERT INTO categories VALUES (2,'Giày chạy bộ'),(1,'Giày thể thao'),(3,'Giày thời trang');
/*!40000 ALTER TABLE categories ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orderdetails`
--

DROP TABLE IF EXISTS orderdetails;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE orderdetails (
  id int NOT NULL AUTO_INCREMENT,
  order_id int NOT NULL,
  product_detail_id int NOT NULL,
  quantity int NOT NULL,
  price decimal(10,2) NOT NULL,
  PRIMARY KEY (id),
  KEY order_id (order_id),
  KEY product_detail_id (product_detail_id),
  CONSTRAINT orderdetails_ibfk_1 FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
  CONSTRAINT orderdetails_ibfk_2 FOREIGN KEY (product_detail_id) REFERENCES productdetails (id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orderdetails`
--

LOCK TABLES orderdetails WRITE;
/*!40000 ALTER TABLE orderdetails DISABLE KEYS */;
INSERT INTO orderdetails VALUES (1,1,1,2,100.00),(2,1,2,1,150.00),(3,2,3,3,80.00),(4,3,1,1,100.00),(5,4,10,1,2700000.00),(6,5,13,3,2000000.00),(7,6,5,2,104000.00),(8,7,5,1,104000.00);
/*!40000 ALTER TABLE orderdetails ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS orders;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE orders (
  id int NOT NULL AUTO_INCREMENT,
  user_id int NOT NULL,
  shipping_address_id int DEFAULT NULL,
  shipping_fee decimal(10,2) DEFAULT NULL,
  shipping_time varchar(255) DEFAULT NULL,
  total_price decimal(10,2) NOT NULL,
  statuss enum('Chờ xử lý','Đã xác nhận','Hoàn thành','Đã hủy') DEFAULT 'Chờ xử lý',
  payment_method enum('VNPay','Thanh toán khi nhận hàng') NOT NULL DEFAULT 'Thanh toán khi nhận hàng',
  payment_status enum('Chờ thanh toán','Đã thanh toán','Thanh toán thất bại') DEFAULT 'Chờ thanh toán',
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY user_id (user_id),
  KEY shipping_address_id (shipping_address_id),
  CONSTRAINT orders_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT orders_ibfk_2 FOREIGN KEY (shipping_address_id) REFERENCES shippingaddresses (id) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES orders WRITE;
/*!40000 ALTER TABLE orders DISABLE KEYS */;
INSERT INTO orders VALUES (1,1,1,NULL,NULL,350.00,'Hoàn thành','Thanh toán khi nhận hàng','Chờ thanh toán','2025-04-26 05:01:50'),(2,2,2,NULL,NULL,240.00,'Đã hủy','VNPay','Đã thanh toán','2025-04-26 05:01:50'),(3,3,3,NULL,NULL,100.00,'Hoàn thành','VNPay','Chờ thanh toán','2025-04-26 05:01:50'),(4,7,6,44000.00,'Thứ Hai, 28 tháng 4, 2025',2700000.00,'Đã hủy','Thanh toán khi nhận hàng','Chờ thanh toán','2025-04-26 00:16:23'),(5,7,6,44000.00,'Thứ Hai, 28 tháng 4, 2025',6000000.00,'Hoàn thành','Thanh toán khi nhận hàng','Chờ thanh toán','2025-04-26 00:18:01'),(6,7,6,44000.00,'Thứ Hai, 28 tháng 4, 2025',208000.00,'Đã xác nhận','Thanh toán khi nhận hàng','Chờ thanh toán','2025-04-26 00:21:42'),(7,8,7,41001.00,'Thứ Ba, 13 tháng 5, 2025',104000.00,'Đã hủy','Thanh toán khi nhận hàng','Chờ thanh toán','2025-05-08 04:05:38');
/*!40000 ALTER TABLE orders ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ordertracking`
--

DROP TABLE IF EXISTS ordertracking;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE ordertracking (
  id int NOT NULL AUTO_INCREMENT,
  order_id int NOT NULL,
  `status` enum('Đang xử lý','Đang giao hàng','Đã giao hàng','Đã hủy') DEFAULT 'Đang xử lý',
  updated_at timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY order_id (order_id),
  CONSTRAINT ordertracking_ibfk_1 FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ordertracking`
--

LOCK TABLES ordertracking WRITE;
/*!40000 ALTER TABLE ordertracking DISABLE KEYS */;
INSERT INTO ordertracking VALUES (1,1,'Đang xử lý','2025-04-26 05:01:50'),(2,2,'Đã giao hàng','2025-04-26 05:01:50'),(3,3,'Đang giao hàng','2025-04-26 05:01:50');
/*!40000 ALTER TABLE ordertracking ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productdetails`
--

DROP TABLE IF EXISTS productdetails;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE productdetails (
  id int NOT NULL AUTO_INCREMENT,
  product_id int NOT NULL,
  size int NOT NULL,
  color varchar(255) NOT NULL,
  stock int NOT NULL DEFAULT '0',
  image_url varchar(255) DEFAULT NULL,
  `status` bit(1) DEFAULT b'1',
  PRIMARY KEY (id),
  KEY product_id (product_id),
  CONSTRAINT productdetails_ibfk_1 FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productdetails`
--

LOCK TABLES productdetails WRITE;
/*!40000 ALTER TABLE productdetails DISABLE KEYS */;
INSERT INTO productdetails VALUES (1,1,42,'đỏ',10,'https://ash.vn/cdn/shop/files/63c1be95a3ca00a3a5c84b2c0d81c344_300x.png?v=1742442948',_binary ''),(2,1,43,'trắng',10,'https://ash.vn/cdn/shop/files/63c1be95a3ca00a3a5c84b2c0d81c344_300x.png?v=1742442948',_binary ''),(3,1,44,'vàng',10,'https://ash.vn/cdn/shop/files/63c1be95a3ca00a3a5c84b2c0d81c344_300x.png?v=1742442948',_binary ''),(4,2,40,'hồng',15,'https://ash.vn/cdn/shop/files/cf38add24d319142afd32193dfbecb52_300x.png?v=1742442490',_binary ''),(5,3,41,'trắng',17,'https://ash.vn/cdn/shop/files/10a84b67fabffbb9bdaaef7dd2277f28_300x.png?v=1742376231',_binary ''),(6,4,42,'trắng',15,'https://static.nike.com/a/images/t_PDP_936_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/AIR+FORCE+1+%2707.png',_binary ''),(7,5,40,'xanh lá',12,'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/e01dea68cf93434bae5aac0900af99e8_9366/Giay_Stan_Smith_trang_FX5500_01_standard.jpg',_binary ''),(8,6,43,'xanh dương',8,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShKCJed-6l_A2AoEMXBNHvpdw3Mr0hJEbcDg&s',_binary ''),(9,7,41,'xám',10,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRq8qccW1FrGxxPLnI8HvEC8GYHSt9q-oqm8A&s',_binary ''),(10,8,42,'đen',8,'https://bizweb.dktcdn.net/thumb/1024x1024/100/347/092/products/8235903e870b4c4c91a7aef30119ab91-9366.jpg',_binary ''),(11,9,39,'hồng',14,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZmW1UY3cAqbLJgkdy2H_OpanUhGKYoq7P9g&s',_binary ''),(12,10,44,'cam neon',5,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRK7lmZMwfHlRVrhPybLKrnFlHtuXRo1lqbQg&s',_binary ''),(13,11,42,'trắng đen',8,'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/7ed0855435194229a525aad6009a0497_9366/Superstar_Shoes_White_EG4958_01_standard.jpg',_binary ''),(14,12,41,'xanh navy',13,'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSNv4amgZRRotrL9yj1w-iaOJztpe7JeH9r7OynaldaYDQDm58rNfhQq1q-aMaxfrU5_7wr-t97LkiVY25JkNbrRCerY5lvSGvDcEpDIQPGx866-M3jPfyUDQ',_binary ''),(15,13,43,'trắng kem',7,'https://static.nike.com/a/images/t_default/389b709e-5102-4e55-aa5d-07099b500831/BLAZER+MID+%2777+VNTG.png',_binary '');
/*!40000 ALTER TABLE productdetails ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS products;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE products (
  id int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  price decimal(10,2) DEFAULT NULL,
  category_id int DEFAULT NULL,
  `status` bit(1) DEFAULT b'1',
  brand_id int DEFAULT NULL,
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY `name` (`name`),
  KEY category_id (category_id),
  KEY brand_id (brand_id),
  CONSTRAINT products_ibfk_1 FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE SET NULL,
  CONSTRAINT products_ibfk_2 FOREIGN KEY (brand_id) REFERENCES brands (id) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES products WRITE;
/*!40000 ALTER TABLE products DISABLE KEYS */;
INSERT INTO products VALUES (1,'Air Jordan 1','Classic sneakers from Nike',10000.00,1,_binary '',1,'2025-04-26 05:01:50'),(2,'Ultraboost 22','High-performance running shoes',23000.00,1,_binary '',2,'2025-04-26 05:01:50'),(3,'Suede Classic','Timeless style from Puma',104000.00,1,_binary '',3,'2025-04-26 05:01:50'),(4,'Nike Air Force 1','Giày sneaker huyền thoại của Nike',2200000.00,1,_binary '',1,'2025-04-26 05:01:51'),(5,'Adidas Stan Smith','Giày da trắng cổ điển',2100000.00,1,_binary '',2,'2025-04-26 05:01:51'),(6,'Puma RS-X','Giày chạy bộ hiện đại từ Puma',1900000.00,1,_binary '',3,'2025-04-26 05:01:51'),(7,'Nike Dunk Low','Giày thời trang năng động',2500000.00,3,_binary '',1,'2025-04-26 05:01:51'),(8,'Adidas NMD R1','Giày thoải mái cho mọi hoạt động',2700000.00,1,_binary '',2,'2025-04-26 05:01:51'),(9,'Puma Cali Sport','Thiết kế nữ tính trẻ trung',1950000.00,3,_binary '',3,'2025-04-26 05:01:51'),(10,'Nike ZoomX Vaporfly','Hiệu suất cao cho chạy chuyên nghiệp',5500000.00,2,_binary '',1,'2025-04-26 05:01:51'),(11,'Adidas Superstar','Thiết kế vỏ sò nổi tiếng',2000000.00,1,_binary '',2,'2025-04-26 05:01:51'),(12,'Puma Smash V2','Giày tennis cơ bản',1600000.00,1,_binary '',3,'2025-04-26 05:01:51'),(13,'Nike Blazer Mid 77','Phong cách retro, chất da lộn',2400000.00,3,_binary '',1,'2025-04-26 05:01:51');
/*!40000 ALTER TABLE products ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS roles;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE roles (
  id int NOT NULL AUTO_INCREMENT,
  role_name enum('USER','ADMIN','STAFF') NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY role_name (role_name)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES roles WRITE;
/*!40000 ALTER TABLE roles DISABLE KEYS */;
INSERT INTO roles VALUES (3,'USER'),(1,'ADMIN'),(2,'STAFF');
/*!40000 ALTER TABLE roles ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shippingaddresses`
--

DROP TABLE IF EXISTS shippingaddresses;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE shippingaddresses (
  id int NOT NULL AUTO_INCREMENT,
  user_id int NOT NULL,
  recipient_name varchar(100) NOT NULL,
  phone varchar(15) NOT NULL,
  address text NOT NULL,
  city varchar(50) NOT NULL,
  province varchar(50) NOT NULL,
  country varchar(50) NOT NULL,
  is_default bit(1) DEFAULT b'1',
  province_id int DEFAULT NULL,
  district_id int DEFAULT NULL,
  ward_code varchar(225) DEFAULT NULL,
  PRIMARY KEY (id),
  KEY user_id (user_id),
  CONSTRAINT shippingaddresses_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shippingaddresses`
--

LOCK TABLES shippingaddresses WRITE;
/*!40000 ALTER TABLE shippingaddresses DISABLE KEYS */;
INSERT INTO shippingaddresses VALUES (1,1,'John Doe','123456789','123 Main St','City','Province','Country',_binary '',NULL,NULL,NULL),(2,2,'Jane Doe','987654321','456 Elm St','City','Province','Country',_binary '',NULL,NULL,NULL),(3,3,'Staff Member','555666777','789 Pine St','City','Province','Country',_binary '',NULL,NULL,NULL),(4,5,'ád','0838464462','ádasd','Lạng Sơn','Huyện Cao Lộc','Xã Công Sơn',_binary '\0',247,1904,'100706'),(5,5,'ádsa','0838364422','qưd','Hậu Giang','Thị xã Long Mỹ','Phường Trà Lồng',_binary '',250,3218,'640803'),(6,7,'Nguyễn Minh Thuận','0838644462','Hà Nội','Hà Nội','Huyện Thanh Trì','Xã Duyên Hà',_binary '',201,1710,'1A1104'),(7,8,'fffdsd','0838644462','12321c','Hưng Yên','Huyện Kim Động','Xã Đồng Thanh',_binary '\0',268,2194,'220712');
/*!40000 ALTER TABLE shippingaddresses ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS users;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE users (
  id int NOT NULL AUTO_INCREMENT,
  username varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  email varchar(100) DEFAULT NULL,
  phone varchar(15) DEFAULT NULL,
  address text,
  avatar_url varchar(255) DEFAULT NULL,
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  role_id int DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY username (username),
  UNIQUE KEY email (email),
  KEY role_id (role_id),
  CONSTRAINT users_ibfk_1 FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES users WRITE;
/*!40000 ALTER TABLE users DISABLE KEYS */;
INSERT INTO users VALUES (1,'admin1','hashed_password_1','admin1@example.com','0123456789','123 Main St, City',NULL,'2025-04-26 05:01:50',1),(2,'staff1','hashed_password_2','staff1@example.com','0987654321','456 Market St, City',NULL,'2025-04-26 05:01:50',2),(3,'user1','hashed_password_3','user1@example.com','0369852147','789 Oak St, City',NULL,'2025-04-26 05:01:50',3),(4,'admin','$2a$12$6rn.R5T38cxjmSHnuqOR6.PfPeVdtWCzPFQ5cc2BNBMZaeigIQGrK',NULL,NULL,NULL,NULL,'2025-04-25 22:01:56',1),(5,'thuannm04','$2a$12$24FY/TWZyw/8KtlbB5YY3uWbJP1N16AQI5HTmLWlX1gVY7zOilbBK','thuannguyen35753@gmail.com',NULL,NULL,NULL,'2025-04-25 22:02:04',3),(6,'anh','$2a$12$oJ2aSNJnpwW.aZ/d2KN48.ajUyN5fKD0fnjXfq5voiUCz8dC5AWE.','tananhle45@gmail.com',NULL,NULL,NULL,'2025-04-25 23:52:48',3),(7,'anhlt','$2a$12$gVfMK6anHo2sf9nlxhQZHeuXrUaJZGrxc60uiBrs1NnYsAwuAZJ2C','tananhle230@gmail.com',NULL,NULL,NULL,'2025-04-26 00:13:46',3),(8,'thuan','$2a$12$3wLeQ5uorrJDUXiQShzqSOTwYLLSnTulA0xKNjj1VhsvjJm8t9pR2','thuan@gmail.com',NULL,NULL,NULL,'2025-05-08 03:56:06',3);
/*!40000 ALTER TABLE users ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-08 18:12:41
