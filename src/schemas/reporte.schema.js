const { z } = require("zod");

// Validar query param opcional para filtrar pedidos por estado
const reportPedidosQuerySchema = z.object({
  estado: z
    .string()
    .trim()
    .toLowerCase()
    .optional()
});

module.exports = {reportPedidosQuerySchema};