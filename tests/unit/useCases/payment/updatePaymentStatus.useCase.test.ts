import { UpdatePaymentStatusUseCase } from "../../../../src/useCases/payment/updatePaymentStatus.useCase";
import { MockPaymentRepository } from "../../../mocks/payment.repository.mock";
import { NotFoundError } from "../../../../src/domain/errors/not-found.error";

jest.mock("../../../../src/infra/repositories/payment.repository", () => {
  return {
    PaymentRepository: jest
      .fn()
      .mockImplementation(() => new MockPaymentRepository()),
  };
});

describe("UpdatePaymentStatusUseCase", () => {
  let useCase: UpdatePaymentStatusUseCase;
  let mockRepository: MockPaymentRepository;

  beforeEach(() => {
    useCase = new UpdatePaymentStatusUseCase();
    mockRepository = (useCase as any)
      .paymentRepository as MockPaymentRepository;
    mockRepository.clear();
  });

  describe("execute", () => {
    it("should update payment status successfully", async () => {
      const payment = await mockRepository.generatePaymentCode(
        "1",
        "123.456.789-00"
      );

      const result = await useCase.execute(payment.id, "paid");

      expect(result).toMatchObject({
        id: payment.id,
        vehicleId: "1",
        buyerCpf: "123.456.789-00",
        paymentStatus: "paid",
        saleDate: expect.any(String),
      });
    });

    it("should update payment from pending to paid", async () => {
      const payment = await mockRepository.generatePaymentCode(
        "2",
        "987.654.321-00"
      );
      expect(payment.paymentStatus).toBe("pending");

      const result = await useCase.execute(payment.id, "paid");

      expect(result.paymentStatus).toBe("paid");
      expect(result.id).toBe(payment.id);
    });

    it("should update payment from pending to canceled", async () => {
      const payment = await mockRepository.generatePaymentCode(
        "3",
        "555.444.333-22"
      );

      const result = await useCase.execute(payment.id, "canceled");

      expect(result.paymentStatus).toBe("canceled");
      expect(result.vehicleId).toBe("3");
    });

    it("should throw NotFoundError when payment does not exist", async () => {
      await expect(
        useCase.execute("non-existent-payment", "paid")
      ).rejects.toThrow(NotFoundError);
    });

    it("should throw NotFoundError with correct message", async () => {
      await expect(useCase.execute("invalid-id", "paid")).rejects.toThrow(
        "Payment not found"
      );
    });

    it("should maintain other payment properties when updating status", async () => {
      const originalPayment = await mockRepository.generatePaymentCode(
        "5",
        "111.222.333-44"
      );

      const updatedPayment = await useCase.execute(originalPayment.id, "paid");

      expect(updatedPayment.vehicleId).toBe(originalPayment.vehicleId);
      expect(updatedPayment.buyerCpf).toBe(originalPayment.buyerCpf);
      expect(updatedPayment.saleDate).toBe(originalPayment.saleDate);
      expect(updatedPayment.id).toBe(originalPayment.id);
      expect(updatedPayment.paymentStatus).toBe("paid");
    });
  });
});
