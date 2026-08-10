const { withTransaction } = require("../postgres");

class ReportesModel {
  // Resumen Ejecutivo (KPIs)
  static async getResumen() {
    return withTransaction(async client => {
      const query = `
        SELECT 
          COALESCE(COUNT(id_orden_compra), 0)::INT AS total_pedidos,
          COALESCE(SUM(costo_unitario * cantidad_pedido), 0)::NUMERIC(12,2) AS ingresos_brutos,
          COALESCE(ROUND(AVG(tiempo_entrega_dias * 86400)), 0)::INT AS tiempo_promedio_seg,
          14.2 AS pct_cambio_pedidos,
          18.5 AS pct_cambio_ingresos
        FROM proveedores_insumo;
      `;

      const result = await client.query(query);
      return result.rows[0];
    });
  }

  // Reporte Histórico de Pedidos / Compras
  static async getPedidos(estado) {
    return withTransaction(async client => {
      let query = `
        SELECT 
          pi.id_orden_compra AS id_pedido,
          pi.id_orden_compra AS num_ticket,
          pi.fecha_emision AS hora_creacion,
          p.nombre_empresa AS cliente_nombre,
          'proveedor' AS tipo,
          ROUND((pi.costo_unitario * pi.cantidad_pedido)::numeric, 2) AS total,
          pi.estado_envio AS "Estatus_Orden"
        FROM proveedores_insumo pi
        JOIN proveedores p ON pi.fk_id_proveedor = p.id_proveedor
      `;

      const values = [];

      if (estado) {
        query += ` WHERE LOWER(pi.estado_envio) = LOWER($1)`;
        values.push(estado);
      }

      query += ` ORDER BY pi.fecha_emision DESC;`;

      const result = await client.query(query, values);
      return result.rows;
    });
  }
}

module.exports = ReportesModel;
