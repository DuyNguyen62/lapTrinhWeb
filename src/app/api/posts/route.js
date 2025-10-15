import { executeQuery } from '@/app/lib/db';

/**
 * API GET /api/posts
 * Lấy danh sách tất cả bài viết từ bảng Posts
 */
export async function GET() {
  try {
    // Truy vấn SQL để lấy tất cả bài viết, sắp xếp theo ngày tạo mới nhất
    const query = `
      SELECT 
        Id,
        Title,
        Content,
        Category,
        Thumbnail,
        CreatedAt
      FROM Posts 
      ORDER BY CreatedAt DESC
    `;

    // Thực thi query
    const result = await executeQuery(query);

    // Trả về kết quả thành công
    return Response.json({
      success: true,
      message: 'Lấy danh sách bài viết thành công',
      data: result.recordset,
      total: result.recordset.length
    });

  } catch (error) {
    console.error('❌ Lỗi API GET /api/posts:', error.message);
    
    // Trả về lỗi với thông báo tiếng Việt
    return Response.json({
      success: false,
      message: 'Không thể lấy danh sách bài viết',
      error: error.message
    }, { status: 500 });
  }
}
