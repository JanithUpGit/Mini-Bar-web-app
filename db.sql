-- PostgreSQL Version of the MySQL Dump

-- Create ENUM types first, as they must exist before being used in tables.
CREATE TYPE user_status_enum AS ENUM ('ACTIVE', 'BLOCKED');
CREATE TYPE user_role_enum AS ENUM ('ADMIN', 'USER');
CREATE TYPE order_status_enum AS ENUM ('PENDING', 'SHIPPED', 'COMPLETED', 'CANCELLED');

--
-- Table structure for table `Categories`
--
DROP TABLE IF EXISTS "Categories" CASCADE;
CREATE TABLE "Categories" (
    "category_id" SERIAL PRIMARY KEY,
    "category_name" varchar(255) NOT NULL UNIQUE,
    "image_url" varchar(255) DEFAULT NULL
);

--
-- Dumping data for table `Categories`
--
INSERT INTO "Categories" ("category_id", "category_name", "image_url") VALUES
(1, 'Arrack & Local Spirits', '/category/1.png'),
(2, 'Beer & Cider', '/category/2.png'),
(3, 'Whiskey', '/category/3.png'),
(4, 'Wine', '/category/4.png'),
(5, 'Vodka & Gin', '/category/5.png'),
(6, 'Rum & Tequila', '/category/6.png'),
(7, 'Cocktails & Mixers', '/category/7.png'),
(8, 'Sangria & Non-alcoholic Drinks', '/category/8.png');

--
-- Table structure for table `Order_Items`
--
DROP TABLE IF EXISTS "Order_Items" CASCADE;
CREATE TABLE "Order_Items" (
    "order_item_id" SERIAL PRIMARY KEY,
    "order_id" int DEFAULT NULL,
    "product_id" int DEFAULT NULL,
    "quantity" int NOT NULL,
    "unit_price" decimal(10,2) NOT NULL
);

--
-- Dumping data for table `Order_Items`
--
INSERT INTO "Order_Items" ("order_item_id", "order_id", "product_id", "quantity", "unit_price") VALUES
(1, 1, 1, 2, 850.00),
(2, 1, 3, 1, 450.00),
(3, 2, 5, 1, 1500.00),
(4, 2, 9, 2, 400.00),
(5, 3, 2, 1, 950.00),
(6, 4, 4, 2, 350.00),
(7, 4, 7, 2, 150.00),
(8, 5, 4, 3, 350.00),
(9, 5, 3, 1, 450.00),
(10, 6, 3, 1, 450.00),
(11, 6, 4, 3, 350.00),
(12, 6, 5, 3, 1500.00),
(13, 6, 6, 4, 1600.00),
(14, 6, 9, 1, 400.00),
(15, 7, 1, 1, 1850.00),
(16, 7, 2, 2, 950.00),
(17, 7, 3, 2, 450.00),
(18, 7, 4, 4, 350.00),
(19, 7, 5, 4, 1500.00),
(20, 8, 1, 3, 1850.00),
(21, 8, 2, 1, 950.00),
(22, 8, 3, 2, 450.00),
(23, 8, 4, 2, 350.00),
(24, 8, 5, 2, 1500.00),
(25, 8, 6, 2, 1600.00),
(26, 8, 7, 3, 150.00),
(27, 8, 8, 2, 150.00),
(28, 8, 9, 4, 400.00),
(29, 8, 10, 3, 750.00),
(30, 8, 11, 3, 150.00);


--
-- Table structure for table `Orders`
--
DROP TABLE IF EXISTS "Orders" CASCADE;
CREATE TABLE "Orders" (
    "order_id" SERIAL PRIMARY KEY,
    "user_id" int DEFAULT NULL,
    "order_datetime" timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    "status" order_status_enum NOT NULL,
    "total_amount" decimal(10,2) NOT NULL,
    "delivery_address" text NOT NULL,
    "created_at" timestamp NULL DEFAULT CURRENT_TIMESTAMP
);

--
-- Dumping data for table `Orders`
--
INSERT INTO "Orders" ("order_id", "user_id", "order_datetime", "status", "total_amount", "delivery_address", "created_at") VALUES
(1, 5, '2025-08-28 17:56:01', 'SHIPPED', 1700.00, '123 Main Street, Colombo', '2025-08-28 17:56:01'),
(2, 5, '2025-08-28 17:56:01', 'COMPLETED', 2300.00, '456 Galle Road, Galle', '2025-08-28 17:56:01'),
(3, 5, '2025-08-28 17:56:01', 'SHIPPED', 950.00, '123 Main Street, Colombo', '2025-08-28 17:56:01'),
(4, 5, '2025-08-28 17:56:01', 'COMPLETED', 1200.00, '789 Kandy Road, Kandy', '2025-08-28 17:56:01'),
(5, 5, '2025-08-29 19:41:43', 'SHIPPED', 1500.00, 'sarasavi uyana', '2025-08-29 19:41:43'),
(6, 5, '2025-08-29 19:43:30', 'CANCELLED', 12800.00, 'horopathana', '2025-08-29 19:43:30'),
(7, 5, '2025-08-30 07:24:32', 'PENDING', 12050.00, 'jkol j j  kl ', '2025-08-30 07:24:32'),
(8, 5, '2025-08-30 07:29:06', 'PENDING', 19350.00, 'horopathana', '2025-08-30 07:29:06');


