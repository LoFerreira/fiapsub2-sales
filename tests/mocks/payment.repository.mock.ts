import { payment } from "../../src/domain/entities/payment.entity";

const sharedPayments: payment[] = [
  {
    id: "payment-123",
    vehicleId: "1",
    buyerCpf: "123.456.789-00",
    saleDate: "2025-08-12",
    paymentStatus: "pending",
  },
  {
    id: "payment-456",
    vehicleId: "2",
    buyerCpf: "987.654.321-00",
    saleDate: "2025-08-12",
    paymentStatus: "pending",
  },
];

export class MockPaymentRepository {
  private payments: payment[] = sharedPayments;

  async generatePaymentCode(
    vehicleId: string,
    buyerCpf: string
  ): Promise<payment> {
    const newPayment: payment = {
      id: `payment-${this.payments.length + 1}`,
      vehicleId,
      buyerCpf,
      saleDate: new Date().toISOString().split("T")[0],
      paymentStatus: "pending",
    };

    this.payments.push(newPayment);
    return newPayment;
  }

  async updatePaymentStatus(
    paymentId: string,
    status: string
  ): Promise<payment> {
    const paymentIndex = this.payments.findIndex((p) => p.id === paymentId);
    if (paymentIndex === -1) {
      throw new Error("Payment not found");
    }

    this.payments[paymentIndex].paymentStatus = status;
    return this.payments[paymentIndex];
  }

  async getById(id: string): Promise<payment | null> {
    return this.payments.find((p) => p.id === id) || null;
  }

  async findById(id: string): Promise<payment | null> {
    return this.payments.find((p) => p.id === id) || null;
  }

  clear(): void {
    this.payments = [];
  }

  getAll(): payment[] {
    return [...this.payments];
  }
}
