import bcrypt from 'bcrypt';
import { executeQuery } from '@/app/lib/db';

/**
 * API POST /api/auth/register
 * Đăng ký tài khoản người dùng mới
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Validate dữ liệu đầu vào
    if (!username || !password) {
      return Response.json({
        success: false,
        message: 'Tên đăng nhập và mật khẩu không được để trống'
      }, { status: 400 });
    }

    // Validate độ dài username và password
    if (username.length < 3 || username.length > 50) {
      return Response.json({
        success: false,
        message: 'Tên đăng nhập phải có từ 3 đến 50 ký tự'
      }, { status: 400 });
    }

    if (password.length < 6) {
      return Response.json({
        success: false,
        message: 'Mật khẩu phải có ít nhất 6 ký tự'
      }, { status: 400 });
    }

    // Kiểm tra username đã tồn tại chưa
    const checkUserQuery = 'SELECT Id FROM Users WHERE Username = @username';
    const existingUser = await executeQuery(checkUserQuery, { username: username.trim() });

    if (existingUser.recordset.length > 0) {
      return Response.json({
        success: false,
        message: 'Tên đăng nhập đã được sử dụng'
      }, { status: 409 });
    }

    // Hash password bằng bcrypt
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Thêm user mới vào database
    const insertUserQuery = `
      INSERT INTO Users (Username, PasswordHash, CreatedAt)
      VALUES (@username, @passwordHash, GETDATE())
    `;

    const result = await executeQuery(insertUserQuery, {
      username: username.trim(),
      passwordHash: passwordHash
    });

    if (result.rowsAffected[0] > 0) {
      return Response.json({
        success: true,
        message: 'Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.'
      }, { status: 201 });
    } else {
      return Response.json({
        success: false,
        message: 'Không thể tạo tài khoản mới'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Lỗi API POST /api/auth/register:', error.message);
    
    return Response.json({
      success: false,
      message: 'Lỗi server khi xử lý đăng ký',
      error: error.message
    }, { status: 500 });
  }
}
