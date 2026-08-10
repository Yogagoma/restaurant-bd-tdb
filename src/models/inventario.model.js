const { withTransaction } = require("../postgres");

class InventarioModel {
  static async getAll() {
    return withTransaction(async client => {
      const result = await client.query(
        "SELECT * FROM insumos ORDER BY id_insumos ASC;"
      );
      return result.rows;
    });
  }

  static async getById(id_insumos) {
    return withTransaction(async client => {
      const query = `
        SELECT * FROM insumos 
        WHERE id_insumos = $1;
      `;
      const result = await client.query(query, [id_insumos]);
      return result.rows[0] ?? null;
    });
  }

  static async create({nombre_insumo, stock_actual, unidad_medida, stock_minimo = 0, punto_reorden = 0, fk_id_categoria}) {
    
    return withTransaction(async client => {
      const query = `
        INSERT INTO insumos 
        (nombre_insumo, stock_actual, unidad_medida, stock_minimo, punto_reorden, fk_id_categoria)
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING *;
      `;
      const values = [
        nombre_insumo,
        stock_actual,
        unidad_medida,
        stock_minimo,
        punto_reorden,
        fk_id_categoria
      ];

      const result = await client.query(query, values);
      return result.rows[0];
    });
  }

  static async update(id_insumos, fields) {
    return withTransaction(async client => {
      const keys = Object.keys(fields);
      if (keys.length === 0) return null;

      const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(", ");
      const values = Object.values(fields);
      const idPosition = keys.length + 1;

      const query = `
        UPDATE insumos 
        SET ${setClause} 
        WHERE id_insumos = $${idPosition} 
        RETURNING *;
      `;

      const result = await client.query(query, [...values, id_insumos]);
      return result.rows[0] ?? null;
    });
  }

  static async delete(id_insumos) {
    return withTransaction(async client => {
      const query = `
        DELETE FROM insumos
        WHERE id_insumos = $1
        RETURNING *;
      `;
      const result = await client.query(query, [id_insumos]);
      return result.rows[0] ?? null;
    });
  }
}

module.exports = InventarioModel;
