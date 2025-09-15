import { Collection } from "mongodb";
import { payment } from "../../domain/entities/payment.entity";
import { PaymentGateway } from "../../application/ports/payment.gateway";
import { getCollection } from "../config/mongodb";

export class PaymentRepository implements PaymentGateway {
  private collection: Collection<payment>;

  constructor() {
    this.collection = getCollection<payment>("sales");
  }

  async generatePaymentCode(
    vehicleId: string,
    buyerCpf: string
  ): Promise<payment | null> {
    const doc: Omit<payment, "id"> = {
      vehicleId,
      buyerCpf,
      saleDate: new Date().toISOString(),
      paymentStatus: "pending",
    };
    const result = await this.collection.insertOne(doc as any);
    return { id: result.insertedId.toString(), ...(doc as any) } as payment;
  }

  async updatePaymentStatus(
    paymentCode: string,
    status: string
  ): Promise<payment> {
    const { ObjectId } = await import("mongodb");
    const _id = new ObjectId(paymentCode);
    await this.collection.updateOne({ _id } as any, {
      $set: { paymentStatus: status },
    });
    const updated = await this.collection.findOne({ _id } as any);
    return {
      id: updated?._id?.toString?.() || paymentCode,
      vehicleId: updated!.vehicleId,
      buyerCpf: updated!.buyerCpf,
      saleDate: updated!.saleDate,
      paymentStatus: updated!.paymentStatus,
    } as payment;
  }

  async getById(paymentCode: string): Promise<payment | null> {
    const { ObjectId } = await import("mongodb");
    let _id: any = paymentCode;
    // Tentar converter para ObjectId quando possível
    try {
      _id = new ObjectId(paymentCode);
    } catch {}
    const found = await this.collection.findOne({
      $or: [{ _id }, { id: paymentCode }],
    } as any);
    if (!found) return null;
    return {
      id: found._id ? found._id.toString() : (found as any).id,
      vehicleId: found.vehicleId,
      buyerCpf: found.buyerCpf,
      saleDate: found.saleDate,
      paymentStatus: found.paymentStatus,
    } as payment;
  }

  async getAll(): Promise<payment[]> {
    const cursor = this.collection.find({} as any).sort({ _id: -1 } as any);
    const list = await cursor.toArray();
    return list.map((doc: any) => ({
      id: (doc._id?.toString?.() as string) || doc.id,
      vehicleId: doc.vehicleId,
      buyerCpf: doc.buyerCpf,
      saleDate: doc.saleDate,
      paymentStatus: doc.paymentStatus,
    }));
  }
}
