require("dotenv").config();
const { pool } = require('../src/postgres');
pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'").then(res => console.log(res.rows)).catch(console.error).finally(() => process.exit(0));
