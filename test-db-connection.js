const { Pool } = require('pg');
require('dotenv').config();

// Cấu hình kết nối Supabase
const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  ssl: { rejectUnauthorized: false }
});

async function testConnection() {
  try {
    console.log('🔄 Đang test kết nối PostgreSQL Supabase...');
    console.log(`📍 Host: ${process.env.POSTGRES_HOST}`);
    console.log(`📍 Port: ${process.env.POSTGRES_PORT}`);
    console.log(`📍 Database: ${process.env.POSTGRES_DB}`);
    console.log(`📍 User: ${process.env.POSTGRES_USER}`);
    
    // Test basic connection
    const client = await pool.connect();
    console.log('✅ Kết nối thành công!');
    
    // Test query
    const result = await client.query('SELECT NOW() as current_time, version() as pg_version');
    console.log('🕒 Current time:', result.rows[0].current_time);
    console.log('🗄️  PostgreSQL version:', result.rows[0].pg_version);
    
    // Test check tables exist
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log('📋 Tables in database:');
    if (tablesResult.rows.length === 0) {
      console.log('   ⚠️  Không có tables nào. Cần chạy init.sql trước!');
    } else {
      tablesResult.rows.forEach(row => {
        console.log(`   📄 ${row.table_name}`);
      });
    }
    
    client.release();
    
  } catch (error) {
    console.error('❌ Lỗi kết nối:', error.message);
    console.error('💡 Kiểm tra lại:');
    console.error('   - Thông tin kết nối trong .env');
    console.error('   - Network/firewall settings');
    console.error('   - Supabase project có đang hoạt động không');
  } finally {
    await pool.end();
  }
}

testConnection();