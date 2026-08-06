const { Router } = require("express");
const ReportesController = require("../controllers/reportes.controller");

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     ReporteResumen:
 *       type: object
 *       properties:
 *         total_pedidos:
 *           type: integer
 *           description: Cantidad total de órdenes de compra registradas
 *           example: 45
 *         ingresos_brutos:
 *           type: number
 *           format: float
 *           description: Suma total gastada/ingresada por compras a proveedores
 *           example: 12500.50
 *         tiempo_promedio_seg:
 *           type: integer
 *           description: Tiempo promedio de entrega expresado en segundos
 *           example: 172800
 *         pct_cambio_pedidos:
 *           type: number
 *           format: float
 *           description: Porcentaje de variación de pedidos en comparación al periodo anterior
 *           example: 14.2
 *         pct_cambio_ingresos:
 *           type: number
 *           format: float
 *           description: Porcentaje de variación de ingresos/gastos en comparación al periodo anterior
 *           example: 18.5
 * 
 *     ReportePedidoItem:
 *       type: object
 *       properties:
 *         id_pedido:
 *           type: integer
 *           example: 101
 *         num_ticket:
 *           type: integer
 *           example: 101
 *         hora_creacion:
 *           type: string
 *           format: date-time
 *           example: "2026-08-01T10:30:00.000Z"
 *         cliente_nombre:
 *           type: string
 *           example: Distribuidora de Alimentos C.A.
 *         tipo:
 *           type: string
 *           example: proveedor
 *         total:
 *           type: number
 *           format: float
 *           example: 450.00
 *         Estatus_Orden:
 *           type: string
 *           enum: [En Proceso, En camino, Recibido]
 *           example: Recibido
 */

/**
 * @swagger
 * /reportes/resumen:
 *   get:
 *     summary: Obtener resumen ejecutivo de KPIs
 *     description: Retorna métricas clave del sistema como total de pedidos, ingresos brutos acumulados, tiempo promedio de entrega y porcentajes de cambio.
 *     tags: [Reportes]
 *     responses:
 *       200:
 *         description: Resumen de indicadores obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReporteResumen'
 *       404:
 *         description: No se encontraron registros para generar el resumen
 *       500:
 *         description: Error interno al generar el reporte de resumen
 */
router.get("/resumen", ReportesController.getResumen);

/**
 * @swagger
 * /reportes/pedidos:
 *   get:
 *     summary: Obtener reporte histórico de pedidos a proveedores
 *     description: Devuelve el listado detallado de órdenes de compra. Permite filtrado opcional según su estado de envío.
 *     tags: [Reportes]
 *     parameters:
 *       - in: query
 *         name: estado
 *         required: false
 *         schema:
 *           type: string
 *         description: Estado de envío para filtrar (Valores aceptados "En Proceso", "En camino", "Recibido")
 *         example: Recibido
 *     responses:
 *       200:
 *         description: Histórico de pedidos obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ReportePedidoItem'
 *       400:
 *         description: El parámetro de consulta "estado" no es válido
 *       500:
 *         description: Error interno al generar el reporte de pedidos
 */
router.get("/pedidos", ReportesController.getPedidos);

module.exports = router;