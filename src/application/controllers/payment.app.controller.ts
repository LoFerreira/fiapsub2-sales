import { PaymentGateway } from "../ports/payment.gateway";
import { HandlePaymentWebhookUseCase } from "../../useCases/payment/handlePaymentWebhook.useCase";

export class PaymentAppController {
  constructor(private paymentGateway: PaymentGateway) {}

  async handleWebhook(paymentCode: string, status: string) {
    const useCase = new HandlePaymentWebhookUseCase(this.paymentGateway);
    return useCase.execute(paymentCode, status);
  }
}
