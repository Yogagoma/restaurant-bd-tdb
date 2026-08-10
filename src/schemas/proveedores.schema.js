const { z } = require("zod");

// Valida el ID enviado como parámetro en la URL
const proveedorIdParamSchema = z.coerce
  .number({ invalid_type_error: "El ID del proveedor debe ser un número" })
  .int({ message: "El ID del proveedor debe ser un entero" })
  .positive({ message: "El ID del proveedor debe ser un número positivo" });

// Esquema para la creación de un proveedor
const crearProveedorSchema = z.object({
  nombre_empresa: z
    .string({ required_error: "Se debe proveer el nombre de la empresa" })
    .trim()
    .min(1, { message: "El nombre de la empresa no puede estar vacío" })
    .max(150, { message: "El nombre no puede superar los 150 caracteres" }),

  identificacion_rif: z
    .string({ required_error: "Se debe proveer el RIF o identificación" })
    .trim()
    .min(1, { message: "El RIF no puede estar vacío" })
    .max(30, { message: "El RIF no puede superar los 30 caracteres" }),

  ciudad: z
    .string({ required_error: "Se debe proveer la ciudad" })
    .trim()
    .min(1, { message: "La ciudad no puede estar vacía" })
    .max(100, { message: "La ciudad no puede superar los 100 caracteres" }),

  telefono_empresa: z
    .string({ required_error: "Se debe proveer el teléfono" })
    .trim()
    .min(1, { message: "El teléfono no puede estar vacío" })
    .max(30, { message: "El teléfono no puede superar los 30 caracteres" }),

  email_empresa: z
    .string({ required_error: "Se debe proveer el email" })
    .trim()
    .email({ message: "Debe ser un email válido" })
    .max(100, { message: "El email no puede superar los 100 caracteres" }),

  direccion: z
    .string({ required_error: "Se debe proveer la dirección" })
    .trim()
    .min(1, { message: "La dirección no puede estar vacía" })
    .max(255, { message: "La dirección no puede superar los 255 caracteres" }),

  nombre_encargado: z
    .string({ required_error: "Se debe proveer el nombre del encargado" })
    .trim()
    .min(1, { message: "El nombre del encargado no puede estar vacío" })
});

// Esquema para actualización (permite campos opcionales mediante .partial())
const actualizarProveedorSchema = crearProveedorSchema.partial();

module.exports = { proveedorIdParamSchema, crearProveedorSchema, actualizarProveedorSchema };
