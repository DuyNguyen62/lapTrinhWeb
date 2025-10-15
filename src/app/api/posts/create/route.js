import jwt from 'jsonwebtoken';
import { executeQuery } from '@/app/lib/db';

/**
 * API POST /api/posts/create
 * Tạo bài viết mới trong bảng Posts với xác thực JWT
 */
export async function POST(request) {
  try {
    // Kiểm tra JWT token từ header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json({
        success: false,
        message: 'Token xác thực không hợp lệ'
      }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      return Response.json({
        success: false,
        message: 'Cấu hình server không hợp lệ'
      }, { status: 500 });
    }

    // Xác thực JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, jwtSecret);
    } catch (error) {
      return Response.json({
        success: false,
        message: 'Token đã hết hạn hoặc không hợp lệ'
      }, { status: 401 });
    }

    // Kiểm tra quyền tạo bài viết (chỉ admin và user đã đăng nhập)
    if (!decoded.userId || (!decoded.role || (decoded.role !== 'admin' && decoded.role !== 'user'))) {
      return Response.json({
        success: false,
        message: 'Không có quyền tạo bài viết'
      }, { status: 403 });
    }

    // Lấy dữ liệu từ request body
    const body = await request.json();
    const { 
      title, 
      content, 
      category, 
      thumbnailUrl, 
      videoUrl 
    } = body;

    // Validate dữ liệu đầu vào
    if (!title || !content) {
      return Response.json({
        success: false,
        message: 'Tiêu đề và nội dung bài viết không được để trống'
      }, { status: 400 });
    }

    if (title.length > 255) {
      return Response.json({
        success: false,
        message: 'Tiêu đề không được vượt quá 255 ký tự'
      }, { status: 400 });
    }

    // Truy vấn SQL để thêm bài viết mới
    const query = `
      INSERT INTO Posts (
        Title, 
        Content, 
        Category, 
        ThumbnailUrl, 
        VideoUrl, 
        AuthorId, 
        AuthorName, 
        CreatedAt
      )
      VALUES (
        @title, 
        @content, 
        @category, 
        @thumbnailUrl, 
        @videoUrl, 
        @authorId, 
        @authorName, 
        GETDATE()
      )
    `;

    // Tham số cho query
    const params = {
      title: title.trim(),
      content: content.trim(),
      category: category ? category.trim() : null,
      thumbnailUrl: thumbnailUrl ? thumbnailUrl.trim() : null,
      videoUrl: videoUrl ? videoUrl.trim() : null,
      authorId: decoded.userId === 'admin' ? null : decoded.userId,
      authorName: decoded.username
    };

    // Thực thi query
    const result = await executeQuery(query, params);

    if (result.rowsAffected[0] > 0) {
      return Response.json({
        success: true,
        message: 'Tạo bài viết mới thành công',
        data: {
          rowsAffected: result.rowsAffected[0],
          message: 'Bài viết đã được thêm vào cơ sở dữ liệu',
          author: decoded.username,
          role: decoded.role
        }
      }, { status: 201 });
    } else {
      return Response.json({
        success: false,
        message: 'Không thể tạo bài viết mới'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Lỗi API POST /api/posts/create:', error.message);
    
    return Response.json({
      success: false,
      message: 'Lỗi server khi tạo bài viết',
      error: error.message
    }, { status: 500 });
  }
}
