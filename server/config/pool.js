const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || '127.0.0.1',
    database: process.env.DB_NAME || 'MediCash',
    password: process.env.DB_PASSWORD || 'P0stgr3sql',
    port: parseInt(process.env.DB_PORT || '5432', 10),
});
exports.pool = pool;
