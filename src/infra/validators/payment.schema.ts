import { Joi } from "celebrate";

export const paymentWebhookSchema = Joi.object({
  paymentCode: Joi.string().required(),
  status: Joi.string().valid("paid", "canceled").required(),
});

export const createPaymentSchema = Joi.object({
  vehicleId: Joi.string().required(),
  buyerCpf: Joi.string().required(),
});
