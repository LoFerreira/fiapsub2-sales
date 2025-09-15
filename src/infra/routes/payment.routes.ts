import express from "express";
import expressAsyncHandler from "express-async-handler";
import { celebrate, Segments } from "celebrate";
import { PaymentController } from "../controllers/payment.controller";
import {
  paymentWebhookSchema,
  createPaymentSchema,
} from "../validators/payment.schema";

const paymentRoutes = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     PaymentWebhook:
 *       type: object
 *       required:
 *         - paymentCode
 *         - status
 *       properties:
 *         paymentCode:
 *           type: string
 *           description: Código do pagamento
 *         status:
 *           type: string
 *           enum: [paid, canceled]
 *           description: Status do pagamento
 */
/**
 * @swagger
 * /sales:
 *   get:
 *     summary: Lista todas as vendas (sales)
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: Lista de vendas
 */
paymentRoutes.get("/sales", expressAsyncHandler(PaymentController.getAll));

/**
 * @swagger
 * /sales:
 *   post:
 *     summary: Cria uma nova venda (generatePaymentCode)
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vehicleId:
 *                 type: string
 *               buyerCpf:
 *                 type: string
 *     responses:
 *       201:
 *         description: Venda criada
 */
paymentRoutes.post(
  "/sales",
  celebrate({ [Segments.BODY]: createPaymentSchema }),
  expressAsyncHandler(PaymentController.create)
);
/** * @swagger
 * /webhook/payment:
 *   post:
 *     summary: Recebe notificações de status de pagamento
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentWebhook'
 *     responses:
 *       200:
 *         description: Status do pagamento atualizado com sucesso
 */
paymentRoutes.post(
  "/webhook/payment",
  celebrate({ [Segments.BODY]: paymentWebhookSchema }),
  expressAsyncHandler(PaymentController.handlePaymentWebhook)
);

export default paymentRoutes;
