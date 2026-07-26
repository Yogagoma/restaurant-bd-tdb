const { Router } = require("express");
const platosController = require("../controllers/platos.controller");

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Plato:
 *       type: object
 *       properties:
 *         id_plato:
 *           type: integer
 *           example: 3
 *         nombre:
 *           type: string
 *           example: Ceviche de camarón
 *         descripcion:
 *           type: string
 *           nullable: true
 *           example: Camarones frescos marinados en limón, cebolla morada y cilantro
 *         precio:
 *           type: number
 *           format: float
 *           example: 12.50
 *         categoria:
 *           type: string
 *           enum: [entrada, plato_principal, postre, bebida, acompañante]
 *           example: entrada
 */

/**
 * @swagger
 * /platos:
 *   get:
 *     summary: Listar todos los platos
 *     description: Devuelve todos los platos registrados en el menú, sin filtrar por categoría.
 *     tags: [Platos]
 *     responses:
 *       200:
 *         description: Listado de platos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Plato'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get("/", platosController.getAll);

/**
 * @swagger
 * /platos/{id}:
 *   get:
 *     summary: Obtener un plato por ID
 *     description: Busca un plato específico del menú según su ID numérico.
 *     tags: [Platos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del plato a consultar
 *     responses:
 *       200:
 *         description: Plato encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Plato'
 *       400:
 *         description: El ID proporcionado no es un número válido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: ID de plato inválida
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: No existe un plato con ese ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Plato no encontrado
 */
router.get("/:id", platosController.getById);

/**
 * @swagger
 * /platos:
 *   post:
 *     summary: Crear un nuevo plato
 *     description: >
 *       Registra un nuevo plato en el menú. Se requieren nombre, descripción,
 *       precio (mayor a 0) y una categoría válida.
 *     tags: [Platos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - descripcion
 *               - precio
 *               - categoria
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Ceviche de camarón
 *               descripcion:
 *                 type: string
 *                 example: Camarones frescos marinados en limón, cebolla morada y cilantro
 *               precio:
 *                 type: number
 *                 format: float
 *                 description: Debe ser mayor a 0
 *                 example: 12.50
 *               categoria:
 *                 type: string
 *                 enum: [entrada, plato_principal, postre, bebida, acompañante]
 *                 example: entrada
 *     responses:
 *       200:
 *         description: Plato creado satisfactoriamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: El plato ha sido creado satisfactoriamente
 *                 data:
 *                   $ref: '#/components/schemas/Plato'
 *       400:
 *         description: Error de validación en alguno de los campos enviados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                         example: Se debe proveer un precio para el plato
 *                       path:
 *                         type: string
 *                         example: precio
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Error interno al intentar crear el plato
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ha ocurrido un error interno al crear el plato
 *                 error:
 *                   type: string
 */
router.post("/", platosController.createPlatoValidators, platosController.create);

module.exports = router;
