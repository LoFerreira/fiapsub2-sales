import { vehicle } from "../../domain/entities/vehicle.entity";
import { VehicleResponseDTO } from "../dto/vehicle.dto";

export class VehiclePresenter {
  static toResponse(vehicle: vehicle): VehicleResponseDTO {
    return {
      id: vehicle.id,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      color: vehicle.color,
      price: vehicle.price,
      sold: Boolean(vehicle.sold),
    };
  }

  static list(vehicles: vehicle[]): VehicleResponseDTO[] {
    return vehicles.map(VehiclePresenter.toResponse);
  }
}
