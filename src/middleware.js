import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

/**
 * Middleware để bảo vệ các route admin và API
 * Kiểm tra JWT token trong header Authorization
 */
export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Bảo vệ các route admin
  if (pathname.startsWith('/admin')) {
    return protectRoute(request, 'admin');
  }

  // Bảo vệ các API cần xác thực
  if (pathname.startsWith('/api/upload') || 
      pathname.startsWith('/api/posts/create')) {
    return protectRoute(request, 'api');
  }

  return NextResponse.next();
}

function protectRoute(request, type) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    if (type === 'admin') {
      return NextResponse.redirect(new URL('/login', request.url));
    } else {
      return NextResponse.json({
        success: false,
        message: 'Token xác thực không hợp lệ'
      }, { status: 401 });
    }
  }

  const token = authHeader.substring(7);
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    console.error('❌ Thiếu biến môi trường JWT_SECRET');
    if (type === 'admin') {
      return NextResponse.redirect(new URL('/login', request.url));
    } else {
      return NextResponse.json({
        success: false,
        message: 'Cấu hình server không hợp lệ'
      }, { status: 500 });
    }
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    
    // Kiểm tra quyền truy cập
    if (!decoded.userId || (!decoded.role || (decoded.role !== 'admin' && decoded.role !== 'user'))) {
      if (type === 'admin') {
        return NextResponse.redirect(new URL('/login', request.url));
      } else {
        return NextResponse.json({
          success: false,
          message: 'Không có quyền truy cập'
        }, { status: 403 });
      }
    }

    // Thêm thông tin user vào header để API có thể sử dụng
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', decoded.userId);
    requestHeaders.set('x-user-role', decoded.role);
    requestHeaders.set('x-user-name', decoded.username);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

  } catch (error) {
    console.error('❌ JWT verification failed:', error.message);
    
    if (type === 'admin') {
      return NextResponse.redirect(new URL('/login', request.url));
    } else {
      return NextResponse.json({
        success: false,
        message: 'Token đã hết hạn hoặc không hợp lệ'
      }, { status: 401 });
    }
  }
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/upload',
    '/api/posts/create'
  ]
};
