import { payment } from "../../domain/entities/payment.entity";
import { PaymentGateway } from "../../application/ports/payment.gateway";
import { PaymentRepository } from "../../infra/repositories/payment.repository";
import { NotFoundError } from "../../domain/errors/not-found.error";

export class UpdatePaymentStatusUseCase {
  constructor(
    private paymentRepository: PaymentGateway = new PaymentRepository()
  ) {}

  async execute(paymentCode: string, status: string): Promise<payment> {
    // Verifica se o pagamento existe
    const existingPayment = await this.paymentRepository.getById(paymentCode);

    if (!existingPayment) {
      throw new NotFoundError("Payment not found");
    }

    // Atualiza o status do pagamento
    const updatedPayment = await this.paymentRepository.updatePaymentStatus(
      paymentCode,
      status
    );

    return updatedPayment;
  }
}
