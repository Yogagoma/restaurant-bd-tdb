const { z } = require("zod");

const facturaIdParamSchema = z.coerce.number().int();

const crearFacturaSchema = z.object({
  num_ticket: z.coerce
    .number({ error: "Se debe proveer el número de ticket del pedido a facturar" })
    .int({ error: "Se debe proveer el número de ticket del pedido a facturar" })
    .positive({ error: "Se debe proveer el número de ticket del pedido a facturar" }),
  metodo_pago: z
    .string({ error: "El método de pago debe ser una cadena de texto" })
    .max(30, { error: "El método de pago no puede superar los 30 caracteres" })
    .optional()
    .nullable()
});

const actualizarEstadoPagoSchema = z.object({
  estado_pago: z.enum(["pendiente", "pagado", "anulado"], {
    error: "Se debe proveer un estado de pago válido (pendiente, pagado o anulado)"
  })
});

module.exports = { facturaIdParamSchema, crearFacturaSchema, actualizarEstadoPagoSchema };
