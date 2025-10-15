-- Script SQL để tạo bảng Posts cho Blog Website
-- Chạy script này trong SQL Server Management Studio hoặc Azure Data Studio

USE BlogDB;
GO

-- Tạo bảng Posts nếu chưa tồn tại
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Posts' AND xtype='U')
BEGIN
    CREATE TABLE Posts (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Title NVARCHAR(255) NOT NULL,
        Content NVARCHAR(MAX) NOT NULL,
        Category NVARCHAR(100),
        Thumbnail NVARCHAR(255),
        CreatedAt DATETIME DEFAULT GETDATE()
    );
    
    PRINT '✅ Bảng Posts đã được tạo thành công';
END
ELSE
BEGIN
    PRINT '⚠️ Bảng Posts đã tồn tại';
END
GO

-- Thêm một số dữ liệu mẫu để test
INSERT INTO Posts (Title, Content, Category, Thumbnail)
VALUES 
    ('Chào mừng đến với Blog Website', 'Đây là bài viết đầu tiên trên blog của chúng tôi. Chúng tôi sẽ chia sẻ những kiến thức hữu ích về lập trình web.', 'Giới thiệu', 'https://example.com/thumbnail1.jpg'),
    ('Hướng dẫn Next.js 14', 'Next.js 14 mang đến nhiều tính năng mới và cải tiến hiệu suất đáng kể. Trong bài viết này, chúng ta sẽ tìm hiểu về App Router và các tính năng mới.', 'Lập trình', 'https://example.com/thumbnail2.jpg'),
    ('SQL Server Best Practices', 'Một số thực hành tốt nhất khi làm việc với SQL Server để đảm bảo hiệu suất và bảo mật.', 'Database', 'https://example.com/thumbnail3.jpg');
GO

PRINT '✅ Đã thêm dữ liệu mẫu vào bảng Posts';
GO
