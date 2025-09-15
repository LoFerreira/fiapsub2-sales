import { PaymentPresenter } from "../../../src/application/presenters/payment.presenter";
import { payment } from "../../../src/domain/entities/payment.entity";

describe("PaymentPresenter", () => {
  it("should map payment entity to response DTO", () => {
    const entity: payment = {
      id: "payment-1",
      vehicleId: "v1",
      buyerCpf: "123",
      saleDate: "2025-01-01",
      paymentStatus: "pending",
    };

    const dto = PaymentPresenter.toResponse(entity);
    expect(dto).toEqual({
      id: "payment-1",
      vehicleId: "v1",
      buyerCpf: "123",
      saleDate: "2025-01-01",
      paymentStatus: "pending",
    });
  });
});
