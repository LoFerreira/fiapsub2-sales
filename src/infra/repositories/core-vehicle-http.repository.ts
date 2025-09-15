import axios from "axios";
import { vehicle } from "../../domain/entities/vehicle.entity";
import { VehicleGateway } from "../../application/ports/vehicle.gateway";
import { coreApiBaseUrl } from "../config/core.config";

// Repository que consome o fiapsub2-core via HTTP
export class CoreVehicleHttpRepository implements VehicleGateway {
  async getAll(filter?: string): Promise<vehicle[]> {
    const res = await axios.get(`${coreApiBaseUrl}/vehicles`, {
      params: filter ? { filter } : undefined,
    });
    // Assume que o core já retorna no formato de presenter compatível com 'vehicle'
    return res.data as vehicle[];
  }

  // Métodos abaixo não são usados neste contexto. Lançamos erro explícito para evitar uso indevido.
  async getById(): Promise<vehicle | null> {
    throw new Error("Not implemented in CoreVehicleHttpRepository");
  }
  async create(): Promise<vehicle> {
    throw new Error("Not implemented in CoreVehicleHttpRepository");
  }
  async update(): Promise<vehicle | null> {
    throw new Error("Not implemented in CoreVehicleHttpRepository");
  }
  async sell(id: string, buyerCpf: string): Promise<vehicle | null> {
    const res = await axios.post(`${coreApiBaseUrl}/vehicles/${id}/sell`, {
      buyerCpf,
    });
    // O core responde com { message, vehicle }
    return (res.data?.vehicle ?? null) as vehicle | null;
  }
}
