const { z } = require("zod");

// Valida el ID enviado como parámetro en la URL
const inventarioIdParamSchema = z.coerce
  .number({ invalid_type_error: "El ID del insumo debe ser un número" })
  .int({ message: "El ID del insumo debe ser un entero" })
  .positive({ message: "El ID del insumo debe ser un número positivo" });

// Esquema para la creación de un insumo
const crearInventarioSchema = z.object({
  nombre_insumo: z
    .string({ required_error: "Se debe proveer el nombre del insumo" })
    .trim()
    .min(1, { message: "El nombre del insumo no puede estar vacío" })
    .max(100, { message: "El nombre no puede superar los 100 caracteres" }),

  stock_actual: z.coerce
    .number({ required_error: "Se debe proveer el stock actual" })
    .min(0, { message: "El stock actual no puede ser negativo" }),

  unidad_medida: z
    .string({ required_error: "Se debe proveer la unidad de medida" })
    .trim()
    .min(1, { message: "La unidad de medida no puede estar vacía" })
    .max(20, { message: "La unidad de medida no puede superar los 20 caracteres" }),

  stock_minimo: z.coerce
    .number()
    .min(0, { message: "El stock mínimo no puede ser negativo" })
    .default(0),

  punto_reorden: z.coerce
    .number()
    .min(0, { message: "El punto de reorden no puede ser negativo" })
    .default(0),

  fk_id_categoria: z.coerce
    .number({ required_error: "Se debe vincular una categoría" })
    .int({ message: "El ID de la categoría debe ser un entero" })
    .positive({ message: "El ID de la categoría debe ser válido" })
});

// Esquema para actualización (permite campos opcionales mediante .partial())
const actualizarInventarioSchema = crearInventarioSchema.partial();

module.exports = { inventarioIdParamSchema, crearInventarioSchema, actualizarInventarioSchema};