import { vehicle } from "../../domain/entities/vehicle.entity";
import { VehicleGateway } from "../../application/ports/vehicle.gateway";
import { CoreVehicleHttpRepository } from "../../infra/repositories/core-vehicle-http.repository";

export class GetAllVehiclesUseCase {
  constructor(
    private vehicleRepository: VehicleGateway = new CoreVehicleHttpRepository()
  ) {}

  async execute(filter: string): Promise<vehicle[]> {
    return this.vehicleRepository.getAll(filter);
  }
}
