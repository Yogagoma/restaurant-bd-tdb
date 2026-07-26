const { pool: postgresPool } = require("../postgres");
const { body, validationResult } = require("express-validator");

class PlatosController {
  createPlatoValidators = [
    body("nombre")
      .isString()
      .notEmpty()
      .withMessage("Se debe proveer un nombre para el plato"),
    body("descripcion")
      .isString()
      .notEmpty()
      .withMessage("Se debe proveer una descripción para el plato"),
    body("precio")
      .isFloat({ gt: 0 })
      .withMessage("Se debe proveer un precio para el plato"),
    body("categoria")
      .isIn(["entrada", "plato_principal", "postre", "bebida", "acompañante"])
      .withMessage("Se debe proveer una categoría válida")
  ];

  getAll = async (req, res) => {
    const result = await postgresPool.query("SELECT * FROM plato");
    res.send(result.rows);
  };

  getById = async (req, res) => {
    const platoId = parseInt(req.params.id);
    if (isNaN(platoId)) {
      res.status(400).send({ message: "ID de plato inválida" });
      return;
    }

    const result = await postgresPool.query("SELECT * FROM plato WHERE id_plato = $1", [
      platoId
    ]);
    if (result.rows.length <= 0) {
      res.status(404).send({ message: "Plato no encontrado" });
      return;
    }

    res.send(result.rows[0]);
  };

  create = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const result = await postgresPool.query(
        "INSERT INTO plato (nombre, descripcion, precio, categoria) VALUES ($1, $2, $3, $4) RETURNING *",
        [req.body.nombre, req.body.descripcion, req.body.precio, req.body.categoria]
      );
      res.send({
        message: "El plato ha sido creado satisfactoriamente",
        data: result.rows[0]
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Ha ocurrido un error interno al crear el plato",
        error: error.message
      });
    }
  };
}

module.exports = new PlatosController();
