const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL
});

async function pingPostgres() {
  const promise = new Promise(resolve => {
    pool.query("SELECT 1");
    pool.once("connect", client => {
      console.log(
        `Successfully connected to Postgres at ${client.host} (${client.database})`
      );
      resolve();
    });
  });
  return promise;
}

async function withTransaction(callback) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch (rollbackError) {
      console.log("Error al hacer ROLLBACK:", rollbackError.message);
    }
    throw error;
  } finally {
    client.release();
  }
}

module.exports = { pool, pingPostgres, withTransaction };
