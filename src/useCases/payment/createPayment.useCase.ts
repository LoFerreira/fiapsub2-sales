import { payment } from "../../domain/entities/payment.entity";
import { PaymentGateway } from "../../application/ports/payment.gateway";
import { PaymentRepository } from "../../infra/repositories/payment.repository";

export class CreatePaymentUseCase {
  constructor(
    private paymentRepository: PaymentGateway = new PaymentRepository()
  ) {}

  async execute(vehicleId: string, buyerCpf: string): Promise<payment | null> {
    const paymentData = await this.paymentRepository.generatePaymentCode(
      vehicleId,
      buyerCpf
    );

    return paymentData;
  }
}
