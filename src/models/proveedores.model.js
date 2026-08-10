const { withTransaction } = require("../postgres");

class ProveedorModel {
  static async getAll() {
    return withTransaction(async client => {
      const result = await client.query(
        "SELECT * FROM proveedores ORDER BY id_proveedor ASC;"
      );
      return result.rows;
    });
  }

  static async getById(id_proveedor) {
    return withTransaction(async client => {
      const query = `
        SELECT * FROM proveedores 
        WHERE id_proveedor = $1;
      `;
      const result = await client.query(query, [id_proveedor]);
      return result.rows[0] ?? null;
    });
  }

  static async create(data) {
    return withTransaction(async client => {
      const query = `
        INSERT INTO proveedores 
        (nombre_empresa, identificacion_rif, ciudad, telefono_empresa, email_empresa, direccion, nombre_encargado)
        VALUES ($1, $2, $3, $4, $5, $6, $7) 
        RETURNING *;
      `;
      const values = [
        data.nombre_empresa,
        data.identificacion_rif,
        data.ciudad,
        data.telefono_empresa,
        data.email_empresa,
        data.direccion,
        data.nombre_encargado
      ];

      const result = await client.query(query, values);
      return result.rows[0];
    });
  }

  static async update(id_proveedor, fields) {
    return withTransaction(async client => {
      const keys = Object.keys(fields);
      if (keys.length === 0) return null;

      const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(", ");
      const values = Object.values(fields);
      const idPosition = keys.length + 1;

      const query = `
        UPDATE proveedores 
        SET ${setClause} 
        WHERE id_proveedor = $${idPosition} 
        RETURNING *;
      `;

      const result = await client.query(query, [...values, id_proveedor]);
      return result.rows[0] ?? null;
    });
  }

  static async delete(id_proveedor) {
    return withTransaction(async client => {
      const query = `
        DELETE FROM proveedores
        WHERE id_proveedor = $1
        RETURNING *;
      `;
      const result = await client.query(query, [id_proveedor]);
      return result.rows[0] ?? null;
    });
  }
}

module.exports = ProveedorModel;
