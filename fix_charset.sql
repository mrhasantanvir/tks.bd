ALTER DATABASE tks_bd CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE products MODIFY name VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE products MODIFY short_description TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE products MODIFY detailed_description TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
