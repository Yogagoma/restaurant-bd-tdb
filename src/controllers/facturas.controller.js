const FacturasModel = require("../models/facturas.model");
const {
  facturaIdParamSchema,
  crearFacturaSchema,
  actualizarEstadoPagoSchema,
  formatZodErrors
} = require("../schemas");

function internalError(res, error) {
  const status = error.status ?? 500;
  if (status >= 500) console.log(error);
  return res.status(status).json({ error: error.message });
}

class FacturasController {
  static async getAll(req, res) {
    try {
      const facturas = await FacturasModel.getAll();
      return res.json(facturas);
    } catch (error) {
      return internalError(res, error);
    }
  }

  static async getById(req, res) {
    const parsedId = facturaIdParamSchema.safeParse(req.params.id);
    if (!parsedId.success) {
      return res.status(400).json({ error: "El ID de la factura no es válido" });
    }

    try {
      const factura = await FacturasModel.getById(parsedId.data);
      if (!factura) {
        return res.status(404).json({ error: "Factura no encontrada" });
      }
      return res.json(factura);
    } catch (error) {
      return internalError(res, error);
    }
  }

  static async create(req, res) {
    const parsedBody = crearFacturaSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({ errors: formatZodErrors(parsedBody.error) });
    }

    try {
      const factura = await FacturasModel.crear(parsedBody.data);
      return res.status(201).json(factura);
    } catch (error) {
      return internalError(res, error);
    }
  }

  static async updateEstadoPago(req, res) {
    const parsedId = facturaIdParamSchema.safeParse(req.params.id);
    if (!parsedId.success) {
      return res.status(400).json({ error: "El ID de la factura no es válido" });
    }

    const parsedBody = actualizarEstadoPagoSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({ errors: formatZodErrors(parsedBody.error) });
    }

    try {
      const actualizada = await FacturasModel.actualizarEstadoPago(
        parsedId.data,
        parsedBody.data.estado_pago
      );
      if (!actualizada) {
        return res.status(404).json({ error: "Factura no encontrada" });
      }
      return res.json({
        message: "Estado de pago actualizado exitosamente",
        data: actualizada
      });
    } catch (error) {
      return internalError(res, error);
    }
  }
}

module.exports = FacturasController;
