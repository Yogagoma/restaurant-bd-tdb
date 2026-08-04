const { Router } = require("express");
const FacturasController = require("../controllers/facturas.controller");

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Factura:
 *       type: object
 *       properties:
 *         num_factura:
 *           type: integer
 *           example: 1
 *         num_ticket:
 *           type: integer
 *           example: 5
 *         fecha_emision:
 *           type: string
 *           format: date-time
 *         subtotal:
 *           type: number
 *           example: 17.00
 *         impuesto:
 *           type: number
 *           example: 2.72
 *         total:
 *           type: number
 *           example: 19.72
 *         estado_pago:
 *           type: string
 *           enum: [pendiente, pagado, anulado]
 *           example: pendiente
 *         metodo_pago:
 *           type: string
 *           nullable: true
 *           example: pago_movil
 */

/**
 * @swagger
 * /facturas:
 *   get:
 *     summary: Listar todas las facturas
 *     tags: [Facturas]
 *     responses:
 *       200:
 *         description: Listado de facturas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Factura'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get("/", FacturasController.getAll);

/**
 * @swagger
 * /facturas/{id}:
 *   get:
 *     summary: Obtener una factura por su número
 *     tags: [Facturas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Número de factura a consultar
 *     responses:
 *       200:
 *         description: Factura encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Factura'
 *       400:
 *         description: El ID proporcionado no es válido
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: No existe una factura con ese número
 */
router.get("/:id", FacturasController.getById);

/**
 * @swagger
 * /facturas:
 *   post:
 *     summary: Procesar el cobro de un pedido (transacción segura)
 *     description: >
 *       Calcula el subtotal a partir de los ítems reales del pedido en
 *       "detalle_pedido", agrega el IVA y crea la factura. Si el pedido no
 *       existe, no tiene ítems, o ya fue facturado, la operación falla y no
 *       queda ningún registro a medio crear (ROLLBACK).
 *     tags: [Facturas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - num_ticket
 *             properties:
 *               num_ticket:
 *                 type: integer
 *                 example: 5
 *               metodo_pago:
 *                 type: string
 *                 example: pago_movil
 *     responses:
 *       201:
 *         description: Factura creada satisfactoriamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Factura'
 *       400:
 *         description: El pedido no tiene ítems, o error de validación
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: El pedido indicado no existe
 *       409:
 *         description: El pedido ya fue facturado anteriormente
 */
router.post("/", FacturasController.create);

/**
 * @swagger
 * /facturas/{id}/estado-pago:
 *   put:
 *     summary: Actualizar el estado de pago de una factura
 *     tags: [Facturas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Número de factura a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - estado_pago
 *             properties:
 *               estado_pago:
 *                 type: string
 *                 enum: [pendiente, pagado, anulado]
 *                 example: pagado
 *     responses:
 *       200:
 *         description: Estado de pago actualizado exitosamente
 *       400:
 *         description: El ID no es válido, o error de validación
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: No existe una factura con ese número
 */
router.put("/:id/estado-pago", FacturasController.updateEstadoPago);

module.exports = router;
