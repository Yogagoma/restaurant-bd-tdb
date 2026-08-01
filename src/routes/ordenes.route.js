const { Router } = require("express");
const OrdenesController = require("../controllers/ordenes.controller");

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     OrdenItem:
 *       type: object
 *       properties:
 *         id_producto:
 *           type: integer
 *           example: 1
 *         nombre:
 *           type: string
 *           example: Hamburguesa Equis Doble
 *         cantidad:
 *           type: integer
 *           example: 2
 *         precio_unitario:
 *           type: number
 *           format: float
 *           example: 8.50
 *         subtotal:
 *           type: number
 *           format: float
 *           example: 17.00
 *         notas:
 *           type: string
 *           example: Sin cebolla
 *     Orden:
 *       type: object
 *       properties:
 *         id_pedido:
 *           type: integer
 *           example: 101
 *         num_ticket:
 *           type: integer
 *           example: 1
 *         hora_creacion:
 *           type: string
 *           format: date-time
 *           example: 2026-07-24T12:30:00.000Z
 *         cliente_nombre:
 *           type: string
 *           example: Carlos Mendoza
 *         cliente_cedula:
 *           type: string
 *           example: V-18234567
 *         cliente_telefono:
 *           type: string
 *           example: "04141234567"
 *         tipo:
 *           type: string
 *           enum: [mesa, pickup, delivery]
 *           example: mesa
 *         mesa:
 *           type: integer
 *           nullable: true
 *           description: Solo aplica si la orden es de tipo "mesa"
 *           example: 4
 *         direccion:
 *           type: string
 *           description: Cadena vacía cuando la orden no es de tipo "delivery"
 *           example: ""
 *         subtotal:
 *           type: number
 *           format: float
 *           description: Suma de los subtotales de los ítems
 *           example: 18.50
 *         iva:
 *           type: number
 *           format: float
 *           description: 16% aplicado sobre el subtotal
 *           example: 2.96
 *         total:
 *           type: number
 *           format: float
 *           example: 21.46
 *         Estatus_Orden:
 *           type: string
 *           enum: [recibido, preparando, listo, entregado, cancelado]
 *           example: preparando
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrdenItem'
 */

/**
 * @swagger
 * /ordenes:
 *   get:
 *     summary: Listar órdenes / comandas
 *     description: >
 *       Devuelve todas las órdenes con el detalle de sus ítems, ordenadas de la
 *       más reciente a la más antigua. Se puede filtrar por estatus.
 *     tags: [Ordenes]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: estatus
 *         required: false
 *         schema:
 *           type: string
 *         description: >
 *           "activo" devuelve las órdenes en estado recibido, preparando o listo
 *           (las del tablero de cocina). También acepta un estado puntual, por
 *           ejemplo "preparando". No distingue mayúsculas de minúsculas.
 *         example: activo
 *     responses:
 *       200:
 *         description: Listado de órdenes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Orden'
 *       400:
 *         description: El valor de "estatus" no es válido
 */
router.get("/", OrdenesController.getAll);

/**
 * @swagger
 * /ordenes/{id}:
 *   get:
 *     summary: Consultar orden por ID
 *     description: Devuelve una orden puntual junto con el detalle de sus ítems.
 *     tags: [Ordenes]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del pedido (columna "id_pedido")
 *         example: 101
 *     responses:
 *       200:
 *         description: Orden encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Orden'
 *       400:
 *         description: El ID proporcionado no es válido
 *       404:
 *         description: No existe una orden con ese ID
 */
router.get("/:id", OrdenesController.getById);

/**
 * @swagger
 * /ordenes:
 *   post:
 *     summary: Crear nueva orden / comanda (POS)
 *     description: >
 *       Crea la orden junto con sus líneas de detalle. El
 *       estatus inicial es "recibido" y se asigna automáticamente. Si la cédula
 *       del cliente no está registrada, se da de alta con el nombre y teléfono
 *       recibidos. El nombre y el precio de cada ítem se toman del menú, por lo
 *       que "nombre" y "precio_unitario" del body se ignoran.
 *     tags: [Ordenes]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cliente_nombre
 *               - cliente_cedula
 *               - cliente_telefono
 *               - tipo
 *               - items
 *             properties:
 *               cliente_nombre:
 *                 type: string
 *                 example: Maria Delgado
 *               cliente_cedula:
 *                 type: string
 *                 maxLength: 20
 *                 example: V-20123456
 *               cliente_telefono:
 *                 type: string
 *                 maxLength: 20
 *                 example: "04129876543"
 *               tipo:
 *                 type: string
 *                 enum: [mesa, pickup, delivery]
 *                 example: delivery
 *               mesa:
 *                 type: integer
 *                 nullable: true
 *                 description: Obligatorio si "tipo" es "mesa"
 *                 example: 4
 *               direccion:
 *                 type: string
 *                 nullable: true
 *                 description: Obligatoria si "tipo" es "delivery"
 *                 example: Av. Principal #45, Apt 2B
 *               items:
 *                 type: array
 *                 minItems: 1
 *                 description: No puede repetirse el mismo id_producto en dos líneas
 *                 items:
 *                   type: object
 *                   required:
 *                     - id_producto
 *                     - cantidad
 *                   properties:
 *                     id_producto:
 *                       type: integer
 *                       example: 3
 *                     cantidad:
 *                       type: integer
 *                       example: 1
 *                     notas:
 *                       type: string
 *                       nullable: true
 *                       example: Extra queso
 *     responses:
 *       201:
 *         description: Orden creada satisfactoriamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Orden'
 *       400:
 *         description: Error de validación, o algún producto no está disponible
 *       404:
 *         description: La mesa o alguno de los productos no existe
 *       500:
 *         description: Error interno al crear la orden
 */
router.post("/", OrdenesController.create);

/**
 * @swagger
 * /ordenes/{id}:
 *   put:
 *     summary: Actualizar estado de la orden (Cocina / POS)
 *     description: >
 *       Mueve la orden por el flujo recibido → preparando → listo → entregado.
 *       Acepta indistintamente los campos "Estatus_Orden" o "estado_orden", y no
 *       distingue mayúsculas de minúsculas.
 *     tags: [Ordenes]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 102
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Estatus_Orden:
 *                 type: string
 *                 enum: [recibido, preparando, listo, entregado, cancelado]
 *                 example: preparando
 *               estado_orden:
 *                 type: string
 *                 description: Alias de "Estatus_Orden" por compatibilidad con el frontend
 *     responses:
 *       200:
 *         description: Estado actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Estado de la orden actualizado exitosamente
 *                 id_pedido:
 *                   type: integer
 *                   example: 102
 *                 Estatus_Orden:
 *                   type: string
 *                   example: preparando
 *       400:
 *         description: ID inválido o estatus no especificado / no reconocido
 *       404:
 *         description: No existe una orden con ese ID
 */
router.put("/:id", OrdenesController.updateStatus);

/**
 * @swagger
 * /ordenes/{id}:
 *   delete:
 *     summary: Cancelar orden
 *     description: >
 *       Marca la orden como "cancelado". No se borra el registro, ya que la
 *       facturación y los reportes de los demás equipos siguen dependiendo de él.
 *     tags: [Ordenes]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 102
 *     responses:
 *       200:
 *         description: Orden cancelada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: La orden 102 ha sido cancelada correctamente.
 *       400:
 *         description: El ID proporcionado no es válido
 *       404:
 *         description: No existe una orden con ese ID
 *       409:
 *         description: La orden ya fue cancelada, o ya fue entregada
 */
router.delete("/:id", OrdenesController.cancel);

module.exports = router;
