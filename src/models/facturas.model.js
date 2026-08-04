const { withTransaction } = require("../postgres");

const IVA = 0.16;

function httpError(status, message) {
  return Object.assign(new Error(message), { status });
}

function redondear(valor) {
  return Math.round(valor * 100) / 100;
}

class FacturasModel {
  static async getAll() {
    return withTransaction(async client => {
      const result = await client.query(
        "SELECT * FROM factura ORDER BY num_factura DESC"
      );
      return result.rows;
    });
  }

  static async getById(numFactura) {
    return withTransaction(async client => {
      const result = await client.query(
        "SELECT * FROM factura WHERE num_factura = $1",
        [numFactura]
      );
      return result.rows[0] ?? null;
    });
  }

  /**
   * Procesa el cobro de un pedido: calcula el subtotal a partir de los
   * ítems reales en "detalle_pedido" (no se confía en un total enviado por
   * el cliente de la API), agrega el IVA y crea el registro en "factura".
   *
   * Todo el proceso corre dentro de una sola transacción (withTransaction,
   * definida en src/postgres.js). Si el pedido no existe, no tiene ítems, o
   * ya fue facturado antes, se lanza un error y la transacción hace
   * ROLLBACK automáticamente: no queda ninguna factura a medio crear.
   */
  static async crear({ num_ticket, metodo_pago }) {
    return withTransaction(async client => {
      const pedidoResult = await client.query(
        "SELECT num_ticket FROM pedido WHERE num_ticket = $1",
        [num_ticket]
      );
      if (pedidoResult.rows.length === 0) {
        throw httpError(404, `El pedido con ticket ${num_ticket} no existe`);
      }

      const yaFacturado = await client.query(
        "SELECT num_factura FROM factura WHERE num_ticket = $1",
        [num_ticket]
      );
      if (yaFacturado.rows.length > 0) {
        throw httpError(409, `El pedido con ticket ${num_ticket} ya fue facturado`);
      }

      const itemsResult = await client.query(
        "SELECT subtotal FROM detalle_pedido WHERE num_ticket = $1",
        [num_ticket]
      );
      if (itemsResult.rows.length === 0) {
        throw httpError(
          400,
          `El pedido con ticket ${num_ticket} no tiene ítems para facturar`
        );
      }

      const subtotal = redondear(
        itemsResult.rows.reduce((suma, row) => suma + Number(row.subtotal), 0)
      );
      const impuesto = redondear(subtotal * IVA);
      const total = redondear(subtotal + impuesto);

      const facturaResult = await client.query(
        `INSERT INTO factura (num_ticket, subtotal, impuesto, total, metodo_pago)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [num_ticket, subtotal, impuesto, total, metodo_pago ?? null]
      );

      return facturaResult.rows[0];
    });
  }

  static async actualizarEstadoPago(numFactura, estadoPago) {
    return withTransaction(async client => {
      const result = await client.query(
        `UPDATE factura SET estado_pago = $1 WHERE num_factura = $2
         RETURNING *`,
        [estadoPago, numFactura]
      );
      return result.rows[0] ?? null;
    });
  }
}

module.exports = FacturasModel;
