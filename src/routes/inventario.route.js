const { Router } = require("express");
const InventarioController = require("../controllers/inventario.controller");

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Insumo:
 *       type: object
 *       properties:
 *         id_insumos:
 *           type: integer
 *           example: 12
 *         nombre_insumo:
 *           type: string
 *           example: Carne de Res (Molida)
 *         stock_actual:
 *           type: number
 *           format: float
 *           example: 25.5
 *         unidad_medida:
 *           type: string
 *           example: Kg
 *         stock_minimo:
 *           type: number
 *           format: float
 *           example: 5.0
 *         punto_reorden:
 *           type: number
 *           format: float
 *           example: 8.0
 *         fk_id_categoria:
 *           type: integer
 *           example: 2
 *     
 *     InsumoInput:
 *       type: object
 *       required:
 *         - nombre_insumo
 *         - stock_actual
 *         - unidad_medida
 *         - fk_id_categoria
 *       properties:
 *         nombre_insumo:
 *           type: string
 *           example: Queso Cheddar
 *         stock_actual:
 *           type: number
 *           format: float
 *           example: 10.0
 *         unidad_medida:
 *           type: string
 *           example: Kg
 *         stock_minimo:
 *           type: number
 *           format: float
 *           default: 0
 *           example: 2.0
 *         punto_reorden:
 *           type: number
 *           format: float
 *           default: 0
 *           example: 3.5
 *         fk_id_categoria:
 *           type: integer
 *           example: 1
 */

/**
 * @swagger
 * /inventario:
 *   get:
 *     summary: Listar todos los insumos del inventario
 *     description: Retorna un listado completo de los insumos ordenados de forma descendente por su ID.
 *     tags: [Inventario]
 *     responses:
 *       200:
 *         description: Listado de insumos obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Insumo'
 *       500:
 *         description: Error interno del servidor
 */
router.get("/", InventarioController.getAll);

/**
 * @swagger
 * /inventario/{id}:
 *   get:
 *     summary: Consultar insumo por ID
 *     description: Retorna la información detallada de un insumo específico.
 *     tags: [Inventario]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único del insumo (columna "id_insumos")
 *         example: 12
 *     responses:
 *       200:
 *         description: Insumo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Insumo'
 *       400:
 *         description: El ID proporcionado no es válido
 *       404:
 *         description: No se encontró ningún insumo con ese ID
 *       500:
 *         description: Error interno del servidor
 */
router.get("/:id", InventarioController.getById);

/**
 * @swagger
 * /inventario:
 *   post:
 *     summary: Registrar un nuevo insumo
 *     description: Crea un nuevo registro de insumo en la base de datos tras validar sus campos.
 *     tags: [Inventario]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InsumoInput'
 *     responses:
 *       201:
 *         description: Insumo registrado satisfactoriamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Insumo'
 *       400:
 *         description: Error de validación en los datos ingresados o la categoría no existe
 *       409:
 *         description: Ya existe un insumo registrado con ese nombre
 *       500:
 *         description: Error interno del servidor
 */
router.post("/", InventarioController.create);

/**
 * @swagger
 * /inventario/{id}:
 *   put:
 *     summary: Actualizar insumo existente
 *     description: Permite modificar de forma parcial o total las propiedades de un insumo.
 *     tags: [Inventario]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 12
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_insumo:
 *                 type: string
 *                 example: Carne de Res Premium
 *               stock_actual:
 *                 type: number
 *                 format: float
 *                 example: 30.0
 *               unidad_medida:
 *                 type: string
 *                 example: Kg
 *               stock_minimo:
 *                 type: number
 *                 format: float
 *                 example: 6.0
 *               punto_reorden:
 *                 type: number
 *                 format: float
 *                 example: 10.0
 *               fk_id_categoria:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Insumo actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Insumo'
 *       400:
 *         description: ID inválido, body vacío o categoría no existe
 *       404:
 *         description: No existe un insumo con el ID proporcionado
 *       409:
 *         description: El nombre del insumo entra en conflicto con uno existente
 *       500:
 *         description: Error interno del servidor
 */
router.put("/:id", InventarioController.update);

/**
 * @swagger
 * /inventario/{id}:
 *   delete:
 *     summary: Eliminar un insumo
 *     description: Elimina un registro de insumo de la base de datos si no tiene relaciones activas.
 *     tags: [Inventario]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 12
 *     responses:
 *       200:
 *         description: Insumo eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Insumo eliminado correctamente
 *       400:
 *         description: El ID proporcionado no es válido
 *       404:
 *         description: No existe un insumo con ese ID
 *       409:
 *         description: No se puede eliminar el insumo porque está vinculado a proveedores o recetas
 *       500:
 *         description: Error interno del servidor
 */
router.delete("/:id", InventarioController.remove);

module.exports = router;