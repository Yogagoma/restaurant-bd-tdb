const { z } = require("zod");

const platoIdParamSchema = z.coerce.number().int();

const createPlatoSchema = z.object({
  nombre: z
    .string({ error: "Se debe proveer un nombre para el plato" })
    .min(1, { error: "Se debe proveer un nombre para el plato" }),
  descripcion: z
    .string({ error: "Se debe proveer una descripción para el plato" })
    .min(1, { error: "Se debe proveer una descripción para el plato" }),
  precio: z.coerce
    .number({ error: "Se debe proveer un precio para el plato" })
    .positive({ error: "Se debe proveer un precio para el plato" }),
  categoria: z.enum(["entrada", "plato_principal", "postre", "bebida", "acompañante"], {
    error: "Se debe proveer una categoría válida"
  })
});

module.exports = { platoIdParamSchema, createPlatoSchema };
