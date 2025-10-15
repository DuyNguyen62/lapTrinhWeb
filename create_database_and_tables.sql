-- Script tạo bảng Users cho Blog Website
-- Chạy script này trong SQL Server Management Studio hoặc Azure Data Studio

-- Kiểm tra và tạo database nếu chưa tồn tại
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'NextBlogDB')
BEGIN
    CREATE DATABASE NextBlogDB;
    PRINT 'Database NextBlogDB đã được tạo.';
END
ELSE
BEGIN
    PRINT 'Database NextBlogDB đã tồn tại.';
END;

-- Sử dụng database NextBlogDB
USE NextBlogDB;

-- Kiểm tra và tạo bảng Users nếu chưa tồn tại
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND type in (N'U'))
BEGIN
    CREATE TABLE Users (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Username NVARCHAR(50) UNIQUE NOT NULL,
        PasswordHash NVARCHAR(255) NOT NULL,
        Email NVARCHAR(100) NULL,
        Role NVARCHAR(20) DEFAULT 'user',
        CreatedAt DATETIME DEFAULT GETDATE(),
        UpdatedAt DATETIME DEFAULT GETDATE()
    );
    PRINT 'Bảng Users đã được tạo.';
END
ELSE
BEGIN
    PRINT 'Bảng Users đã tồn tại.';
END;

-- Kiểm tra và tạo bảng Posts nếu chưa tồn tại
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Posts]') AND type in (N'U'))
BEGIN
    CREATE TABLE Posts (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Title NVARCHAR(255) NOT NULL,
        Content NVARCHAR(MAX) NOT NULL,
        Category NVARCHAR(100) NULL,
        ThumbnailUrl NVARCHAR(500) NULL,
        VideoUrl NVARCHAR(500) NULL,
        AuthorId INT NULL,
        AuthorName NVARCHAR(100) NULL,
        CreatedAt DATETIME DEFAULT GETDATE(),
        UpdatedAt DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (AuthorId) REFERENCES Users(Id) ON DELETE SET NULL
    );
    PRINT 'Bảng Posts đã được tạo.';
END
ELSE
BEGIN
    PRINT 'Bảng Posts đã tồn tại.';
END;

-- Tạo index để tối ưu hiệu suất
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Users_Username')
BEGIN
    CREATE INDEX IX_Users_Username ON Users(Username);
    PRINT 'Index IX_Users_Username đã được tạo.';
END;

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Posts_CreatedAt')
BEGIN
    CREATE INDEX IX_Posts_CreatedAt ON Posts(CreatedAt DESC);
    PRINT 'Index IX_Posts_CreatedAt đã được tạo.';
END;

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Posts_AuthorId')
BEGIN
    CREATE INDEX IX_Posts_AuthorId ON Posts(AuthorId);
    PRINT 'Index IX_Posts_AuthorId đã được tạo.';
END;

-- Tạo user admin mẫu (password: 123456)
IF NOT EXISTS (SELECT * FROM Users WHERE Username = 'admin')
BEGIN
    INSERT INTO Users (Username, PasswordHash, Role, Email)
    VALUES ('admin', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'admin@blog.com');
    PRINT 'User admin đã được tạo với password: 123456';
END
ELSE
BEGIN
    PRINT 'User admin đã tồn tại.';
END;

-- Tạo user test mẫu (password: 123456)
IF NOT EXISTS (SELECT * FROM Users WHERE Username = 'user1')
BEGIN
    INSERT INTO Users (Username, PasswordHash, Role, Email)
    VALUES ('user1', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'user1@blog.com');
    PRINT 'User user1 đã được tạo với password: 123456';
END
ELSE
BEGIN
    PRINT 'User user1 đã tồn tại.';
END;

-- Tạo bài viết mẫu
IF NOT EXISTS (SELECT * FROM Posts WHERE Title = 'Chào mừng đến với Blog Website')
BEGIN
    INSERT INTO Posts (Title, Content, Category, AuthorId, AuthorName)
    VALUES (
        'Chào mừng đến với Blog Website',
        'Đây là bài viết đầu tiên trên Blog Website. Chúng tôi rất vui được chào đón bạn đến với nền tảng chia sẻ kiến thức và trải nghiệm này. Hãy khám phá các tính năng và tạo ra những nội dung thú vị!',
        'Giới thiệu',
        1,
        'admin'
    );
    PRINT 'Bài viết mẫu đã được tạo.';
END
ELSE
BEGIN
    PRINT 'Bài viết mẫu đã tồn tại.';
END;

PRINT 'Script khởi tạo database hoàn tất!';
PRINT 'Thông tin đăng nhập mẫu:';
PRINT '- Admin: admin / 123456';
PRINT '- User: user1 / 123456';
