import { payment } from "../../domain/entities/payment.entity";

// Port/Gateway for payment persistence. Implemented in infra layer.
export interface PaymentGateway {
  generatePaymentCode(
    vehicleId: string,
    buyerCpf: string
  ): Promise<payment | null>;
  updatePaymentStatus(paymentCode: string, status: string): Promise<payment>;
  getById(paymentCode: string): Promise<payment | null>;
  getAll(): Promise<payment[]>;
}
