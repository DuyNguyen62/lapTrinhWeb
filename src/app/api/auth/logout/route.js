/**
 * API POST /api/auth/logout
 * Đăng xuất người dùng (xóa token)
 */
export async function POST(request) {
  try {
    // Trong thực tế, có thể thêm logic để blacklist token
    // hoặc xóa session từ database nếu cần
    
    return Response.json({
      success: true,
      message: 'Đăng xuất thành công'
    });

  } catch (error) {
    console.error('❌ Lỗi API POST /api/auth/logout:', error.message);
    
    return Response.json({
      success: false,
      message: 'Lỗi server khi xử lý đăng xuất',
      error: error.message
    }, { status: 500 });
  }
}
