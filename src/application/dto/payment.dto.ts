import { payment } from "../../domain/entities/payment.entity";

export type PaymentWebhookDTO = {
  paymentCode: string;
  status: "pending" | "paid" | "canceled";
};

export type CreatePaymentDTO = {
  vehicleId: string;
  buyerCpf: string;
};

export type PaymentResponseDTO = {
  id: string;
  vehicleId: string;
  buyerCpf: string;
  saleDate: string;
  paymentStatus: "pending" | "paid" | "canceled";
};

export const paymentToResponseDTO = (p: payment): PaymentResponseDTO => ({
  id: p.id,
  vehicleId: p.vehicleId,
  buyerCpf: p.buyerCpf,
  saleDate: p.saleDate,
  paymentStatus: p.paymentStatus as any,
});
