import request from "supertest";
import { createTestApp } from "../../helpers/test-app.helper";
import { MockPaymentRepository } from "../../mocks/payment.repository.mock";
import { MockVehicleRepository } from "../../mocks/vehicle.repository.mock";

jest.mock("../../../src/infra/repositories/payment.repository", () => {
  return {
    PaymentRepository: jest
      .fn()
      .mockImplementation(() => new MockPaymentRepository()),
  };
});

jest.mock("../../../src/infra/repositories/vehicle.repository", () => {
  return {
    VehicleRepository: jest
      .fn()
      .mockImplementation(() => new MockVehicleRepository()),
  };
});

describe("PaymentController Integration Tests", () => {
  const app = createTestApp();

  describe("POST /webhook/payment", () => {
    it("should handle payment webhook with canceled status", async () => {
      const webhookData = {
        paymentCode: "payment-456",
        status: "canceled",
      };

      const response = await request(app)
        .post("/webhook/payment")
        .send(webhookData)
        .expect(200);

      expect(response.body).toMatchObject({
        message: "Payment status updated to canceled",
      });
    });

    it("should return 404 for non-existent payment", async () => {
      const webhookData = {
        paymentCode: "non-existent-payment",
        status: "paid",
      };

      const response = await request(app)
        .post("/webhook/payment")
        .send(webhookData)
        .expect(404);

      expect(response.body).toHaveProperty("message");
    });
  });
});
