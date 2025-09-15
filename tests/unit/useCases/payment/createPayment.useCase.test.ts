import { CreatePaymentUseCase } from "../../../../src/useCases/payment/createPayment.useCase";
import { MockPaymentRepository } from "../../../mocks/payment.repository.mock";

jest.mock("../../../../src/infra/repositories/payment.repository", () => {
  return {
    PaymentRepository: jest
      .fn()
      .mockImplementation(() => new MockPaymentRepository()),
  };
});

describe("CreatePaymentUseCase", () => {
  let useCase: CreatePaymentUseCase;
  let mockRepository: MockPaymentRepository;

  beforeEach(() => {
    useCase = new CreatePaymentUseCase();
    mockRepository = (useCase as any)
      .paymentRepository as MockPaymentRepository;
    mockRepository.clear();
  });

  describe("execute", () => {
    it("should create a payment successfully", async () => {
      const vehicleId = "1";
      const buyerCpf = "123.456.789-00";

      const result = await useCase.execute(vehicleId, buyerCpf);

      expect(result).toMatchObject({
        id: expect.stringContaining("payment-"),
        vehicleId: "1",
        buyerCpf: "123.456.789-00",
        saleDate: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
        paymentStatus: "pending",
      });
    });

    it("should generate unique payment IDs for different vehicles", async () => {
      const payment1 = await useCase.execute("1", "123.456.789-00");
      const payment2 = await useCase.execute("2", "987.654.321-00");

      expect(payment1?.id).not.toBe(payment2?.id);
      expect(payment1?.vehicleId).toBe("1");
      expect(payment2?.vehicleId).toBe("2");
    });

    it("should set current date as sale date", async () => {
      const today = new Date().toISOString().split("T")[0];

      const result = await useCase.execute("1", "123.456.789-00");

      expect(result?.saleDate).toBe(today);
    });

    it("should set payment status as pending by default", async () => {
      const result = await useCase.execute("1", "123.456.789-00");

      expect(result?.paymentStatus).toBe("pending");
    });
  });
});
