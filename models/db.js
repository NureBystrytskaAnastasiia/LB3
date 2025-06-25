const sql = require('mssql');

const config = {
  user: 'sqladmin',
  password: 'Admin#2024Strong!',
  server: 'consultation-sql-server.database.windows.net',
  database: 'ConsultationDB',
  options: {
    encrypt: true,
    enableArithAbort: true
  }
};

let pool;

async function getPool() {
  if (pool) return pool;
  try {
    pool = await sql.connect(config);
    console.log('Connected to SQL Server');
    return pool;
  } catch (error) {
    console.error('DB connection error:', error);
    throw error;
  }
}

async function query(strings, ...params) {
  const pool = await getPool();

  let text = '';
  const inputs = {};

  strings.forEach((str, i) => {
    text += str;
    if (i < params.length) {
      const paramName = `param${i}`;
      text += `@${paramName}`;
      inputs[paramName] = params[i];
    }
  });

  const request = pool.request();

  for (const [key, value] of Object.entries(inputs)) {
    request.input(key, value);
  }

  const result = await request.query(text);
  return result;
}

module.exports = {
  getPool,
  query
};
