const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  ssl: { rejectUnauthorized: false }
});

async function checkExistingData() {
  try {
    console.log('🔍 Kiểm tra dữ liệu hiện có trong database...\n');
    
    // Kiểm tra từng bảng
    const tables = ['manufacturers', 'dealers', 'users', 'vehicles', 'customers'];
    
    for (const table of tables) {
      const result = await pool.query(`SELECT COUNT(*) as count FROM ${table}`);
      const count = parseInt(result.rows[0].count);
      
      if (count > 0) {
        console.log(`⚠️  ${table}: ${count} records - CÓ THỂ XUNG ĐỘT`);
        
        // Hiển thị một vài record mẫu
        const sample = await pool.query(`SELECT * FROM ${table} LIMIT 3`);
        console.log(`   Dữ liệu mẫu:`, sample.rows.map(row => row.name || row.email || row.model || row.code).join(', '));
      } else {
        console.log(`✅ ${table}: ${count} records - AN TOÀN`);
      }
    }
    
    console.log('\n📋 Kiểm tra unique constraints có thể bị vi phạm:');
    
    // Kiểm tra các code/email có thể trùng
    const manufacturerCodes = await pool.query(`SELECT code FROM manufacturers WHERE code IN ('TESLA', 'BYD', 'NISSAN')`);
    if (manufacturerCodes.rows.length > 0) {
      console.log(`⚠️  Manufacturer codes đã tồn tại:`, manufacturerCodes.rows.map(r => r.code));
    }
    
    const dealerCodes = await pool.query(`SELECT code FROM dealers WHERE code IN ('EVD001', 'GAC001')`);
    if (dealerCodes.rows.length > 0) {
      console.log(`⚠️  Dealer codes đã tồn tại:`, dealerCodes.rows.map(r => r.code));
    }
    
    const emails = await pool.query(`SELECT email FROM users WHERE email IN ('admin@evdms.com', 'manager@evmotors.com', 'manager@greenautocenter.com')`);
    if (emails.rows.length > 0) {
      console.log(`⚠️  User emails đã tồn tại:`, emails.rows.map(r => r.email));
    }
    
  } catch (error) {
    console.error('❌ Lỗi kiểm tra:', error.message);
  } finally {
    await pool.end();
  }
}

checkExistingData();