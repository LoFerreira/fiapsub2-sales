import express from "express";
import expressAsyncHandler from "express-async-handler";
import { celebrate, Joi, Segments } from "celebrate";
import { VehicleController } from "../controllers/vehicle.controller";

const vehicleRoutes = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Vehicle:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         brand:
 *           type: string
 *         model:
 *           type: string
 *         year:
 *           type: number
 *         color:
 *           type: string
 *         price:
 *           type: number
 *         sold:
 *           type: boolean
 */

/**
 * @swagger
 * /vehicles:
 *   get:
 *     summary: Lista todos os veículos
 *     tags: [Vehicles]
 *     parameters:
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *           enum: [sold, available]
 *         description: Filtrar veículos por status
 *     responses:
 *       200:
 *         description: Lista de veículos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vehicle'
 */
vehicleRoutes.get(
  "/vehicles",
  celebrate({
    [Segments.QUERY]: {
      filter: Joi.string().valid("sold", "available").optional(),
    },
  }),
  expressAsyncHandler(VehicleController.getAll)
);

export default vehicleRoutes;
