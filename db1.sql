-- Insert dummy Users
INSERT INTO Users (user_name, email, password_hash, user_status, user_role) VALUES
('Admin User', 'admin@bar.com', 'hashed_password_1', 'ACTIVE', 'ADMIN'),
('John Doe', 'john@example.com', 'hashed_password_2', 'ACTIVE', 'USER'),
('Jane Smith', 'jane@example.com', 'hashed_password_3', 'ACTIVE', 'USER'),
('Michael Lee', 'mike@example.com', 'hashed_password_4', 'BLOCKED', 'USER');

-- Insert dummy Categories
INSERT INTO Categories (category_name, image_url) VALUES
('Cocktails', 'images/cocktails.jpg'),
('Beers', 'images/beers.jpg'),
('Wines', 'images/wines.jpg'),
('Soft Drinks', 'images/softdrinks.jpg'),
('Snacks', 'images/snacks.jpg');


INSERT INTO Products (product_name, price, description, stock_quantity, category_id, is_available, image_url) VALUES
('Mojito', 850.00, 'Classic Cuban cocktail with rum, mint, and lime', 50, 1, TRUE, '../../assets/images/products/1.png'),
('Whiskey Sour', 950.00, 'Whiskey, lemon juice, and sugar', 40, 1, TRUE, '../../assets/images/products/2.png'),
('Heineken Beer', 450.00, 'Refreshing Dutch lager', 200, 2, TRUE, '../../assets/images/products/3.png'),
('Lion Lager', 350.00, 'Popular Sri Lankan beer', 300, 2, TRUE, '../../assets/images/products/4.png'),
('Red Wine', 1500.00, 'Smooth dry red wine', 70, 3, TRUE, '../../assets/images/products/5.png'),
('White Wine', 1600.00, 'Crisp chilled white wine', 60, 3, TRUE, '../../assets/images/products/6.png'),
('Coca Cola', 150.00, 'Classic soft drink', 500, 4, TRUE, '../../assets/images/products/7.png'),
('Sprite', 150.00, 'Refreshing lemon-lime drink', 500, 4, TRUE, '../../assets/images/products/8.png'),
('French Fries', 400.00, 'Crispy golden fries', 250, 5, TRUE, '../../assets/images/products/9.png'),
('Chicken Wings', 750.00, 'Spicy grilled chicken wings', 150, 5, TRUE, '../../assets/images/products/10.png');


-- Insert dummy Orders
INSERT INTO Orders (user_id, status, total_amount, delivery_address) VALUES
(2, 'PENDING', 1700.00, '123 Main Street, Colombo'),
(3, 'COMPLETED', 2300.00, '456 Galle Road, Galle'),
(2, 'CANCELLED', 950.00, '123 Main Street, Colombo'),
(3, 'SHIPPED', 1200.00, '789 Kandy Road, Kandy');

-- Insert dummy Order_Items
INSERT INTO Order_Items (order_id, product_id, quantity, unit_price) VALUES
(1, 1, 2, 850.00),   -- Mojito x2
(1, 3, 1, 450.00),   -- Heineken x1
(2, 5, 1, 1500.00),  -- Red Wine x1
(2, 9, 2, 400.00),   -- French Fries x2
(3, 2, 1, 950.00),   -- Whiskey Sour x1
(4, 4, 2, 350.00),   -- Lion Lager x2
(4, 7, 2, 150.00);   -- Coca Cola x2