--
-- Table structure for table `Products`
--
DROP TABLE IF EXISTS "Products" CASCADE;
CREATE TABLE "Products" (
    "product_id" SERIAL PRIMARY KEY,
    "product_name" varchar(255) NOT NULL,
    "price" decimal(10,2) NOT NULL,
    "description" text,
    "stock_quantity" int NOT NULL,
    "category_id" int DEFAULT NULL,
    "is_available" boolean DEFAULT true,
    "image_url" varchar(255) DEFAULT NULL
);

--
-- Dumping data for table `Products`
--
INSERT INTO "Products" ("product_id", "product_name", "price", "description", "stock_quantity", "category_id", "is_available", "image_url") VALUES
(1, 'Mojito2', 1850.00, 'Classic Cuban cocktail with rum, mint, and lime', 47, 1, true, '/products/1.png'),
(2, 'Whiskey Sour', 950.00, 'Whiskey, lemon juice, and sugar', 40, 1, true, '/products/2.png'),
(3, 'Heineken Beer', 450.00, 'Refreshing Dutch lager', 204, 2, true, '/products/3.png'),
(4, 'Lion Lager', 350.00, 'Popular Sri Lankan beer', 288, 2, true, '/products/4.png'),
(5, 'Red Wine', 1500.00, 'Smooth dry red wine', 61, 3, true, '/products/5.png'),
(6, 'White Wine', 1600.00, 'Crisp chilled white wine', 54, 3, true, '/products/6.png'),
(7, 'Coca Cola', 150.00, 'Classic soft drink', 497, 4, true, '/products/7.png'),
(8, 'Sprite', 150.00, 'Refreshing lemon-lime drink', 498, 4, true, '/products/8.png'),
(9, 'French Fries', 400.00, 'Crispy golden fries', 245, 5, true, '/products/9.png'),
(10, 'Chicken Wings', 750.00, 'Spicy grilled chicken wings', 147, 5, true, '/products/9.png'),
(11, 'Mineral Water', 150.00, 'A bottle of pure mineral water.', 117, 5, true, 'https://example.com/images/mineral-water.jpg');

--
-- Table structure for table `Users`
--
DROP TABLE IF EXISTS "Users" CASCADE;
CREATE TABLE "Users" (
    "user_id" SERIAL PRIMARY KEY,
    "user_name" varchar(255) NOT NULL,
    "email" varchar(255) NOT NULL UNIQUE,
    "password_hash" varchar(255) NOT NULL,
    "user_status" user_status_enum NOT NULL,
    "user_role" user_role_enum NOT NULL,
    "created_at" timestamp NULL DEFAULT CURRENT_TIMESTAMP
);

--
-- Dumping data for table `Users`
--
INSERT INTO "Users" ("user_id", "user_name", "email", "password_hash", "user_status", "user_role", "created_at") VALUES
(1, 'Admin User', 'admin@bar.com', 'hashed_password_1', 'ACTIVE', 'ADMIN', '2025-08-28 17:56:01'),
(3, 'Jane Smith', 'jane@example.com', 'hashed_password_3', 'ACTIVE', 'ADMIN', '2025-08-28 17:56:01'),
(4, 'Michael Lee', 'mike@example.com', 'hashed_password_4', 'BLOCKED', 'USER', '2025-08-28 17:56:01'),
(5, 'temp', 'temp@gmail.com', '$2b$10$3kLw4tvE5BoYUuAXNFDhpeUSLgahKCe.lCts4shZnW.QI4saZJ/KO', 'ACTIVE', 'ADMIN', '2025-08-28 18:34:55');

--
-- Adding Foreign Key Constraints
--
ALTER TABLE "Order_Items" ADD CONSTRAINT "order_items_ibfk_1" FOREIGN KEY ("order_id") REFERENCES "Orders" ("order_id");
ALTER TABLE "Order_Items" ADD CONSTRAINT "order_items_ibfk_2" FOREIGN KEY ("product_id") REFERENCES "Products" ("product_id");
ALTER TABLE "Orders" ADD CONSTRAINT "orders_ibfk_1" FOREIGN KEY ("user_id") REFERENCES "Users" ("user_id");
ALTER TABLE "Products" ADD CONSTRAINT "products_ibfk_1" FOREIGN KEY ("category_id") REFERENCES "Categories" ("category_id");