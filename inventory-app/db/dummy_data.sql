INSERT INTO categories (name, description) VALUES
('Electronics','電化製品'), ('Books','書籍'), ('Kitchen','キッチン用品');

INSERT INTO items (name, description, quantity, price, category_id) VALUES
('Laptop', 'Work laptop', 3, 1299.99, 1),
('Node.js Handbook', 'Nice book', 10, 29.99, 2),
('Cutting Board', 'Wooden', 5, 12.50, 3);
