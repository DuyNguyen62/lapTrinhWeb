import { executeQuery } from '@/app/lib/db';

/**
 * API GET /api/posts/search
 * Tìm kiếm bài viết theo tiêu đề và ngày đăng
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const date = searchParams.get('date');
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;

    // Xây dựng điều kiện WHERE
    let whereConditions = [];
    let params = {};

    // Tìm kiếm theo tiêu đề
    if (query && query.trim()) {
      whereConditions.push('Title LIKE @query');
      params.query = `%${query.trim()}%`;
    }

    // Tìm kiếm theo ngày
    if (date && date.trim()) {
      whereConditions.push('CAST(CreatedAt AS DATE) = @date');
      params.date = date.trim();
    }

    // Tìm kiếm theo danh mục
    if (category && category.trim()) {
      whereConditions.push('Category = @category');
      params.category = category.trim();
    }

    // Xây dựng câu WHERE
    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}`
      : '';

    // Truy vấn để đếm tổng số kết quả
    const countQuery = `
      SELECT COUNT(*) as total
      FROM Posts 
      ${whereClause}
    `;

    const countResult = await executeQuery(countQuery, params);
    const total = countResult.recordset[0].total;

    // Tính toán phân trang
    const offset = (page - 1) * limit;
    const totalPages = Math.ceil(total / limit);

    // Truy vấn chính để lấy dữ liệu
    const mainQuery = `
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
      ${whereClause}
      ORDER BY CreatedAt DESC
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `;

    params.offset = offset;
    params.limit = limit;

    const result = await executeQuery(mainQuery, params);

    // Trả về kết quả
    return Response.json({
      success: true,
      message: 'Tìm kiếm thành công',
      data: {
        posts: result.recordset,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        },
        searchParams: {
          query: query || '',
          date: date || '',
          category: category || ''
        }
      }
    });

  } catch (error) {
    console.error('❌ Lỗi API GET /api/posts/search:', error.message);
    
    return Response.json({
      success: false,
      message: 'Lỗi server khi tìm kiếm bài viết',
      error: error.message
    }, { status: 500 });
  }
}
