const { withTransaction } = require("../postgres");

class ClientesModel {
  static async getAll() {
    return withTransaction(async client => {
      const result = await client.query("SELECT * FROM cliente ORDER BY nombre");
      return result.rows;
    });
  }

  static async getByCedula(cedula) {
    return withTransaction(async client => {
      const result = await client.query(
        "SELECT * FROM cliente WHERE cedula_cliente = $1",
        [cedula]
      );
      return result.rows[0] ?? null;
    });
  }

  static async create({ cedula_cliente, nombre, telefono, email, direccion_habitual }) {
    return withTransaction(async client => {
      const result = await client.query(
        `INSERT INTO cliente (cedula_cliente, nombre, telefono, email, direccion_habitual)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [cedula_cliente, nombre, telefono, email ?? null, direccion_habitual ?? null]
      );
      return result.rows[0];
    });
  }
}

module.exports = ClientesModel;
