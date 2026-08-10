const { z } = require("zod");

const clienteCedulaParamSchema = z
  .string({ error: "Se debe proveer la cédula del cliente" })
  .min(1, { error: "Se debe proveer la cédula del cliente" });

const crearClienteSchema = z.object({
  cedula_cliente: z
    .string({ error: "Se debe proveer la cédula del cliente" })
    .min(1, { error: "Se debe proveer la cédula del cliente" })
    .max(20, { error: "La cédula no puede superar los 20 caracteres" }),
  nombre: z
    .string({ error: "Se debe proveer el nombre del cliente" })
    .min(1, { error: "Se debe proveer el nombre del cliente" })
    .max(100, { error: "El nombre no puede superar los 100 caracteres" }),
  telefono: z
    .string({ error: "Se debe proveer el teléfono del cliente" })
    .min(1, { error: "Se debe proveer el teléfono del cliente" })
    .max(20, { error: "El teléfono no puede superar los 20 caracteres" }),
  email: z
    .string({ error: "El email debe ser una cadena de texto" })
    .max(100, { error: "El email no puede superar los 100 caracteres" })
    .optional()
    .nullable(),
  direccion_habitual: z
    .string({ error: "La dirección debe ser una cadena de texto" })
    .max(255, { error: "La dirección no puede superar los 255 caracteres" })
    .optional()
    .nullable()
});

module.exports = { clienteCedulaParamSchema, crearClienteSchema };
