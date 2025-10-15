import sql from "mssql";

// Cache pool để tránh mở kết nối lại nhiều lần
let pool = null;

/**
 * Lấy cấu hình kết nối SQL Server từ biến môi trường
 * Hỗ trợ cả cấu hình mới (DB_*) và legacy (MSSQL_CONNECTION_STRING)
 * @returns {Object} Config object cho SQL Server
 */
function getDbConfig() {
  // Ưu tiên cấu hình mới (DB_*)
  if (process.env.DB_SERVER && process.env.DB_USER && process.env.DB_PASSWORD && process.env.DB_NAME) {
    return {
      server: process.env.DB_SERVER,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT || '1433'),
      options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true,
        requestTimeout: 30000,
        connectionTimeout: 30000,
        pool: {
          max: 10,
          min: 0,
          idleTimeoutMillis: 30000
        }
      }
    };
  }
  
  // Fallback về legacy connection string
  if (process.env.MSSQL_CONNECTION_STRING) {
    return process.env.MSSQL_CONNECTION_STRING;
  }
  
  throw new Error('Thiếu cấu hình kết nối SQL Server. Vui lòng kiểm tra file .env.local');
}

/**
 * Lấy kết nối SQL Server với cơ chế cache pool và auto-reconnect
 * @returns {Promise<sql.ConnectionPool>} Pool kết nối SQL Server
 */
export async function getConnection() {
  try {
    // Kiểm tra và tạo pool mới nếu chưa tồn tại
    if (!pool) {
      const config = getDbConfig();
      pool = await sql.connect(config);
      console.log("✅ Đã kết nối SQL Server");
    }

    // Kiểm tra pool có còn hoạt động không và tự động kết nối lại
    if (pool.connected === false) {
      const config = getDbConfig();
      pool = await sql.connect(config);
      console.log("✅ Đã kết nối lại SQL Server");
    }

    return pool;
  } catch (error) {
    console.error("❌ Lỗi kết nối SQL Server:", error.message);
    pool = null; // Reset pool khi có lỗi
    throw error;
  }
}

/**
 * Đóng kết nối pool
 */
export async function closeConnection() {
  try {
    if (pool) {
      await pool.close();
      pool = null;
      console.log("✅ Đã đóng kết nối SQL Server");
    }
  } catch (error) {
    console.error("❌ Lỗi khi đóng kết nối:", error.message);
  }
}

/**
 * Thực thi query SQL với xử lý lỗi
 * @param {string} query - Câu query SQL
 * @param {Object} params - Tham số cho query
 * @returns {Promise<sql.IResult<any>>} Kết quả query
 */
export async function executeQuery(query, params = {}) {
  const pool = await getConnection();
  try {
    const request = pool.request();
    
    // Thêm parameters nếu có
    Object.keys(params).forEach(key => {
      request.input(key, params[key]);
    });

    const result = await request.query(query);
    return result;
  } catch (error) {
    console.error("❌ Lỗi thực thi query:", error.message);
    throw error;
  }
}

/**
 * Kiểm tra kết nối database có hoạt động không
 * @returns {Promise<boolean>} True nếu kết nối thành công
 */
export async function testConnection() {
  try {
    const pool = await getConnection();
    const result = await pool.request().query('SELECT 1 as test');
    return result.recordset.length > 0;
  } catch (error) {
    console.error("❌ Test connection failed:", error.message);
    return false;
  }
}
