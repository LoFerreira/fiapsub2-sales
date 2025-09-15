import { payment } from "../../domain/entities/payment.entity";
import { PaymentGateway } from "../../application/ports/payment.gateway";
import { PaymentRepository } from "../../infra/repositories/payment.repository";

export class GetAllSalesUseCase {
  constructor(
    private paymentRepository: PaymentGateway = new PaymentRepository()
  ) {}

  async execute(): Promise<payment[]> {
    return this.paymentRepository.getAll();
  }
}
