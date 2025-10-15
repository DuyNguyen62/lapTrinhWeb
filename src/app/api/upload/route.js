import jwt from 'jsonwebtoken';
import { handleUpload } from '@/app/lib/upload';

/**
 * API POST /api/upload
 * Upload file ảnh hoặc video với xác thực JWT
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

    // Kiểm tra quyền upload (chỉ admin và user đã đăng nhập)
    if (!decoded.userId || (!decoded.role || (decoded.role !== 'admin' && decoded.role !== 'user'))) {
      return Response.json({
        success: false,
        message: 'Không có quyền upload file'
      }, { status: 403 });
    }

    // Xử lý upload file
    const file = await handleUpload(request, null);

    if (!file) {
      return Response.json({
        success: false,
        message: 'Không có file nào được upload'
      }, { status: 400 });
    }

    // Kiểm tra kích thước file dựa trên loại
    const isImage = file.mimetype.startsWith('image/');
    const isVideo = file.mimetype.startsWith('video/');
    
    if (isImage && file.size > 10 * 1024 * 1024) { // 10MB cho ảnh
      return Response.json({
        success: false,
        message: 'File ảnh không được vượt quá 10MB'
      }, { status: 400 });
    }

    if (isVideo && file.size > 500 * 1024 * 1024) { // 500MB cho video
      return Response.json({
        success: false,
        message: 'File video không được vượt quá 500MB'
      }, { status: 400 });
    }

    // Trả về URL của file đã upload
    const fileUrl = `/uploads/${file.filename}`;
    
    return Response.json({
      success: true,
      message: 'Upload file thành công',
      data: {
        filename: file.filename,
        originalName: file.originalname,
        url: fileUrl,
        size: file.size,
        mimetype: file.mimetype,
        type: isImage ? 'image' : 'video'
      }
    });

  } catch (error) {
    console.error('❌ Lỗi API POST /api/upload:', error.message);
    
    // Xử lý lỗi multer
    if (error.code === 'LIMIT_FILE_SIZE') {
      return Response.json({
        success: false,
        message: 'File quá lớn. Ảnh tối đa 10MB, video tối đa 500MB'
      }, { status: 400 });
    }

    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return Response.json({
        success: false,
        message: 'Chỉ được upload 1 file mỗi lần'
      }, { status: 400 });
    }

    return Response.json({
      success: false,
      message: 'Lỗi server khi upload file',
      error: error.message
    }, { status: 500 });
  }
}
