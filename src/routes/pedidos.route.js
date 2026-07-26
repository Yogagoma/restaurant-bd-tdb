const { Router } = require("express");
const pedidosController = require("../controllers/pedidos.controller");

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     DetallePedido:
 *       type: object
 *       properties:
 *         id_plato:
 *           type: integer
 *           example: 3
 *         cantidad:
 *           type: integer
 *           example: 2
 *         subtotal:
 *           type: number
 *           format: float
 *           example: 25.00
 *     Pedido:
 *       type: object
 *       properties:
 *         num_ticket:
 *           type: integer
 *           example: 1
 *         tipo_pedido:
 *           type: string
 *           enum: [mesa, pickup, delivery]
 *           example: mesa
 *         estado_orden:
 *           type: string
 *           enum: [recibido, preparando, listo, entregado]
 *           example: recibido
 *         id_mesa:
 *           type: integer
 *           nullable: true
 *           description: Solo aplica si el pedido es de tipo "mesa"
 *           example: 4
 *         cedula_cliente:
 *           type: string
 *           example: "1234567890"
 *         direccion_envio:
 *           type: string
 *           nullable: true
 *           description: Obligatoria únicamente si el pedido es de tipo "delivery"
 *           example: null
 */

/**
 * @swagger
 * /pedidos:
 *   get:
 *     summary: Listar todos los pedidos
 *     description: Devuelve todos los pedidos registrados, sin sus detalles (platos asociados).
 *     tags: [Pedidos]
 *     responses:
 *       200:
 *         description: Listado de pedidos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pedido'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get("/", pedidosController.getAll);

/**
 * @swagger
 * /pedidos/{ticket}:
 *   get:
 *     summary: Obtener un pedido por número de ticket
 *     description: >
 *       Devuelve la información del pedido junto con el detalle de los platos
 *       que lo componen (cantidad y subtotal de cada uno). Si el pedido no
 *       tiene platos asociados aún, "detalles" se devuelve como un arreglo vacío.
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: ticket
 *         required: true
 *         schema:
 *           type: integer
 *         description: Número de ticket del pedido
 *     responses:
 *       200:
 *         description: Pedido encontrado, incluyendo sus detalles
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Pedido'
 *                 - type: object
 *                   properties:
 *                     detalles:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/DetallePedido'
 *       400:
 *         description: El número de ticket proporcionado no es válido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Número de ticket inválido
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: No existe un pedido con ese número de ticket
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Pedido no encontrado
 */
router.get("/:ticket", pedidosController.getByTicket);

/**
 * @swagger
 * /pedidos:
 *   post:
 *     summary: Crear un nuevo pedido
 *     description: >
 *       Crea un pedido nuevo con estado inicial "recibido" (asignado automáticamente,
 *       no es necesario enviarlo). Las reglas varían según el tipo de pedido:
 *       si es de tipo "mesa" se espera un "id_mesa" válido; si es "delivery" es
 *       obligatorio incluir "direccion_envio"; para "pickup" ninguno de los dos
 *       campos es estrictamente necesario.
 *     tags: [Pedidos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tipo_pedido
 *               - cedula_cliente
 *             properties:
 *               tipo_pedido:
 *                 type: string
 *                 enum: [mesa, pickup, delivery]
 *                 example: mesa
 *               id_mesa:
 *                 type: integer
 *                 nullable: true
 *                 description: Requerido (numérico) si tipo_pedido es "mesa"
 *                 example: 4
 *               cedula_cliente:
 *                 type: string
 *                 maxLength: 20
 *                 example: "1234567890"
 *               direccion_envio:
 *                 type: string
 *                 nullable: true
 *                 description: Obligatoria si tipo_pedido es "delivery"
 *                 example: "Av. Siempre Viva 123"
 *     responses:
 *       200:
 *         description: Pedido creado satisfactoriamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: El pedido ha sido creado satisfactoriamente
 *                 data:
 *                   $ref: '#/components/schemas/Pedido'
 *       400:
 *         description: >
 *           Error de validación (tipo de pedido inválido, cédula inválida,
 *           falta dirección de envío en un pedido delivery, etc.)
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
 *                         example: Se debe proveer un tipo de pedido válido
 *                       path:
 *                         type: string
 *                         example: tipo_pedido
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Error interno al intentar crear el pedido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ha ocurrido un error interno al crear el pedido
 *                 error:
 *                   type: string
 */
router.post("/", pedidosController.createPlatoValidators, pedidosController.create);

/**
 * @swagger
 * /pedidos/{ticket}:
 *   post:
 *     summary: Añadir un plato a un pedido existente
 *     description: >
 *       Agrega una línea de detalle a un pedido ya creado. El subtotal se
 *       calcula automáticamente en el servidor (precio del plato × cantidad),
 *       no se envía en el body.
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: ticket
 *         required: true
 *         schema:
 *           type: integer
 *         description: Número de ticket del pedido al que se le añadirá el plato
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_plato
 *               - cantidad
 *             properties:
 *               id_plato:
 *                 type: integer
 *                 example: 3
 *               cantidad:
 *                 type: integer
 *                 description: Debe ser un entero mayor a 0
 *                 example: 2
 *     responses:
 *       200:
 *         description: Plato añadido satisfactoriamente al pedido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: El plato ha sido añadido al pedido satisfactoriamente
 *                 data:
 *                   $ref: '#/components/schemas/DetallePedido'
 *       400:
 *         description: Número de ticket inválido, o error de validación en id_plato/cantidad
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Número de ticket inválido
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: No existe el pedido o el plato indicado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Plato no encontrado
 *       500:
 *         description: Error interno al intentar añadir el plato al pedido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ha ocurrido un error interno al crear la mesa
 *                 error:
 *                   type: string
 */
router.post("/:ticket", pedidosController.addPlatoValidators, pedidosController.addPlato);

module.exports = router;
