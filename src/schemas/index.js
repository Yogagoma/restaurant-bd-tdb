const mesaSchemas = require("./mesa.schema");
const platoSchemas = require("./plato.schema");
const ordenSchemas = require("./orden.schema");
const clienteSchemas = require("./cliente.schema");
const facturaSchemas = require("./factura.schema");

/**
 * Traduce los issues de Zod al formato de errores que ya expone la API:
 * un arreglo de objetos con `msg` y `path`.
 */
function formatZodErrors(error) {
  return error.issues.map(issue => ({
    msg: issue.message,
    path: issue.path.join(".")
  }));
}

module.exports = {
  ...mesaSchemas,
  ...platoSchemas,
  ...ordenSchemas,
  ...clienteSchemas,
  ...facturaSchemas,
  formatZodErrors
};
