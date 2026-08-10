const { Router } = require("express");
const ProveedoresController = require("../controllers/proveedores.controller");

const proveedoresRouter = Router();

proveedoresRouter.get("/", ProveedoresController.getAll);
proveedoresRouter.get("/:id", ProveedoresController.getById);
proveedoresRouter.post("/", ProveedoresController.create);
proveedoresRouter.put("/:id", ProveedoresController.update);
proveedoresRouter.delete("/:id", ProveedoresController.remove);

module.exports = proveedoresRouter;
