import request from "supertest";
import { createTestApp } from "../../helpers/test-app.helper";
import { MockPaymentRepository } from "../../mocks/payment.repository.mock";

jest.mock("../../../src/infra/repositories/payment.repository", () => {
  return {
    PaymentRepository: jest
      .fn()
      .mockImplementation(() => new MockPaymentRepository()),
  };
});

jest.mock(
  "../../../src/infra/repositories/core-vehicle-http.repository",
  () => {
    return {
      CoreVehicleHttpRepository: jest.fn().mockImplementation(() => ({
        sell: jest.fn().mockResolvedValue({ id: "2", sold: true }),
        getAll: jest.fn(),
      })),
    };
  }
);

describe("PaymentController Integration Tests", () => {
  const app = createTestApp();

  describe("GET /sales", () => {
    it("deve listar vendas existentes", async () => {
      const res = await request(app).get("/sales").expect(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("POST /sales", () => {
    it("deve criar uma venda e retornar 201", async () => {
      const res = await request(app)
        .post("/sales")
        .send({ vehicleId: "1", buyerCpf: "123.456.789-00" })
        .expect(201);

      expect(res.body).toMatchObject({
        vehicleId: "1",
        buyerCpf: "123.456.789-00",
        paymentStatus: "pending",
      });
    });
  });

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

    it("deve marcar veículo como vendido quando status='paid'", async () => {
      const sale = await request(app)
        .post("/sales")
        .send({ vehicleId: "2", buyerCpf: "987.654.321-00" })
        .expect(201);

      const response = await request(app)
        .post("/webhook/payment")
        .send({ paymentCode: sale.body.id, status: "paid" })
        .expect(200);

      expect(response.body).toEqual({
        message: "Payment status updated to paid",
      });
    });
  });
});
