import { UpdatePaymentStatusUseCase } from "./updatePaymentStatus.useCase";
import { NotFoundError } from "../../domain/errors/not-found.error";
import { PaymentGateway } from "../../application/ports/payment.gateway";
import { PaymentRepository } from "../../infra/repositories/payment.repository";
import { CoreVehicleHttpRepository } from "../../infra/repositories/core-vehicle-http.repository";

export class HandlePaymentWebhookUseCase {
  constructor(
    private paymentRepository: PaymentGateway = new PaymentRepository(),
    private updatePaymentStatusUseCase: UpdatePaymentStatusUseCase = new UpdatePaymentStatusUseCase()
  ) {}

  async execute(paymentCode: string, status: string) {
    const paymentData = await this.paymentRepository.getById(paymentCode);

    if (!paymentData) {
      throw new NotFoundError("Payment not found");
    }

    if (status === "paid") {
      // Atualiza veículo como vendido no fiapsub2-core
      const coreVehicleRepo = new CoreVehicleHttpRepository();
      await coreVehicleRepo.sell(paymentData.vehicleId, paymentData.buyerCpf);

      // E atualiza o status do pagamento localmente
      await this.updatePaymentStatusUseCase.execute(paymentCode, "paid");
    } else if (status === "canceled") {
      await this.updatePaymentStatusUseCase.execute(paymentCode, "canceled");
    }

    return { message: `Payment status updated to ${status}` };
  }
}
