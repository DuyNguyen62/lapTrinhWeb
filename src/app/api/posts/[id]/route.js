import { executeQuery } from '@/app/lib/db';

/**
 * API GET /api/posts/[id]
 * Lấy chi tiết bài viết theo ID
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return Response.json({
        success: false,
        message: 'ID bài viết không hợp lệ'
      }, { status: 400 });
    }

    // Truy vấn SQL để lấy chi tiết bài viết
    const query = `
      SELECT 
        Id,
        Title,
        Content,
        Category,
        ThumbnailUrl,
        VideoUrl,
        AuthorId,
        AuthorName,
        CreatedAt
      FROM Posts 
      WHERE Id = @id
    `;

    const result = await executeQuery(query, { id: parseInt(id) });

    if (result.recordset.length === 0) {
      return Response.json({
        success: false,
        message: 'Không tìm thấy bài viết'
      }, { status: 404 });
    }

    const post = result.recordset[0];

    // Trả về kết quả thành công
    return Response.json({
      success: true,
      message: 'Lấy chi tiết bài viết thành công',
      data: post
    });

  } catch (error) {
    console.error('❌ Lỗi API GET /api/posts/[id]:', error.message);
    
    return Response.json({
      success: false,
      message: 'Lỗi server khi lấy chi tiết bài viết',
      error: error.message
    }, { status: 500 });
  }
}
