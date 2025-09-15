import { HandlePaymentWebhookUseCase } from "../../useCases/payment/handlePaymentWebhook.useCase";
import { Request, Response } from "express";
import { PaymentWebhookDTO } from "../../application/dto/payment.dto";
import { GetAllSalesUseCase } from "../../useCases/payment/getAllSales.useCase";
import { PaymentPresenter } from "../../application/presenters/payment.presenter";
import { CreatePaymentUseCase } from "../../useCases/payment/createPayment.useCase";

export class PaymentController {
  static async handlePaymentWebhook(req: Request, res: Response) {
    const { paymentCode, status } = req.body as PaymentWebhookDTO;

    const handlePaymentWebhookUseCase = new HandlePaymentWebhookUseCase();
    const payment = await handlePaymentWebhookUseCase.execute(
      paymentCode,
      status
    );
    res.status(200).send(payment);
  }

  static async getAll(req: Request, res: Response) {
    const useCase = new GetAllSalesUseCase();
    const sales = await useCase.execute();
    res.status(200).send(sales.map(PaymentPresenter.toResponse));
  }

  static async create(req: Request, res: Response) {
    const { vehicleId, buyerCpf } = req.body as any;
    const useCase = new CreatePaymentUseCase();
    const sale = await useCase.execute(vehicleId, buyerCpf);
    res.status(201).send(PaymentPresenter.toResponse(sale as any));
  }
}
