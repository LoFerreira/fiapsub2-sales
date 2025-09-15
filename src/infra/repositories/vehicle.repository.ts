import { vehicle } from "../../domain/entities/vehicle.entity";
import { VehicleGateway } from "../../application/ports/vehicle.gateway";
import { CoreVehicleHttpRepository } from "./core-vehicle-http.repository";

// Mantém o mesmo nome/classe para compatibilidade com os testes que fazem jest.mock
export class VehicleRepository implements VehicleGateway {
  private coreRepo = new CoreVehicleHttpRepository();

  async getAll(filter: string): Promise<vehicle[]> {
    return this.coreRepo.getAll(filter);
  }
}
