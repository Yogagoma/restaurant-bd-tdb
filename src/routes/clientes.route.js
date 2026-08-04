const { Router } = require("express");
const ClientesController = require("../controllers/clientes.controller");

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Cliente:
 *       type: object
 *       properties:
 *         cedula_cliente:
 *           type: string
 *           example: "27.456.123"
 *         nombre:
 *           type: string
 *           example: Maria Gonzalez
 *         telefono:
 *           type: string
 *           example: "+58 416-1077895"
 *         email:
 *           type: string
 *           nullable: true
 *           example: maria.gonzalez@gmail.com
 *         direccion_habitual:
 *           type: string
 *           nullable: true
 *           example: Av. Principal, Res. Las Palmas, Piso 3
 */

/**
 * @swagger
 * /clientes:
 *   get:
 *     summary: Listar todos los clientes
 *     tags: [Clientes]
 *     responses:
 *       200:
 *         description: Listado de clientes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cliente'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get("/", ClientesController.getAll);

/**
 * @swagger
 * /clientes/{cedula}:
 *   get:
 *     summary: Obtener un cliente por cédula
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: cedula
 *         required: true
 *         schema:
 *           type: string
 *         description: Cédula del cliente a consultar
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       400:
 *         description: Cédula inválida
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: No existe un cliente con esa cédula
 */
router.get("/:cedula", ClientesController.getByCedula);

/**
 * @swagger
 * /clientes:
 *   post:
 *     summary: Registrar un nuevo cliente
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cedula_cliente
 *               - nombre
 *               - telefono
 *             properties:
 *               cedula_cliente:
 *                 type: string
 *                 example: "27.456.123"
 *               nombre:
 *                 type: string
 *                 example: Maria Gonzalez
 *               telefono:
 *                 type: string
 *                 example: "+58 416-1077895"
 *               email:
 *                 type: string
 *                 example: maria.gonzalez@gmail.com
 *               direccion_habitual:
 *                 type: string
 *                 example: Av. Principal, Res. Las Palmas, Piso 3
 *     responses:
 *       201:
 *         description: Cliente creado satisfactoriamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       400:
 *         description: Error de validación en alguno de los campos enviados
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       409:
 *         description: Ya existe un cliente con esa cédula
 *       500:
 *         description: Error interno al intentar crear el cliente
 */
router.post("/", ClientesController.create);

module.exports = router;
