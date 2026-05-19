CREATE DATABASE IF NOT EXISTS Bookify;
USE Bookify;

-- Table for Books (Supports your Shop and Detail pages)
CREATE TABLE IF NOT EXISTS books (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100),
    tag VARCHAR(50),
    language VARCHAR(50),
    inStock BOOLEAN DEFAULT TRUE,
    description TEXT,
    image VARCHAR(255)
);

-- Table for Users (Supports your Login_Register form)
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    address TEXT,
    phone_no VARCHAR(20)
);

-- Table for persistent cart items (linked to users and books)
CREATE TABLE IF NOT EXISTS cart (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_book (user_id, book_id),
    CONSTRAINT fk_cart_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_cart_book FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

-- Orders (same definition as Backend/Routes/order.js — ensures table exists if you only run this script)
CREATE TABLE IF NOT EXISTS orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_code VARCHAR(40) NOT NULL UNIQUE,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    delivery_fee DECIMAL(10, 2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_orders_book FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

INSERT INTO books (title, author, price, category, tag, language, description, image) 
VALUES ('The Great Gatsby', 'F. Scott Fitzgerald', 1500, 'Fiction', 'Bestseller', 'English', 'A classic novel...', 'https://url-to-image.jpg');
INSERT INTO books (title, author, price, category, tag, language, inStock, description, image) VALUES

('The Alchemist', 'Paulo Coelho', 299.00, 'Fiction', 'bestseller', 'English', TRUE, 'A philosophical book about following your dreams.', 'alchemist.jpg'),

('Wings of Fire', 'A.P.J Abdul Kalam', 199.00, 'Biography', 'inspirational', 'English', TRUE, 'Autobiography of Dr. A.P.J Abdul Kalam.', 'wingsoffire.jpg'),

('Atomic Habits', 'James Clear', 499.00, 'Self-help', 'productivity', 'English', TRUE, 'Guide to building good habits and breaking bad ones.', 'atomichabits.jpg'),

('Rich Dad Poor Dad', 'Robert Kiyosaki', 399.00, 'Finance', 'money', 'English', TRUE, 'Teaches financial literacy and investment mindset.', 'richdad.jpg'),

('Harry Potter and the Sorcerer''s Stone', 'J.K. Rowling', 599.00, 'Fantasy', 'magic', 'English', TRUE, 'First book of Harry Potter series.', 'hp1.jpg'),

('The Psychology of Money', 'Morgan Housel', 450.00, 'Finance', 'investment', 'English', TRUE, 'Lessons on wealth, greed, and happiness.', 'psychologyofmoney.jpg'),

('Think and Grow Rich', 'Napoleon Hill', 350.00, 'Self-help', 'success', 'English', TRUE, 'Classic book on personal development and success.', 'thinkgrowrich.jpg'),

('Ikigai', 'Héctor García', 299.00, 'Self-help', 'lifestyle', 'English', TRUE, 'Japanese secret to a long and happy life.', 'ikigai.jpg'),

('The Great Gatsby', 'F. Scott Fitzgerald', 250.00, 'Classic', 'literature', 'English', TRUE, 'A novel about the American dream.', 'gatsby.jpg'),

('Data Structures and Algorithms in Java', 'Robert Lafore', 799.00, 'Education', 'programming', 'English', TRUE, 'Covers DSA concepts in Java.', 'dsa.jpg'),

('Clean Code', 'Robert C. Martin', 899.00, 'Programming', 'coding', 'English', TRUE, 'Guide to writing clean and maintainable code.', 'cleancode.jpg'),

('The Diary of a Young Girl', 'Anne Frank', 299.00, 'History', 'war', 'English', TRUE, 'Diary of Anne Frank during World War II.', 'annefrank.jpg');
SELECT * FROM users;
SET SQL_SAFE_UPDATES = 0;
UPDATE books SET category = 'Self-Help' WHERE category = 'Self-help';
UPDATE books SET category = 'Sci-Fi' WHERE category = 'Programming'; -- If you want Clean Code in Sci-Fi
UPDATE books SET category = 'Fiction' WHERE category = 'Classic';