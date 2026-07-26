const { withTransaction } = require("../postgres");

class MesasModel {
  static async getAll() {
    return withTransaction(async client => {
      const result = await client.query("SELECT * FROM mesa ORDER BY id_mesa");
      return result.rows;
    });
  }

  static async getById(idMesa) {
    return withTransaction(async client => {
      const result = await client.query("SELECT * FROM mesa WHERE id_mesa = $1", [
        idMesa
      ]);
      return result.rows[0] ?? null;
    });
  }

  static async create({ capacidad, estado, ubicacion }) {
    return withTransaction(async client => {
      const result = await client.query(
        "INSERT INTO mesa (capacidad, estado, ubicacion) VALUES ($1, $2, $3) RETURNING *",
        [capacidad, estado, ubicacion]
      );
      return result.rows[0];
    });
  }
}

module.exports = MesasModel;
