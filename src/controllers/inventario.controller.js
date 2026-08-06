const InventarioModel = require("../models/inventario.model");
const {inventarioIdParamSchema, crearInventarioSchema, actualizarInventarioSchema, formatZodErrors} = require("../schemas");

function internalError(res, error) {
  const status = error.status ?? 500;
  if (status >= 500) console.log("Error detectado en el servidor:", error);
  return res.status(status).json({ error: error.message });
}

class InventoryController {
  static async getAll(req, res) {
    try {
      const items = await InventarioModel.getAll();
      return res.status(200).json(items);
    } catch (error) {
      return internalError(res, error);
    }
  }

  static async getById(req, res) {
    const parsedId = inventarioIdParamSchema.safeParse(req.params.id);
    if (!parsedId.success) {
      return res.status(400).json({ error: parsedId.error.issues[0].message });
    }

    try {
      const item = await InventarioModel.getById(parsedId.data);
      if (!item) {
        return res.status(404).json({ error: "Item de inventario no encontrado" });
      }
      return res.status(200).json(item);
    } catch (error) {
      return internalError(res, error);
    }
  }

  static async create(req, res) {
    const parsedBody = crearInventarioSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({ error: parsedBody.error.issues[0].message });
    }

    try {
      const newItem = await InventarioModel.create(parsedBody.data);
      return res.status(201).json(newItem);
    } catch (error) {
      // Postgres code 23505: Nombre de insumo duplicado
      if (error.code === "23505") {
        return res.status(409).json({
          error: "Ya existe un insumo registrado con ese nombre"
        });
      }
      // Postgres code 23503: Categoría asociada no existe
      if (error.code === "23503") {
        return res.status(400).json({
          error: "La categoría especificada no existe"
        });
      }
      return internalError(res, error);
    }
  }

  static async update(req, res) {
    // 1. Validar ID de la URL
    const parsedId = inventarioIdParamSchema.safeParse(req.params.id);
    if (!parsedId.success) {
      return res.status(400).json({ error: parsedId.error.issues[0].message });
    }

    // 2. Verificar que se envíe al menos un campo para actualizar
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Debe enviar al menos un campo para actualizar" });
    }

    // 3. Validar el body con el schema parcial de Zod
    const parsedBody = actualizarInventarioSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({ error: parsedBody.error.issues[0].message });
    }

    try {
      const updatedItem = await InventarioModel.update(parsedId.data, parsedBody.data);

      if (!updatedItem) {
        return res.status(404).json({ error: "Item de inventario no encontrado" });
      }

      return res.status(200).json(updatedItem);
    } catch (error) {
      if (error.code === "23505") {
        return res.status(409).json({
          error: "Ya existe un insumo registrado con ese nombre"
        });
      }
      if (error.code === "23503") {
        return res.status(400).json({
          error: "La categoría especificada no existe"
        });
      }
      return internalError(res, error);
    }
  }

  static async remove(req, res) {
    const parsedId = inventarioIdParamSchema.safeParse(req.params.id);
    if (!parsedId.success) {
      return res.status(400).json({ error: parsedId.error.issues[0].message });
    }

    try {
      const deletedItem = await InventarioModel.delete(parsedId.data);

      if (!deletedItem) {
        return res.status(404).json({ error: "Item de inventario no encontrado" });
      }

      return res.status(200).json({ message: "Insumo eliminado correctamente" });
    } catch (error) {
      // Postgres code 23503: Violación de FK 
      if (error.code === "23503") {
        return res.status(409).json({
          error: "No se puede eliminar el insumo porque está vinculado a recetas"
        });
      }
      return internalError(res, error);
    }
  }
}

module.exports = InventoryController;