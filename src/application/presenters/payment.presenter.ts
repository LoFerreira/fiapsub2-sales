import { payment } from "../../domain/entities/payment.entity";
import { PaymentResponseDTO } from "../dto/payment.dto";

export class PaymentPresenter {
  static toResponse(p: payment): PaymentResponseDTO {
    return {
      id: p.id,
      vehicleId: p.vehicleId,
      buyerCpf: p.buyerCpf,
      saleDate: p.saleDate,
      paymentStatus: p.paymentStatus as any,
    };
  }
}
