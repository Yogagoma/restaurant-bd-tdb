const ClientesModel = require("../models/clientes.model");
const { clienteCedulaParamSchema, crearClienteSchema, formatZodErrors } = require("../schemas");

function internalError(res, error) {
  const status = error.status ?? 500;
  if (status >= 500) console.log(error);
  return res.status(status).json({ error: error.message });
}

class ClientesController {
  static async getAll(req, res) {
    try {
      const clientes = await ClientesModel.getAll();
      return res.json(clientes);
    } catch (error) {
      return internalError(res, error);
    }
  }

  static async getByCedula(req, res) {
    const parsedCedula = clienteCedulaParamSchema.safeParse(req.params.cedula);
    if (!parsedCedula.success) {
      return res.status(400).json({ error: "Cédula de cliente inválida" });
    }

    try {
      const cliente = await ClientesModel.getByCedula(parsedCedula.data);
      if (!cliente) {
        return res.status(404).json({ error: "Cliente no encontrado" });
      }
      return res.json(cliente);
    } catch (error) {
      return internalError(res, error);
    }
  }

  static async create(req, res) {
    const parsedBody = crearClienteSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({ errors: formatZodErrors(parsedBody.error) });
    }

    try {
      const cliente = await ClientesModel.create(parsedBody.data);
      return res.status(201).json(cliente);
    } catch (error) {
      if (error.code === "23505") {
        return res.status(409).json({
          error: "Ya existe un cliente registrado con esa cédula"
        });
      }
      return internalError(res, error);
    }
  }
}

module.exports = ClientesController;
