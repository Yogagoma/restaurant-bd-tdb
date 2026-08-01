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

/**
 * Ejecuta el callback dentro de una transacción, sobre una conexión reservada
 * del pool. Si el callback devuelve un valor se hace COMMIT; si lanza un error
 * se hace ROLLBACK y el error se vuelve a lanzar para que lo maneje el
 * controlador. La conexión siempre se devuelve al pool.
 *
 * El callback recibe el cliente de la transacción, y TODAS sus consultas deben
 * hacerse sobre él: una consulta hecha con "pool" saldría por otra conexión y
 * quedaría fuera de la transacción.
 */
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
