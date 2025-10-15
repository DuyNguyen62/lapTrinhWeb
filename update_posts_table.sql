-- Script SQL để cập nhật bảng Posts với các trường mới
-- Chạy script này trong SQL Server Management Studio hoặc Azure Data Studio

USE BlogDB;
GO

-- Kiểm tra và thêm các cột mới vào bảng Posts
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Posts') AND name = 'ThumbnailUrl')
BEGIN
    ALTER TABLE Posts ADD ThumbnailUrl NVARCHAR(500);
    PRINT '✅ Đã thêm cột ThumbnailUrl';
END
ELSE
BEGIN
    PRINT '⚠️ Cột ThumbnailUrl đã tồn tại';
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Posts') AND name = 'VideoUrl')
BEGIN
    ALTER TABLE Posts ADD VideoUrl NVARCHAR(500);
    PRINT '✅ Đã thêm cột VideoUrl';
END
ELSE
BEGIN
    PRINT '⚠️ Cột VideoUrl đã tồn tại';
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Posts') AND name = 'AuthorId')
BEGIN
    ALTER TABLE Posts ADD AuthorId INT;
    PRINT '✅ Đã thêm cột AuthorId';
END
ELSE
BEGIN
    PRINT '⚠️ Cột AuthorId đã tồn tại';
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Posts') AND name = 'AuthorName')
BEGIN
    ALTER TABLE Posts ADD AuthorName NVARCHAR(100);
    PRINT '✅ Đã thêm cột AuthorName';
END
ELSE
BEGIN
    PRINT '⚠️ Cột AuthorName đã tồn tại';
END
GO

-- Cập nhật dữ liệu mẫu với các trường mới
UPDATE Posts 
SET 
    ThumbnailUrl = CASE 
        WHEN Id = 1 THEN '/uploads/sample-thumbnail-1.jpg'
        WHEN Id = 2 THEN '/uploads/sample-thumbnail-2.jpg'
        WHEN Id = 3 THEN '/uploads/sample-thumbnail-3.jpg'
        ELSE ThumbnailUrl
    END,
    AuthorId = CASE 
        WHEN Id = 1 THEN 1
        WHEN Id = 2 THEN 1
        WHEN Id = 3 THEN 2
        ELSE AuthorId
    END,
    AuthorName = CASE 
        WHEN Id = 1 THEN 'admin'
        WHEN Id = 2 THEN 'admin'
        WHEN Id = 3 THEN 'user1'
        ELSE AuthorName
    END
WHERE Id IN (1, 2, 3);
GO

PRINT '✅ Đã cập nhật dữ liệu mẫu';
GO

-- Hiển thị cấu trúc bảng Posts sau khi cập nhật
SELECT 
    COLUMN_NAME as 'Tên cột',
    DATA_TYPE as 'Kiểu dữ liệu',
    CHARACTER_MAXIMUM_LENGTH as 'Độ dài tối đa',
    IS_NULLABLE as 'Cho phép NULL',
    COLUMN_DEFAULT as 'Giá trị mặc định'
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'Posts'
ORDER BY ORDINAL_POSITION;
GO
