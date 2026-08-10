const ProveedorModel = require("../models/proveedores.model");
const { proveedorIdParamSchema, crearProveedorSchema, actualizarProveedorSchema, formatZodErrors } = require("../schemas");

function internalError(res, error) {
  const status = error.status ?? 500;
  if (status >= 500) console.log("Error detectado en el servidor:", error);
  return res.status(status).json({ error: error.message });
}

class ProveedoresController {
  static async getAll(req, res) {
    try {
      const items = await ProveedorModel.getAll();
      return res.status(200).json(items);
    } catch (error) {
      return internalError(res, error);
    }
  }

  static async getById(req, res) {
    const parsedId = proveedorIdParamSchema.safeParse(req.params.id);
    if (!parsedId.success) {
      return res.status(400).json({ error: parsedId.error.issues[0].message });
    }

    try {
      const item = await ProveedorModel.getById(parsedId.data);
      if (!item) {
        return res.status(404).json({ error: "Proveedor no encontrado" });
      }
      return res.status(200).json(item);
    } catch (error) {
      return internalError(res, error);
    }
  }

  static async create(req, res) {
    const parsedBody = crearProveedorSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({ error: parsedBody.error.issues[0].message });
    }

    try {
      const newItem = await ProveedorModel.create(parsedBody.data);
      return res.status(201).json(newItem);
    } catch (error) {
      // Postgres code 23505: UNIQUE_VIOLATION
      if (error.code === "23505") {
        return res.status(409).json({
          error: "Ya existe un proveedor registrado con ese RIF o Email"
        });
      }
      return internalError(res, error);
    }
  }

  static async update(req, res) {
    // 1. Validar ID de la URL
    const parsedId = proveedorIdParamSchema.safeParse(req.params.id);
    if (!parsedId.success) {
      return res.status(400).json({ error: parsedId.error.issues[0].message });
    }

    // 2. Verificar que se envíe al menos un campo para actualizar
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Debe enviar al menos un campo para actualizar" });
    }

    // 3. Validar el body con el schema parcial de Zod
    const parsedBody = actualizarProveedorSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({ error: parsedBody.error.issues[0].message });
    }

    try {
      const updatedItem = await ProveedorModel.update(parsedId.data, parsedBody.data);

      if (!updatedItem) {
        return res.status(404).json({ error: "Proveedor no encontrado" });
      }

      return res.status(200).json(updatedItem);
    } catch (error) {
      if (error.code === "23505") {
        return res.status(409).json({
          error: "Ya existe un proveedor registrado con ese RIF o Email"
        });
      }
      return internalError(res, error);
    }
  }

  static async remove(req, res) {
    const parsedId = proveedorIdParamSchema.safeParse(req.params.id);
    if (!parsedId.success) {
      return res.status(400).json({ error: parsedId.error.issues[0].message });
    }

    try {
      const deletedItem = await ProveedorModel.delete(parsedId.data);

      if (!deletedItem) {
        return res.status(404).json({ error: "Proveedor no encontrado" });
      }

      return res.status(200).json({ message: "Proveedor eliminado correctamente" });
    } catch (error) {
      // Postgres code 23503: Violación de llave foránea (e.g. proveedores_insumo)
      if (error.code === "23503") {
        return res.status(409).json({
          error: "No se puede eliminar el proveedor porque tiene compras registradas"
        });
      }
      return internalError(res, error);
    }
  }
}

module.exports = ProveedoresController;
