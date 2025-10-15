import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { executeQuery } from '@/app/lib/db';

/**
 * API POST /api/auth/login
 * Xác thực đăng nhập cho cả admin và user thường
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

    // Kiểm tra JWT_SECRET
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('❌ Thiếu biến môi trường JWT_SECRET');
      return Response.json({
        success: false,
        message: 'Cấu hình server không hợp lệ'
      }, { status: 500 });
    }

    // Kiểm tra admin login trước
    const adminUser = process.env.ADMIN_USER;
    const adminPass = process.env.ADMIN_PASS;

    if (username === adminUser && password === adminPass) {
      // Tạo JWT token cho admin
      const token = jwt.sign(
        { 
          userId: 'admin', 
          username: username, 
          role: 'admin',
          type: 'admin'
        },
        jwtSecret,
        { expiresIn: '24h' }
      );

      return Response.json({
        success: true,
        message: 'Đăng nhập admin thành công',
        token: token,
        user: {
          username: username,
          role: 'admin',
          type: 'admin'
        }
      });
    }

    // Kiểm tra user thường trong database
    const getUserQuery = 'SELECT Id, Username, PasswordHash FROM Users WHERE Username = @username';
    const userResult = await executeQuery(getUserQuery, { username: username.trim() });

    if (userResult.recordset.length === 0) {
      return Response.json({
        success: false,
        message: 'Tên đăng nhập hoặc mật khẩu không đúng'
      }, { status: 401 });
    }

    const user = userResult.recordset[0];

    // So sánh password với hash
    const isPasswordValid = await bcrypt.compare(password, user.PasswordHash);

    if (!isPasswordValid) {
      return Response.json({
        success: false,
        message: 'Tên đăng nhập hoặc mật khẩu không đúng'
      }, { status: 401 });
    }

    // Tạo JWT token cho user thường
    const token = jwt.sign(
      { 
        userId: user.Id, 
        username: user.Username, 
        role: 'user',
        type: 'user'
      },
      jwtSecret,
      { expiresIn: '24h' }
    );

    return Response.json({
      success: true,
      message: 'Đăng nhập thành công',
      token: token,
      user: {
        id: user.Id,
        username: user.Username,
        role: 'user',
        type: 'user'
      }
    });

  } catch (error) {
    console.error('❌ Lỗi API POST /api/auth/login:', error.message);
    
    return Response.json({
      success: false,
      message: 'Lỗi server khi xử lý đăng nhập',
      error: error.message
    }, { status: 500 });
  }
}
