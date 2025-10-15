-- Script SQL để tạo bảng Users cho hệ thống authentication
-- Chạy script này trong SQL Server Management Studio hoặc Azure Data Studio

USE BlogDB;
GO

-- Tạo bảng Users nếu chưa tồn tại
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Users' AND xtype='U')
BEGIN
    CREATE TABLE Users (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Username NVARCHAR(50) UNIQUE NOT NULL,
        PasswordHash NVARCHAR(255) NOT NULL,
        CreatedAt DATETIME DEFAULT GETDATE()
    );
    
    PRINT '✅ Bảng Users đã được tạo thành công';
END
ELSE
BEGIN
    PRINT '⚠️ Bảng Users đã tồn tại';
END
GO

-- Tạo index cho Username để tăng tốc độ tìm kiếm
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Users_Username')
BEGIN
    CREATE INDEX IX_Users_Username ON Users(Username);
    PRINT '✅ Index IX_Users_Username đã được tạo';
END
GO

-- Thêm một số user mẫu để test (password đã được hash bằng bcrypt)
-- Password: "123456" -> Hash: $2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
INSERT INTO Users (Username, PasswordHash)
VALUES 
    ('admin', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
    ('user1', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
    ('testuser', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');
GO

PRINT '✅ Đã thêm dữ liệu mẫu vào bảng Users';
PRINT '📝 Username: admin, user1, testuser';
PRINT '🔑 Password cho tất cả: 123456';
GO
